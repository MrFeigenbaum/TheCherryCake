package com.cherrycake.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.ResourceNotFoundException;
import com.cherrycake.dto.response.CategoryDto;
import com.cherrycake.dto.response.OrderResponse;
import com.cherrycake.dto.response.ProductDto;
import com.cherrycake.dto.response.RegionDto;
import com.cherrycake.model.entity.Category;
import com.cherrycake.model.entity.Discount;
import com.cherrycake.model.entity.Product;
import com.cherrycake.model.entity.ProductPrice;
import com.cherrycake.model.entity.Region;
import com.cherrycake.model.enums.DiscountType;
import com.cherrycake.model.enums.OrderStatus;
import com.cherrycake.repository.CategoryRepository;
import com.cherrycake.repository.DiscountRepository;
import com.cherrycake.repository.ProductPriceRepository;
import com.cherrycake.repository.ProductRepository;
import com.cherrycake.repository.RegionRepository;
import com.cherrycake.service.OrderService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/admin", "/api/v1/admin"})
@RequiredArgsConstructor
@Tag(name = "Admin Operations", description = "Backoffice administration of catalog, regional prices, VAT, discounts, promo codes, and orders")
public class AdminController
{
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;
    private final RegionRepository regionRepository;
    private final DiscountRepository discountRepository;
    private final OrderService orderService;

