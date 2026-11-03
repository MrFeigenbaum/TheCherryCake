package com.cherrycake.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.ProductUnavailableException;
import com.cherrycake.common.exception.PromoCodeInvalidException;
import com.cherrycake.common.exception.ResourceNotFoundException;
import com.cherrycake.dto.request.CartCalculateRequest;
import com.cherrycake.dto.request.CartItemDto;
import com.cherrycake.dto.response.CartCalculateResponse;
import com.cherrycake.dto.response.CartCalculateResponse.CalculatedItemDto;
import com.cherrycake.model.entity.DeliveryZone;
import com.cherrycake.model.entity.Discount;
import com.cherrycake.model.entity.Product;
import com.cherrycake.model.entity.ProductModifier;
import com.cherrycake.model.entity.ProductPrice;
import com.cherrycake.model.entity.Region;
import com.cherrycake.model.enums.DiscountType;
import com.cherrycake.model.enums.OrderType;
import com.cherrycake.repository.DeliveryZoneRepository;
import com.cherrycake.repository.DiscountRepository;
import com.cherrycake.repository.ProductModifierRepository;
import com.cherrycake.repository.ProductPriceRepository;
import com.cherrycake.repository.ProductRepository;
import com.cherrycake.repository.RegionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PriceCalculatorService
{
    private static final int SCALE = 2;
    private static final RoundingMode ROUNDING = RoundingMode.HALF_UP;
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");

    private final RegionRepository regionRepository;
    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;
    private final ProductModifierRepository productModifierRepository;
    private final DiscountRepository discountRepository;
    private final DeliveryZoneRepository deliveryZoneRepository;

    public CartCalculateResponse calculate(CartCalculateRequest request)
    {
        return calculateCart(request);
    }

    public CartCalculateResponse calculateCart(CartCalculateRequest request)
    {
        if (request == null)
        {
            throw new BadRequestException("Calculate request cannot be null");
        }

        // 1. Resolve Region
        String regionCode = request.getRegionCode();
        if (regionCode == null || regionCode.trim().isEmpty())
        {
            throw new BadRequestException("Region code is required");
        }

        Region region = regionRepository.findByCodeIgnoreCase(regionCode.trim())
            .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + regionCode));

        BigDecimal vatRate = region.getVatRateFraction(); // e.g. 0.12

        // 2. Validate Items
        if (request.getItems() == null || request.getItems().isEmpty())
        {
            throw new BadRequestException("Cart items cannot be empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO.setScale(SCALE, ROUNDING);
        List<CalculatedItemDto> calculatedItems = new ArrayList<>();

        for (int i = 0; i < request.getItems().size(); i++)
        {
            CartItemDto item = request.getItems().get(i);
            if (item.getQuantity() == null || item.getQuantity() <= 0)
            {
                Map<String, String> errors = new HashMap<>();
                errors.put("items[" + i + "].quantity", "must be >= 1");
                throw new BadRequestException("Item quantity must be at least 1: " + errors);
            }

            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProductId()));

            ProductPrice productPrice = productPriceRepository
                .findByProductIdAndRegionId(product.getId(), region.getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Price not configured for product '%s' in region '%s'", product.getName(), region.getCode())));

            if (!productPrice.isAvailable())
            {
                Map<String, String> errors = Collections.singletonMap("items[" + i + "].productId", "not available in region " + region.getCode());
                throw new ProductUnavailableException("Товар недоступен в выбранном регионе: " + product.getName(), errors);
            }

            BigDecimal baseUnitPrice = productPrice.getPrice().setScale(SCALE, ROUNDING);

            // Modifiers validation & calculation
            List<ProductModifier> productModifiers = productModifierRepository.findByProductId(product.getId());
            Set<Long> selectedModifierIds = item.getModifierIds() != null ? new HashSet<>(item.getModifierIds()) : Collections.emptySet();

            // Group validation (Required groups and SINGLE groups)
            Map<String, List<ProductModifier>> groups = new HashMap<>();
            for (ProductModifier pm : productModifiers)
            {
                String gName = pm.getGroupName() != null ? pm.getGroupName() : "Default";
                groups.computeIfAbsent(gName, k -> new ArrayList<>()).add(pm);
            }

            for (Map.Entry<String, List<ProductModifier>> entry : groups.entrySet())
            {
                List<ProductModifier> groupMods = entry.getValue();
                boolean isRequired = groupMods.stream().anyMatch(ProductModifier::isRequired);
                boolean isSingle = groupMods.stream().anyMatch(m -> "SINGLE".equalsIgnoreCase(m.getGroupType()));

                long countSelectedInGroup = groupMods.stream().filter(m -> selectedModifierIds.contains(m.getId())).count();

                if (isRequired && countSelectedInGroup == 0)
                {
                    throw new BadRequestException("Required modifier group '" + entry.getKey() + "' has no selected option");
                }
                if (isSingle && countSelectedInGroup > 1)
                {
                    throw new BadRequestException("Single-choice modifier group '" + entry.getKey() + "' cannot have multiple selections");
                }
            }

            BigDecimal modifiersPerUnit = BigDecimal.ZERO.setScale(SCALE, ROUNDING);
            List<String> modifierNames = new ArrayList<>();

            if (!selectedModifierIds.isEmpty())
            {
                List<ProductModifier> selected = productModifierRepository.findAllById(selectedModifierIds);
                for (ProductModifier m : selected)
                {
                    modifiersPerUnit = modifiersPerUnit.add(m.getPriceDelta());
                    modifierNames.add(m.getName());
                }
            }
            modifiersPerUnit = modifiersPerUnit.setScale(SCALE, ROUNDING);

            BigDecimal effectiveUnitPrice = baseUnitPrice.add(modifiersPerUnit).setScale(SCALE, ROUNDING);
            BigDecimal lineTotal = effectiveUnitPrice.multiply(BigDecimal.valueOf(item.getQuantity())).setScale(SCALE, ROUNDING);
            subtotal = subtotal.add(lineTotal).setScale(SCALE, ROUNDING);

            calculatedItems.add(CalculatedItemDto.builder()
                .productId(product.getId())
                .name(product.getName())
                .quantity(item.getQuantity())
                .unitPrice(effectiveUnitPrice)
                .modifiersPrice(modifiersPerUnit)
                .lineTotal(lineTotal)
                .modifiers(modifierNames)
                .build());
        }

        // 3. VAT Computation
        BigDecimal vatAmount = subtotal.multiply(vatRate).setScale(SCALE, ROUNDING);
        BigDecimal amountInclVat = subtotal.add(vatAmount).setScale(SCALE, ROUNDING);

        // 4. Promo Code Validation & Discount Rate Resolution
        BigDecimal promoRate = BigDecimal.ZERO;
        String discountDescription = "No discount applied";

        if (request.getPromoCode() != null && !request.getPromoCode().trim().isEmpty())
        {
            String promoCode = request.getPromoCode().trim();
            Optional<Discount> promoOpt = discountRepository.findByCodeIgnoreCaseAndActiveTrue(promoCode);
            if (promoOpt.isEmpty() || promoOpt.get().isExpired())
            {
                throw new PromoCodeInvalidException("Промокод недействителен: " + promoCode);
            }
            Discount promo = promoOpt.get();
            if (promo.getPercentage().compareTo(BigDecimal.ZERO) > 0)
            {
                promoRate = promo.getPercentage().divide(ONE_HUNDRED, 4, ROUNDING);
                discountDescription = promo.getName() + " (" + promo.getPercentage().setScale(0, ROUNDING) + "%)";
            }
        }

        // Threshold Discount Resolution (checked against amountInclVat strictly >=)
        BigDecimal thresholdRate = BigDecimal.ZERO;
        List<Discount> thresholdDiscounts = discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD);
        for (Discount threshold : thresholdDiscounts)
        {
            if (amountInclVat.compareTo(threshold.getMinSubtotal()) >= 0)
            {
                BigDecimal rate = threshold.getPercentage().divide(ONE_HUNDRED, 4, ROUNDING);
                if (rate.compareTo(thresholdRate) > 0)
                {
                    thresholdRate = rate;
                    if (promoRate.compareTo(thresholdRate) < 0)
                    {
                        discountDescription = threshold.getName() + " (" + threshold.getPercentage().setScale(0, ROUNDING) + "%)";
                    }
                }
            }
        }

        // Take max of promoRate and thresholdRate
        BigDecimal effectiveDiscountRate = promoRate.max(thresholdRate).setScale(4, ROUNDING);
        BigDecimal discountAmount = amountInclVat.multiply(effectiveDiscountRate).setScale(SCALE, ROUNDING);

        // 5. Delivery Fee
        BigDecimal deliveryFee = BigDecimal.ZERO.setScale(SCALE, ROUNDING);
        if (request.getOrderType() == OrderType.DELIVERY)
        {
            if (request.getDeliveryZoneId() == null)
            {
                throw new BadRequestException("deliveryZoneId is required for DELIVERY");
            }
            DeliveryZone zone = deliveryZoneRepository.findById(request.getDeliveryZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery zone not found with id: " + request.getDeliveryZoneId()));
            deliveryFee = zone.getDeliveryFee().setScale(SCALE, ROUNDING);
        }

        // 6. Total = amountInclVat - discountAmount + deliveryFee
        BigDecimal total = amountInclVat.subtract(discountAmount).add(deliveryFee).setScale(SCALE, ROUNDING);
        if (total.compareTo(BigDecimal.ZERO) < 0)
        {
            total = BigDecimal.ZERO.setScale(SCALE, ROUNDING);
        }

        // Display rate as 2-decimal fraction e.g. 0.05 or 0.12
        BigDecimal displayDiscountRate = effectiveDiscountRate.setScale(2, ROUNDING);
        BigDecimal displayVatRate = vatRate.setScale(2, ROUNDING);

        return CartCalculateResponse.builder()
            .regionCode(region.getCode())
            .currencyCode(region.getCurrencyCode())
            .currencySymbol(region.getCurrencySymbol())
            .subtotal(subtotal)
            .vatRate(displayVatRate)
            .vatAmount(vatAmount)
            .amountInclVat(amountInclVat)
            .discountRate(displayDiscountRate)
            .discountAmount(discountAmount)
            .discountDescription(discountDescription)
            .deliveryFee(deliveryFee)
            .total(total)
            .items(calculatedItems)
            .build();
    }
}
