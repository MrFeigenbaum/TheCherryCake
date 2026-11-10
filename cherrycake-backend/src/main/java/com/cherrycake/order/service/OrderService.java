package com.cherrycake.order.service;

import com.cherrycake.catalog.entity.Product;
import com.cherrycake.catalog.entity.Region;
import com.cherrycake.catalog.repository.ProductRepository;
import com.cherrycake.catalog.repository.RegionRepository;
import com.cherrycake.catalog.service.CatalogService;
import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.ConflictException;
import com.cherrycake.common.exception.NotFoundException;
import com.cherrycake.order.dto.CreateOrderRequest;
import com.cherrycake.order.dto.OrderResponse;
import com.cherrycake.order.entity.DeliveryZone;
import com.cherrycake.order.entity.Order;
import com.cherrycake.order.entity.OrderItem;
import com.cherrycake.order.entity.PickupPoint;
import com.cherrycake.order.entity.TimeSlot;
import com.cherrycake.order.repository.DeliveryZoneRepository;
import com.cherrycake.order.repository.OrderRepository;
import com.cherrycake.order.repository.PickupPointRepository;
import com.cherrycake.order.repository.TimeSlotRepository;
import com.cherrycake.pricing.dto.CalculateCartRequest;
import com.cherrycake.pricing.dto.CalculateCartResponse;
import com.cherrycake.pricing.service.CartCalculationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Validates and persists guest orders with optional fulfillment/slot reservation (CC-24 / CC-38).
 */
@Service
public class OrderService {

    private static final AtomicLong ORDER_SEQ = new AtomicLong(100);
    private static final BigDecimal ZERO_FEE = new BigDecimal("0.00");

    private final OrderRepository orderRepository;
    private final CatalogService catalogService;
    private final CartCalculationService cartCalculationService;
    private final ProductRepository productRepository;
    private final RegionRepository regionRepository;
    private final PickupPointRepository pickupPointRepository;
    private final DeliveryZoneRepository deliveryZoneRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ObjectMapper objectMapper;