    // ==================== 1. CATEGORIES CRUD ====================

    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: list categories")
    public ResponseEntity<List<CategoryDto>> getAdminCategories()
    {
        List<CategoryDto> list = categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
            .map(c -> CategoryDto.builder()
                .id(c.getId())
                .code(c.getCode())
                .name(c.getName())
                .description(c.getDescription())
                .displayOrder(c.getDisplayOrder())
                .sortOrder(c.getDisplayOrder())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: create category")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto dto)
    {
        if (dto.getName() == null || dto.getName().trim().isEmpty())
        {
            throw new BadRequestException("Category name is required");
        }
        String code = dto.getCode() != null ? dto.getCode().trim().toUpperCase() : dto.getName().trim().toUpperCase().replaceAll("\\s+", "_");

        Category category = Category.builder()
            .name(dto.getName())
            .code(code)
            .description(dto.getDescription())
            .displayOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
            .build();

        Category saved = categoryRepository.save(category);
        return new ResponseEntity<>(CategoryDto.builder()
            .id(saved.getId())
            .name(saved.getName())
            .code(saved.getCode())
            .description(saved.getDescription())
            .sortOrder(saved.getDisplayOrder())
            .displayOrder(saved.getDisplayOrder())
            .build(), HttpStatus.CREATED);
    }

    @PutMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: update category")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @RequestBody CategoryDto dto)
    {
        Category cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));

        if (dto.getName() != null) cat.setName(dto.getName());
        if (dto.getDescription() != null) cat.setDescription(dto.getDescription());
        if (dto.getSortOrder() != null) cat.setDisplayOrder(dto.getSortOrder());

        Category updated = categoryRepository.save(cat);
        return ResponseEntity.ok(CategoryDto.builder()
            .id(updated.getId())
            .code(updated.getCode())
            .name(updated.getName())
            .description(updated.getDescription())
            .sortOrder(updated.getDisplayOrder())
            .displayOrder(updated.getDisplayOrder())
            .build());
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: delete category")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id)
    {
        if (!categoryRepository.existsById(id))
        {
            throw new ResourceNotFoundException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== 2. PRODUCTS CRUD ====================

    @GetMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: list products")
    public ResponseEntity<List<ProductDto>> getAdminProducts()
    {
        List<Product> products = productRepository.findAll();
        List<ProductDto> dtos = products.stream().map(p -> ProductDto.builder()
            .id(p.getId())
            .code(p.getCode())
            .name(p.getName())
            .description(p.getDescription())
            .imageUrl(p.getImageUrl())
            .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
            .categoryName(p.getCategory() != null ? p.getCategory().getName() : "")
            .isAvailable(p.isAvailable())
            .build()
        ).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: create product card")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto dto)
    {
        if (dto.getName() == null || dto.getName().trim().isEmpty())
        {
            throw new BadRequestException("Product name is required");
        }
        Category category = null;
        if (dto.getCategoryId() != null)
        {
            category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));
        }

        String code = dto.getCode() != null ? dto.getCode().trim().toUpperCase() : dto.getName().trim().toUpperCase().replaceAll("\\s+", "_");

        Product product = Product.builder()
            .name(dto.getName())
            .code(code)
            .description(dto.getDescription())
            .imageUrl(dto.getImageUrl())
            .category(category)
            .available(dto.isAvailable())
            .build();

        Product saved = productRepository.save(product);
        return new ResponseEntity<>(ProductDto.builder()
            .id(saved.getId())
            .code(saved.getCode())
            .name(saved.getName())
            .description(saved.getDescription())
            .imageUrl(saved.getImageUrl())
            .categoryId(saved.getCategory() != null ? saved.getCategory().getId() : null)
            .categoryName(saved.getCategory() != null ? saved.getCategory().getName() : "")
            .isAvailable(saved.isAvailable())
            .build(), HttpStatus.CREATED);
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: update product card")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto dto)
    {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        product.setAvailable(dto.isAvailable());

        if (dto.getCategoryId() != null)
        {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));
            product.setCategory(cat);
        }

        Product updated = productRepository.save(product);
        return ResponseEntity.ok(ProductDto.builder()
            .id(updated.getId())
            .code(updated.getCode())
            .name(updated.getName())
            .description(updated.getDescription())
            .imageUrl(updated.getImageUrl())
            .categoryId(updated.getCategory() != null ? updated.getCategory().getId() : null)
            .categoryName(updated.getCategory() != null ? updated.getCategory().getName() : "")
            .isAvailable(updated.isAvailable())
            .build());
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: delete product card")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id)
    {
        if (!productRepository.existsById(id))
        {
            throw new ResourceNotFoundException("Product not found: " + id);
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== 3. REGIONAL PRICES MATRIX ====================

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegionalPriceItem
    {
        private Long productId;
        private Long regionId;
        private String regionCode;
        private BigDecimal price;
        private boolean isAvailable;
    }

    @GetMapping("/prices")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: get regional prices matrix")
    public ResponseEntity<List<RegionalPriceItem>> getPrices(@RequestParam(required = false) Long productId)
    {
        List<ProductPrice> prices = (productId != null)
            ? productPriceRepository.findAll().stream().filter(p -> p.getProduct().getId().equals(productId)).collect(Collectors.toList())
            : productPriceRepository.findAll();

        List<RegionalPriceItem> list = prices.stream().map(p -> RegionalPriceItem.builder()
            .productId(p.getProduct().getId())
            .regionId(p.getRegion().getId())
            .regionCode(p.getRegion().getCode())
            .price(p.getPrice())
            .isAvailable(p.isAvailable())
            .build()
        ).collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @PutMapping("/prices")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: update regional price and availability")
    public ResponseEntity<List<RegionalPriceItem>> updatePrices(@RequestBody List<RegionalPriceItem> items, @RequestParam(required = false) Long productId)
    {
        List<RegionalPriceItem> savedItems = new ArrayList<>();
        for (RegionalPriceItem item : items)
        {
            Long pId = item.getProductId() != null ? item.getProductId() : productId;
            if (pId == null) throw new BadRequestException("productId is required");

            Product product = productRepository.findById(pId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + pId));

            Region region;
            if (item.getRegionId() != null)
            {
                region = regionRepository.findById(item.getRegionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + item.getRegionId()));
            }
            else if (item.getRegionCode() != null)
            {
                region = regionRepository.findByCodeIgnoreCase(item.getRegionCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + item.getRegionCode()));
            }
            else
            {
                throw new BadRequestException("regionId or regionCode is required");
            }

            ProductPrice pp = productPriceRepository.findByProductIdAndRegionId(product.getId(), region.getId())
                .orElse(ProductPrice.builder().product(product).region(region).price(BigDecimal.ZERO).build());

            if (item.getPrice() != null) pp.setPrice(item.getPrice());
            pp.setAvailable(item.isAvailable());

            ProductPrice saved = productPriceRepository.save(pp);
            savedItems.add(RegionalPriceItem.builder()
                .productId(saved.getProduct().getId())
                .regionId(saved.getRegion().getId())
                .regionCode(saved.getRegion().getCode())
                .price(saved.getPrice())
                .isAvailable(saved.isAvailable())
                .build());
        }
        return ResponseEntity.ok(savedItems);
    }

    // ==================== 4. REGIONS & VAT ====================

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionUpdateRequest
    {
        private BigDecimal vatRate;
        private Boolean isActive;
    }

    @GetMapping("/regions")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: list all regions")
    public ResponseEntity<List<RegionDto>> getAdminRegions()
    {
        List<RegionDto> list = regionRepository.findAll().stream().map(r -> RegionDto.builder()
            .id(r.getId())
            .code(r.getCode())
            .name(r.getName())
            .currencyCode(r.getCurrencyCode())
            .currencySymbol(r.getCurrencySymbol())
            .vatRate(r.getVatRateFraction())
            .active(r.isActive())
            .build()
        ).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/regions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: get region by ID")
    public ResponseEntity<RegionDto> getRegionById(@PathVariable Long id)
    {
        Region r = regionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + id));

        return ResponseEntity.ok(RegionDto.builder()
            .id(r.getId())
            .code(r.getCode())
            .name(r.getName())
            .currencyCode(r.getCurrencyCode())
            .currencySymbol(r.getCurrencySymbol())
            .vatRate(r.getVatRateFraction())
            .active(r.isActive())
            .build());
    }

    @PutMapping("/regions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: update region VAT rate or active status")
    public ResponseEntity<RegionDto> updateRegion(@PathVariable Long id, @RequestBody RegionUpdateRequest req)
    {
        Region r = regionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + id));

