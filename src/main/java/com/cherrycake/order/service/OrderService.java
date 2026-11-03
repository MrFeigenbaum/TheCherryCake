package com.cherrycake.order.service;

import com.cherrycake.catalog.entity.Product;
import com.cherrycake.catalog.entity.Region;
import com.cherrycake.catalog.repository.ProductRepository;
import com.cherrycake.catalog.repository.RegionRepository;
import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.ResourceNotFoundException;
import com.cherrycake.common.exception.SlotUnavailableException;
import com.cherrycake.order.dto.DeliveryZoneDto;
import com.cherrycake.order.dto.OrderCreateRequest;
import com.cherrycake.order.dto.OrderItemResponse;
import com.cherrycake.order.dto.OrderResponse;
import com.cherrycake.order.dto.PickupPointDto;
import com.cherrycake.order.entity.DeliveryZone;
import com.cherrycake.order.entity.Order;
import com.cherrycake.order.entity.OrderItem;
import com.cherrycake.order.entity.OrderStatus;
import com.cherrycake.order.entity.OrderType;
import com.cherrycake.order.entity.PickupPoint;
import com.cherrycake.order.entity.TimeSlot;
import com.cherrycake.order.repository.DeliveryZoneRepository;
import com.cherrycake.order.repository.OrderRepository;
import com.cherrycake.order.repository.PickupPointRepository;
import com.cherrycake.order.repository.TimeSlotRepository;
import com.cherrycake.pricing.dto.CartCalculateRequest;
import com.cherrycake.pricing.dto.CartCalculateResponse;
import com.cherrycake.pricing.service.PriceCalculatorService;
import com.cherrycake.security.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService
{
    private static final AtomicLong ORDER_COUNTER = new AtomicLong(100);

    private final OrderRepository orderRepository;
    private final RegionRepository regionRepository;
    private final ProductRepository productRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final PickupPointRepository pickupPointRepository;
    private final DeliveryZoneRepository deliveryZoneRepository;
    private final PriceCalculatorService priceCalculatorService;

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, User user)
    {
        if (request == null) throw new BadRequestException("Order request cannot be null");

        // 1. Validate order date
        LocalDateTime now = LocalDateTime.now();
        if (request.getOrderDate() != null && request.getOrderDate().toLocalDate().isBefore(LocalDate.now()))
        {
            throw new BadRequestException("Order date cannot be in the past: " + request.getOrderDate());
        }

        // 2. Validate fulfillment requirements
        if (request.getOrderType() == OrderType.PICKUP)
        {
            if (request.getPickupPointId() == null)
            {
                throw new BadRequestException("pickupPointId is required for PICKUP");
            }
        }
        else if (request.getOrderType() == OrderType.DELIVERY)
        {
            if (request.getDeliveryZoneId() == null)
            {
                throw new BadRequestException("deliveryZoneId is required for DELIVERY");
            }
        }

        Region region = regionRepository.findByCodeIgnoreCase(request.getRegionCode())
            .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + request.getRegionCode()));

        // 3. Time slot capacity check & reservation
        TimeSlot timeSlot = null;
        if (request.getTimeSlotId() != null)
        {
            timeSlot = timeSlotRepository.findById(request.getTimeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found: " + request.getTimeSlotId()));

            if (timeSlot.isFull())
            {
                throw new SlotUnavailableException("Выбранный слот уже заполнен, выберите другое время");
            }
            timeSlot.setReservedCount(timeSlot.getReservedCount() + 1);
            timeSlotRepository.save(timeSlot);
        }

        // 4. Pickup point
        PickupPoint pickupPoint = null;
        if (request.getOrderType() == OrderType.PICKUP && request.getPickupPointId() != null)
        {
            pickupPoint = pickupPointRepository.findById(request.getPickupPointId())
                .orElseThrow(() -> new ResourceNotFoundException("Pickup point not found: " + request.getPickupPointId()));
        }

        // 5. Delivery zone
        DeliveryZone deliveryZone = null;
        if (request.getOrderType() == OrderType.DELIVERY && request.getDeliveryZoneId() != null)
        {
            deliveryZone = deliveryZoneRepository.findById(request.getDeliveryZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery zone not found: " + request.getDeliveryZoneId()));
        }

        // 6. Recalculate totals server-side (prevent client price tampering)
        CartCalculateRequest calcRequest = CartCalculateRequest.builder()
            .regionCode(region.getCode())
            .items(request.getItems())
            .promoCode(request.getPromoCode())
            .orderType(request.getOrderType())
            .deliveryZoneId(request.getDeliveryZoneId())
            .build();

        CartCalculateResponse calcResult = priceCalculatorService.calculateCart(calcRequest);

        // 7. Generate order number matching CC-YYYY-XXXXXX mask
        int year = LocalDate.now().getYear();
        long seq = ORDER_COUNTER.incrementAndGet();
        String orderNumber = String.format("CC-%d-%06d", year, seq);
        while (orderRepository.existsByOrderNumber(orderNumber))
        {
            seq = ORDER_COUNTER.incrementAndGet();
            orderNumber = String.format("CC-%d-%06d", year, seq);
        }

        Order order = Order.builder()
            .orderNumber(orderNumber)
            .user(user)
            .region(region)
            .slot(timeSlot)
            .pickupPoint(pickupPoint)
            .deliveryZone(deliveryZone)
            .orderType(request.getOrderType())
            .status(OrderStatus.NEW)
            .subtotal(calcResult.getSubtotal())
            .vatRate(calcResult.getVatRate())
            .vatAmount(calcResult.getVatAmount())
            .amountInclVat(calcResult.getAmountInclVat())
            .discountRate(calcResult.getDiscountRate())
            .discountAmount(calcResult.getDiscountAmount())
            .deliveryFee(calcResult.getDeliveryFee())
            .totalAmount(calcResult.getTotal())
            .currency(calcResult.getCurrencyCode())
            .promoCode(request.getPromoCode())
            .customerName(request.getCustomerName())
            .customerEmail(request.getCustomerEmail())
            .customerPhone(request.getCustomerPhone())
            .deliveryAddress(request.getDeliveryAddress())
            .orderDate(request.getOrderDate() != null ? request.getOrderDate() : now)
            .createdAt(now)
            .items(new ArrayList<>())
            .build();

        for (CartCalculateResponse.CalculatedItemDto calcItem : calcResult.getItems())
        {
            Product product = productRepository.findById(calcItem.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + calcItem.getProductId()));

            OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .productName(calcItem.getName())
                .quantity(calcItem.getQuantity())
                .unitPrice(calcItem.getUnitPrice())
                .modifiersCost(calcItem.getModifiersPrice() != null ? calcItem.getModifiersPrice() : java.math.BigDecimal.ZERO)
                .totalPrice(calcItem.getLineTotal())
                .selectedModifiers(calcItem.getModifiers() != null ? String.join(", ", calcItem.getModifiers()) : "")
                .build();

            order.getItems().add(orderItem);
        }

        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber)
    {
        Order order = orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id)
    {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId)
    {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(OrderStatus status)
    {
        List<Order> orders = status != null ? orderRepository.findByStatus(status) : orderRepository.findAll();
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus)
    {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus current = order.getStatus();

        // Check invalid transitions: direct NEW -> DONE is prohibited
        if (current == OrderStatus.NEW && (newStatus == OrderStatus.DONE || newStatus == OrderStatus.DELIVERED))
        {
            throw new BadRequestException("Invalid status transition: order must be CONFIRMED before it can be DONE");
        }

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    private OrderResponse mapToResponse(Order order)
    {
        List<OrderItemResponse> itemResponses = order.getItems().stream().map
        (item -> OrderItemResponse.builder()
            .id(item.getId())
            .productId(item.getProduct() != null ? item.getProduct().getId() : null)
            .productName(item.getProductName())
            .quantity(item.getQuantity())
            .unitPrice(item.getUnitPrice())
            .modifiersCost(item.getModifiersCost())
            .totalPrice(item.getTotalPrice())
            .selectedModifiers(item.getSelectedModifiers())
            .build()
        ).collect(Collectors.toList());

        PickupPointDto ppDto = null;
        if (order.getPickupPoint() != null)
        {
            ppDto = PickupPointDto.builder()
                .id(order.getPickupPoint().getId())
                .name(order.getPickupPoint().getName())
                .address(order.getPickupPoint().getAddress())
                .workingHours(order.getPickupPoint().getWorkingHours())
                .build();
        }

        DeliveryZoneDto dzDto = null;
        if (order.getDeliveryZone() != null)
        {
            dzDto = DeliveryZoneDto.builder()
                .id(order.getDeliveryZone().getId())
                .name(order.getDeliveryZone().getName())
                .deliveryFee(order.getDeliveryZone().getDeliveryFee())
                .estimatedMinutes(order.getDeliveryZone().getEstimatedMinutes())
                .build();
        }

        return OrderResponse.builder()
            .id(order.getId())
            .orderNumber(order.getOrderNumber())
            .orderType(order.getOrderType())
            .status(order.getStatus())
            .regionCode(order.getRegion() != null ? order.getRegion().getCode() : "")
            .currencyCode(order.getCurrency())
            .subtotal(order.getSubtotal())
            .vatRate(order.getVatRate())
            .vatAmount(order.getVatAmount())
            .amountInclVat(order.getAmountInclVat())
            .discountRate(order.getDiscountRate() != null ? order.getDiscountRate() : java.math.BigDecimal.ZERO)
            .discountAmount(order.getDiscountAmount())
            .deliveryFee(order.getDeliveryFee())
            .total(order.getTotalAmount())
            .customerName(order.getCustomerName())
            .customerEmail(order.getCustomerEmail())
            .customerPhone(order.getCustomerPhone())
            .deliveryAddress(order.getDeliveryAddress())
            .pickupPointName(order.getPickupPoint() != null ? order.getPickupPoint().getName() : null)
            .pickupPoint(ppDto)
            .deliveryZone(dzDto)
            .timeSlot(order.getSlot() != null ? order.getSlot().getSlotTime() : null)
            .orderDate(order.getOrderDate())
            .createdAt(order.getCreatedAt())
            .items(itemResponses)
            .build();
    }
}