    public OrderService(
            OrderRepository orderRepository,
            CatalogService catalogService,
            CartCalculationService cartCalculationService,
            ProductRepository productRepository,
            RegionRepository regionRepository,
            PickupPointRepository pickupPointRepository,
            DeliveryZoneRepository deliveryZoneRepository,
            TimeSlotRepository timeSlotRepository,
            ObjectMapper objectMapper) {
        this.orderRepository = orderRepository;
        this.catalogService = catalogService;
        this.cartCalculationService = cartCalculationService;
        this.productRepository = productRepository;
        this.regionRepository = regionRepository;
        this.pickupPointRepository = pickupPointRepository;
        this.deliveryZoneRepository = deliveryZoneRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Region region = catalogService.getRegion(request.region());

        if (request.pickupPointId() != null && request.deliveryZoneId() != null) {
            throw new BadRequestException("Specify either pickupPointId or deliveryZoneId, not both");
        }

        if (request.pickupPointId() != null) {
            PickupPoint pickup = pickupPointRepository.findById(request.pickupPointId())
                    .orElseThrow(() -> new NotFoundException("Pickup point not found: " + request.pickupPointId()));
            if (!pickup.getRegionId().equals(region.getId())) {
                throw new BadRequestException("Pickup point does not belong to region " + region.getCode());
            }
        }

        BigDecimal deliveryFee = ZERO_FEE;
        if (request.deliveryZoneId() != null) {
            DeliveryZone zone = deliveryZoneRepository.findById(request.deliveryZoneId())
                    .orElseThrow(() -> new NotFoundException("Delivery zone not found: " + request.deliveryZoneId()));
            if (!zone.getRegionId().equals(region.getId())) {
                throw new BadRequestException("Delivery zone does not belong to region " + region.getCode());
            }
            deliveryFee = zone.getDeliveryFee();
        }

        if (request.timeSlotId() != null) {
            TimeSlot slot = timeSlotRepository.findById(request.timeSlotId())
                    .orElseThrow(() -> new NotFoundException("Time slot not found: " + request.timeSlotId()));
            if (!slot.isAvailable()) {
                throw new ConflictException("Time slot " + slot.getStartTime() + " on " + slot.getSlotDate() + " is full");
            }
            slot.setBookedCount(slot.getBookedCount() + 1);
            timeSlotRepository.save(slot);
        }

        CalculateCartResponse calculated = cartCalculationService.calculate(
                new CalculateCartRequest(region.getCode(), request.items()), deliveryFee);

        List<Long> productIds = request.items().stream()
                .map(CalculateCartRequest.Item::productId)
                .distinct()
                .toList();
        Map<Long, Product> productsById = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        Order order = new Order();
        order.setOrderNumber(nextOrderNumber());
        order.setOrderDate(request.orderDate());
        order.setRegionId(region.getId());
        order.setPickupPointId(request.pickupPointId());
        order.setDeliveryZoneId(request.deliveryZoneId());
        order.setTimeSlotId(request.timeSlotId());
        order.setCustomerName(request.customer().name().trim());
        order.setPhone(request.customer().phone().trim());
        order.setEmail(request.customer().email().trim());
        order.setSubtotal(calculated.subtotal());
        order.setVatRate(calculated.vatRate());
        order.setVatAmount(calculated.vatAmount());
        order.setAmountInclVat(calculated.amountInclVat());
        order.setDiscountRate(calculated.discountRate());
        order.setDiscountAmount(calculated.discountAmount());
        order.setDeliveryFee(calculated.deliveryFee());
        order.setTotal(calculated.total());
        order.setCurrencyCode(calculated.currencyCode());
        order.setCreatedAt(LocalDateTime.now());

        List<CalculateCartResponse.Item> pricedItems = calculated.items();
        for (int i = 0; i < pricedItems.size(); i++) {
            CalculateCartResponse.Item priced = pricedItems.get(i);
            CalculateCartRequest.Item reqItem = request.items().get(i);
            Product product = productsById.get(priced.productId());
            String productName = product != null ? product.getName() : "Product #" + priced.productId();

            OrderItem item = new OrderItem();
            item.setProductId(priced.productId());
            item.setProductName(productName);
            item.setQuantity(priced.quantity());
            item.setUnitPrice(priced.unitPrice());
            item.setModifiersPrice(priced.modifiersPrice());
            item.setModifiersJson(serializeModifiers(reqItem.modifierIds()));
            item.setLineTotal(priced.lineTotal());
            order.addItem(item);
        }

        Order saved = orderRepository.save(order);
        return toResponse(saved, region.getCode());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderNumber));
        String regionCode = regionRepository.findById(order.getRegionId())
                .map(Region::getCode)
                .orElse("UNKNOWN");
        return toResponse(order, regionCode);
    }

    private String nextOrderNumber() {
        int year = Year.now().getValue();
        long candidate = Math.max(ORDER_SEQ.incrementAndGet(), orderRepository.count() + 101);
        String number = String.format("CC-%d-%06d", year, candidate);
        while (orderRepository.existsByOrderNumber(number)) {
            candidate = ORDER_SEQ.incrementAndGet();
            number = String.format("CC-%d-%06d", year, candidate);
        }
        return number;
    }

    private String serializeModifiers(List<Long> modifierIds) {
        try {
            return objectMapper.writeValueAsString(modifierIds == null ? List.of() : modifierIds);
        } catch (JsonProcessingException ex) {
            return "[]";
        }
    }

    private OrderResponse toResponse(Order order, String regionCode) {
        List<OrderResponse.Item> items = order.getItems().stream()
                .map(i -> new OrderResponse.Item(
                        i.getProductId(),
                        i.getProductName(),
                        i.getUnitPrice(),
                        i.getModifiersPrice(),
                        i.getQuantity(),
                        i.getLineTotal()))
                .toList();

        return new OrderResponse(
                order.getOrderNumber(),
                order.getOrderDate(),
                regionCode,
                new OrderResponse.Customer(order.getCustomerName(), order.getPhone(), order.getEmail()),
                items,
                order.getSubtotal(),
                order.getVatRate(),
                order.getVatAmount(),
                order.getAmountInclVat(),
                order.getDiscountRate(),
                order.getDiscountAmount(),
                order.getDeliveryFee(),
                order.getTotal(),
                order.getCurrencyCode());
    }
}