        if (req.getVatRate() != null)
        {
            // If passed as percentage e.g. 15 or 0.15, normalize
            BigDecimal rate = req.getVatRate();
            if (rate.compareTo(BigDecimal.ONE) > 0)
            {
                rate = rate.divide(new BigDecimal("100"), 4, java.math.RoundingMode.HALF_UP);
            }
            r.setVatRate(rate);
        }
        if (req.getIsActive() != null)
        {
            r.setActive(req.getIsActive());
        }

        Region saved = regionRepository.save(r);
        return ResponseEntity.ok(RegionDto.builder()
            .id(saved.getId())
            .code(saved.getCode())
            .name(saved.getName())
            .currencyCode(saved.getCurrencyCode())
            .currencySymbol(saved.getCurrencySymbol())
            .vatRate(saved.getVatRateFraction())
            .active(saved.isActive())
            .build());
    }

    // ==================== 5. DISCOUNTS & PROMO CODES ====================

    @GetMapping("/discounts")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: list threshold discounts")
    public ResponseEntity<List<Discount>> getDiscounts()
    {
        return ResponseEntity.ok(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.THRESHOLD));
    }

    @PostMapping("/discounts")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: create threshold discount")
    public ResponseEntity<Discount> createDiscount(@RequestBody Discount discount)
    {
        discount.setDiscountType(DiscountType.THRESHOLD);
        Discount saved = discountRepository.save(discount);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/discounts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: update threshold discount")
    public ResponseEntity<Discount> updateDiscount(@PathVariable Long id, @RequestBody Discount dto)
    {
        Discount d = discountRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Discount not found: " + id));

        if (dto.getName() != null) d.setName(dto.getName());
        if (dto.getMinSubtotal() != null) d.setMinSubtotal(dto.getMinSubtotal());
        if (dto.getPercentage() != null) d.setPercentage(dto.getPercentage());
        d.setActive(dto.isActive());

        return ResponseEntity.ok(discountRepository.save(d));
    }

    @DeleteMapping("/discounts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: delete discount")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id)
    {
        if (!discountRepository.existsById(id)) throw new ResourceNotFoundException("Discount not found: " + id);
        discountRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/promo-codes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: list promo codes")
    public ResponseEntity<List<Discount>> getPromoCodes()
    {
        return ResponseEntity.ok(discountRepository.findByDiscountTypeAndActiveTrue(DiscountType.PROMO_CODE));
    }

    @PostMapping("/promo-codes")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: create promo code")
    public ResponseEntity<Discount> createPromoCode(@RequestBody Discount promo)
    {
        if (promo.getCode() == null || promo.getCode().trim().isEmpty())
        {
            throw new BadRequestException("Promo code string is required");
        }
        promo.setCode(promo.getCode().trim().toUpperCase());
        promo.setDiscountType(DiscountType.PROMO_CODE);
        if (promo.getName() == null) promo.setName("Promo " + promo.getCode());
        Discount saved = discountRepository.save(promo);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/promo-codes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: update promo code")
    public ResponseEntity<Discount> updatePromoCode(@PathVariable Long id, @RequestBody Discount dto)
    {
        Discount p = discountRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Promo code not found: " + id));

        if (dto.getCode() != null) p.setCode(dto.getCode().trim().toUpperCase());
        if (dto.getName() != null) p.setName(dto.getName());
        if (dto.getPercentage() != null) p.setPercentage(dto.getPercentage());
        if (dto.getValidFrom() != null) p.setValidFrom(dto.getValidFrom());
        if (dto.getValidTo() != null) p.setValidTo(dto.getValidTo());
        p.setActive(dto.isActive());

        return ResponseEntity.ok(discountRepository.save(p));
    }

    @DeleteMapping("/promo-codes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Admin: delete promo code")
    public ResponseEntity<Void> deletePromoCode(@PathVariable Long id)
    {
        if (!discountRepository.existsById(id)) throw new ResourceNotFoundException("Promo code not found: " + id);
        discountRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== 6. ORDERS MANAGEMENT ====================

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdateRequest
    {
        private OrderStatus status;
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Operation(summary = "Admin/Staff: list orders with optional status filter")
    public ResponseEntity<List<OrderResponse>> getAdminOrders(@RequestParam(required = false) OrderStatus status)
    {
        return ResponseEntity.ok(orderService.getAllOrders(status));
    }

    @PatchMapping("/orders/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Operation(summary = "Admin/Staff: update order status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req)
    {
        if (req == null || req.getStatus() == null)
        {
            throw new BadRequestException("Status is required");
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, req.getStatus()));
    }
}
