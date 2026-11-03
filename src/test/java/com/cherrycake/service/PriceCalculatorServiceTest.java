package com.cherrycake.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.ProductUnavailableException;
import com.cherrycake.common.exception.PromoCodeInvalidException;
import com.cherrycake.common.exception.ResourceNotFoundException;
import com.cherrycake.dto.request.CartCalculateRequest;
import com.cherrycake.dto.request.CartItemDto;
import com.cherrycake.dto.response.CartCalculateResponse;
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
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PriceCalculatorServiceTest
{
    @Mock
    private RegionRepository regionRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductPriceRepository productPriceRepository;
    @Mock
    private ProductModifierRepository productModifierRepository;
    @Mock
    private DiscountRepository discountRepository;
    @Mock
    private DeliveryZoneRepository deliveryZoneRepository;

    @InjectMocks
    private PriceCalculatorService priceCalculatorService;

    private Region uzbekistan;
    private Region russia;
    private Product cake;
    private ProductPrice uzbCakePrice;
    private ProductPrice ruCakePrice;
    private ProductModifier extraCompote;
    private DeliveryZone centerZone;
    private Discount discount5;
    private Discount discount10;
    private Discount promo10;
    private Discount expiredPromo;

    @BeforeEach
    void setUp()
    {
        uzbekistan = Region.builder()
            .id(1L)
            .code("UZ")
            .name("Uzbekistan")
            .currencyCode("UZS")
            .currencySymbol("soʻm")
            .vatRate(new BigDecimal("12.00"))
            .active(true)
            .build();

        russia = Region.builder()
            .id(2L)
            .code("RU")
            .name("Russia")
            .currencyCode("RUB")
            .currencySymbol("₽")
            .vatRate(new BigDecimal("20.00"))
            .active(true)
            .build();

        cake = Product.builder()
            .id(10L)
            .code("CHERRY_BLOSSOM")
            .name("Cherry Blossom Signature Cake")
            .available(true)
            .build();

        uzbCakePrice = ProductPrice.builder()
            .id(100L)
            .product(cake)
            .region(uzbekistan)
            .price(new BigDecimal("100.00"))
            .available(true)
            .build();

        ruCakePrice = ProductPrice.builder()
            .id(101L)
            .product(cake)
            .region(russia)
            .price(new BigDecimal("120.00"))
            .available(true)
            .build();

        extraCompote = ProductModifier.builder()
            .id(50L)
            .product(cake)
            .name("Extra Cherry Compote")
            .priceDelta(new BigDecimal("10.00"))
            .groupName("Toppings")
            .groupType("SINGLE")
            .required(false)
            .build();

        centerZone = DeliveryZone.builder()
            .id(1L)
            .region(uzbekistan)
            .name("Center")
            .deliveryFee(new BigDecimal("5.00"))
            .build();

        discount5 = Discount.builder()
            .id(1L)
            .name("5% threshold")
            .discountType(DiscountType.THRESHOLD)
            .minSubtotal(new BigDecimal("200.00"))
            .percentage(new BigDecimal("5.00"))
            .active(true)
            .build();

        discount10 = Discount.builder()
            .id(2L)
            .name("10% threshold")
            .discountType(DiscountType.THRESHOLD)
            .minSubtotal(new BigDecimal("500.00"))
            .percentage(new BigDecimal("10.00"))
            .active(true)
            .build();

        promo10 = Discount.builder()
            .id(3L)
            .name("Promo 10%")
            .discountType(DiscountType.PROMO_CODE)
            .code("PROMO10")
            .percentage(new BigDecimal("10.00"))
            .active(true)
            .build();

        expiredPromo = Discount.builder()
            .id(4L)
            .name("Expired Promo")
            .discountType(DiscountType.PROMO_CODE)
            .code("EXPIRED")
            .percentage(new BigDecimal("15.00"))
            .validTo(LocalDate.now().minusDays(1))
            .active(true)
            .build();
    }

    @Test
    @DisplayName("C01: UZ, 1 product 100.00 x 1, PICKUP -> subtotal 100, vat 12, incl 112, total 112")
    void testC01_BasicCalculationUzbekistan()
    {
        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of());

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(1).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        assertThat(response.getSubtotal()).isEqualByComparingTo(new BigDecimal("100.00"));
        assertThat(response.getVatRate()).isEqualByComparingTo(new BigDecimal("0.12"));
        assertThat(response.getVatAmount()).isEqualByComparingTo(new BigDecimal("12.00"));
        assertThat(response.getAmountInclVat()).isEqualByComparingTo(new BigDecimal("112.00"));
        assertThat(response.getDiscountAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getDeliveryFee()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("112.00"));
    }

    @Test
    @DisplayName("C02: RU, product 120.00 x 1 -> vat 24.00, total 144.00")
    void testC02_RegionalVatAndPriceRussia()
    {
        when(regionRepository.findByCodeIgnoreCase("RU")).thenReturn(Optional.of(russia));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 2L)).thenReturn(Optional.of(ruCakePrice));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of());

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("RU")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(1).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        assertThat(response.getSubtotal()).isEqualByComparingTo(new BigDecimal("120.00"));
        assertThat(response.getVatRate()).isEqualByComparingTo(new BigDecimal("0.20"));
        assertThat(response.getVatAmount()).isEqualByComparingTo(new BigDecimal("24.00"));
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("144.00"));
    }

    @Test
    @DisplayName("C03: UZ, 100.00 x 2 + modifier 10.00 -> lineTotal 220, incl 246.40, discount 12.32 (5%), total 234.08")
    void testC03_ModifierAndThresholdDiscount()
    {
        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(productModifierRepository.findByProductId(10L)).thenReturn(List.of(extraCompote));
        when(productModifierRepository.findAllById(any())).thenReturn(List.of(extraCompote));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of(discount5, discount10));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(2).modifierIds(List.of(50L)).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // unitPrice = 100 + 10 = 110.00
        // lineTotal = 220.00
        // vatAmount = 220 * 0.12 = 26.40
        // amountInclVat = 246.40
        // discountAmount = 246.40 * 0.05 = 12.32
        // total = 246.40 - 12.32 = 234.08
        assertThat(response.getSubtotal()).isEqualByComparingTo(new BigDecimal("220.00"));
        assertThat(response.getAmountInclVat()).isEqualByComparingTo(new BigDecimal("246.40"));
        assertThat(response.getDiscountRate()).isEqualByComparingTo(new BigDecimal("0.05"));
        assertThat(response.getDiscountAmount()).isEqualByComparingTo(new BigDecimal("12.32"));
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("234.08"));
    }

    @Test
    @DisplayName("C04: UZ, subtotal 178.58 -> incl 200.01 -> discount 5% = 10.00")
    void testC04_ThresholdAboveBoundary()
    {
        Product customProduct = Product.builder().id(20L).name("P").available(true).build();
        ProductPrice customPrice = ProductPrice.builder().id(120L).product(customProduct).region(uzbekistan).price(new BigDecimal("178.58")).available(true).build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(20L)).thenReturn(Optional.of(customProduct));
        when(productPriceRepository.findByProductIdAndRegionId(20L, 1L)).thenReturn(Optional.of(customPrice));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of(discount5));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(20L).quantity(1).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // 178.58 * 0.12 = 21.4296 -> 21.43
        // incl = 200.01 >= 200.00 -> 200.01 * 0.05 = 10.0005 -> 10.00
        assertThat(response.getAmountInclVat()).isEqualByComparingTo(new BigDecimal("200.01"));
        assertThat(response.getDiscountAmount()).isEqualByComparingTo(new BigDecimal("10.00"));
    }

    @Test
    @DisplayName("C05: UZ, subtotal 178.56 -> incl 199.99 < 200.00 -> discount 0.00")
    void testC05_ThresholdBelowBoundary()
    {
        Product customProduct = Product.builder().id(20L).name("P").available(true).build();
        ProductPrice customPrice = ProductPrice.builder().id(120L).product(customProduct).region(uzbekistan).price(new BigDecimal("178.56")).available(true).build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(20L)).thenReturn(Optional.of(customProduct));
        when(productPriceRepository.findByProductIdAndRegionId(20L, 1L)).thenReturn(Optional.of(customPrice));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of(discount5));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(20L).quantity(1).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // 178.56 * 0.12 = 21.4272 -> 21.43
        // incl = 199.99 < 200.00 -> discount 0.00
        assertThat(response.getAmountInclVat()).isEqualByComparingTo(new BigDecimal("199.99"));
        assertThat(response.getDiscountAmount()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("C06: UZ, incl exactly 200.00 -> discount 10.00 (>=, not >)")
    void testC06_ThresholdExactBoundary()
    {
        // subtotal * 1.12 = 200.00 -> subtotal = 178.5714... if subtotal 178.57 -> vat 21.43 -> incl = 200.00!
        Product customProduct = Product.builder().id(20L).name("P").available(true).build();
        ProductPrice customPrice = ProductPrice.builder().id(120L).product(customProduct).region(uzbekistan).price(new BigDecimal("178.57")).available(true).build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(20L)).thenReturn(Optional.of(customProduct));
        when(productPriceRepository.findByProductIdAndRegionId(20L, 1L)).thenReturn(Optional.of(customPrice));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of(discount5));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(20L).quantity(1).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // 178.57 * 0.12 = 21.4284 -> 21.43
        // incl = 200.00 >= 200.00 -> 200.00 * 0.05 = 10.00
        assertThat(response.getAmountInclVat()).isEqualByComparingTo(new BigDecimal("200.00"));
        assertThat(response.getDiscountAmount()).isEqualByComparingTo(new BigDecimal("10.00"));
    }

    @Test
    @DisplayName("C07: UZ, incl 500.00 -> discount 10% = 50.00 (second tier)")
    void testC07_SecondTierThreshold()
    {
        // subtotal 446.43 * 0.12 = 53.5716 -> 53.57 -> incl = 500.00
        Product customProduct = Product.builder().id(20L).name("P").available(true).build();
        ProductPrice customPrice = ProductPrice.builder().id(120L).product(customProduct).region(uzbekistan).price(new BigDecimal("446.43")).available(true).build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(20L)).thenReturn(Optional.of(customProduct));
        when(productPriceRepository.findByProductIdAndRegionId(20L, 1L)).thenReturn(Optional.of(customPrice));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of(discount5, discount10));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(20L).quantity(1).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        assertThat(response.getAmountInclVat()).isEqualByComparingTo(new BigDecimal("500.00"));
        assertThat(response.getDiscountRate()).isEqualByComparingTo(new BigDecimal("0.10"));
        assertThat(response.getDiscountAmount()).isEqualByComparingTo(new BigDecimal("50.00"));
    }

    @Test
    @DisplayName("C08: C03 + DELIVERY zone Center -> total 239.08")
    void testC08_DeliveryFeeAfterDiscount()
    {
        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(productModifierRepository.findByProductId(10L)).thenReturn(List.of(extraCompote));
        when(productModifierRepository.findAllById(any())).thenReturn(List.of(extraCompote));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of(discount5, discount10));
        when(deliveryZoneRepository.findById(1L)).thenReturn(Optional.of(centerZone));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.DELIVERY)
            .deliveryZoneId(1L)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(2).modifierIds(List.of(50L)).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // 234.08 + 5.00 = 239.08
        assertThat(response.getDeliveryFee()).isEqualByComparingTo(new BigDecimal("5.00"));
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("239.08"));
    }

    @Test
    @DisplayName("C09: C08 but PICKUP -> deliveryFee 0.00")
    void testC09_PickupDeliveryFeeZero()
    {
        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(productModifierRepository.findByProductId(10L)).thenReturn(List.of(extraCompote));
        when(productModifierRepository.findAllById(any())).thenReturn(List.of(extraCompote));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of(discount5, discount10));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(2).modifierIds(List.of(50L)).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        assertThat(response.getDeliveryFee()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("234.08"));
    }

    @Test
    @DisplayName("C10: UZ, 33.33 x 3 -> subtotal 99.99, vat 12.00, total 111.99")
    void testC10_RoundingHalfUp()
    {
        Product p = Product.builder().id(30L).name("Cupcake").available(true).build();
        ProductPrice price = ProductPrice.builder().id(130L).product(p).region(uzbekistan).price(new BigDecimal("33.33")).available(true).build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(30L)).thenReturn(Optional.of(p));
        when(productPriceRepository.findByProductIdAndRegionId(30L, 1L)).thenReturn(Optional.of(price));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of());

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(30L).quantity(3).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // subtotal = 99.99
        // vat = 99.99 * 0.12 = 11.9988 -> 12.00
        // total = 111.99
        assertThat(response.getSubtotal()).isEqualByComparingTo(new BigDecimal("99.99"));
        assertThat(response.getVatAmount()).isEqualByComparingTo(new BigDecimal("12.00"));
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("111.99"));
    }

    @Test
    @DisplayName("C11: UZ, 0.01 x 1 -> vat 0.00, total 0.01")
    void testC11_MinimumAmount()
    {
        Product p = Product.builder().id(30L).name("Candy").available(true).build();
        ProductPrice price = ProductPrice.builder().id(130L).product(p).region(uzbekistan).price(new BigDecimal("0.01")).available(true).build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(30L)).thenReturn(Optional.of(p));
        when(productPriceRepository.findByProductIdAndRegionId(30L, 1L)).thenReturn(Optional.of(price));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of());

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(30L).quantity(1).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // 0.01 * 0.12 = 0.0012 -> 0.00
        assertThat(response.getSubtotal()).isEqualByComparingTo(new BigDecimal("0.01"));
        assertThat(response.getVatAmount()).isEqualByComparingTo(new BigDecimal("0.00"));
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("0.01"));
    }

    @Test
    @DisplayName("C16: Product unavailable in region -> ProductUnavailableException")
    void testC16_ProductUnavailable()
    {
        ProductPrice unavailPrice = ProductPrice.builder().id(100L).product(cake).region(uzbekistan).price(new BigDecimal("100.00")).available(false).build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(unavailPrice));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(1).build()))
            .build();

        assertThatThrownBy(() -> priceCalculatorService.calculateCart(request))
            .isInstanceOf(ProductUnavailableException.class);
    }

    @Test
    @DisplayName("C17: Required modifier group missing -> BadRequestException")
    void testC17_RequiredModifierMissing()
    {
        ProductModifier reqMod = ProductModifier.builder()
            .id(55L)
            .product(cake)
            .name("Base Size")
            .priceDelta(BigDecimal.ZERO)
            .groupName("Size")
            .groupType("SINGLE")
            .required(true)
            .build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(productModifierRepository.findByProductId(10L)).thenReturn(List.of(reqMod));

        // modifierIds is empty
        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(1).modifierIds(List.of()).build()))
            .build();

        assertThatThrownBy(() -> priceCalculatorService.calculateCart(request))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Size");
    }

    @Test
    @DisplayName("C18: SINGLE group with two modifierIds -> BadRequestException")
    void testC18_SingleGroupMultipleSelection()
    {
        ProductModifier mod1 = ProductModifier.builder()
            .id(61L).product(cake).name("Small").priceDelta(BigDecimal.ZERO)
            .groupName("Size").groupType("SINGLE").build();
        ProductModifier mod2 = ProductModifier.builder()
            .id(62L).product(cake).name("Large").priceDelta(new BigDecimal("10.00"))
            .groupName("Size").groupType("SINGLE").build();

        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(productModifierRepository.findByProductId(10L)).thenReturn(List.of(mod1, mod2));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(1).modifierIds(List.of(61L, 62L)).build()))
            .build();

        assertThatThrownBy(() -> priceCalculatorService.calculateCart(request))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Single-choice");
    }

    @Test
    @DisplayName("C19: Promo code PROMO10 (10%) at incl 112.00 -> discount 11.20, total 100.80")
    void testC19_PromoCodeApplication()
    {
        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of());
        when(discountRepository.findByCodeIgnoreCaseAndActiveTrue("PROMO10")).thenReturn(Optional.of(promo10));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .promoCode("PROMO10")
            .items(List.of(CartItemDto.builder().productId(10L).quantity(1).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // incl = 112.00 -> 10% = 11.20 -> total = 100.80
        assertThat(response.getDiscountRate()).isEqualByComparingTo(new BigDecimal("0.10"));
        assertThat(response.getDiscountAmount()).isEqualByComparingTo(new BigDecimal("11.20"));
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("100.80"));
    }

    @Test
    @DisplayName("C20: Expired promo code -> PromoCodeInvalidException")
    void testC20_ExpiredPromoCode()
    {
        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(discountRepository.findByCodeIgnoreCaseAndActiveTrue("EXPIRED")).thenReturn(Optional.of(expiredPromo));

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .promoCode("EXPIRED")
            .items(List.of(CartItemDto.builder().productId(10L).quantity(1).build()))
            .build();

        assertThatThrownBy(() -> priceCalculatorService.calculateCart(request))
            .isInstanceOf(PromoCodeInvalidException.class);
    }

    @Test
    @DisplayName("C21: Promo code 10% + threshold 5% -> Max rule picks 10%")
    void testC21_MaxDiscountRule()
    {
        when(regionRepository.findByCodeIgnoreCase("UZ")).thenReturn(Optional.of(uzbekistan));
        when(productRepository.findById(10L)).thenReturn(Optional.of(cake));
        when(productPriceRepository.findByProductIdAndRegionId(10L, 1L)).thenReturn(Optional.of(uzbCakePrice));
        when(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD)).thenReturn(List.of(discount5));
        when(discountRepository.findByCodeIgnoreCaseAndActiveTrue("PROMO10")).thenReturn(Optional.of(promo10));

        // quantity 2 -> incl = 224.00 >= 200.00 (threshold gives 5%)
        // promo gives 10% -> max = 10%
        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZ")
            .orderType(OrderType.PICKUP)
            .promoCode("PROMO10")
            .items(List.of(CartItemDto.builder().productId(10L).quantity(2).build()))
            .build();

        CartCalculateResponse response = priceCalculatorService.calculateCart(request);

        // 224.00 * 0.10 = 22.40 (not 15% / 33.60)
        assertThat(response.getDiscountRate()).isEqualByComparingTo(new BigDecimal("0.10"));
        assertThat(response.getDiscountAmount()).isEqualByComparingTo(new BigDecimal("22.40"));
        assertThat(response.getTotal()).isEqualByComparingTo(new BigDecimal("201.60"));
    }

    @Test
    @DisplayName("C22: Missing or invalid region -> ResourceNotFoundException")
    void testC22_MissingRegion()
    {
        when(regionRepository.findByCodeIgnoreCase("XX")).thenReturn(Optional.empty());

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("XX")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder().productId(10L).quantity(1).build()))
            .build();

        assertThatThrownBy(() -> priceCalculatorService.calculateCart(request))
            .isInstanceOf(ResourceNotFoundException.class);
    }
}
