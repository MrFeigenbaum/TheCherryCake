package com.cherrycake.catalog.controller;

import com.cherrycake.catalog.dto.CategoryDto;
import com.cherrycake.catalog.dto.ProductDto;
import com.cherrycake.catalog.dto.RegionDto;
import com.cherrycake.catalog.service.CatalogService;
import com.cherrycake.order.dto.DeliveryZoneDto;
import com.cherrycake.order.dto.PickupPointDto;
import com.cherrycake.order.dto.TimeSlotResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Catalog & Logistics", description = "Public catalog, active regions, multi-currency prices, and delivery endpoints")
public class CatalogController
{
    private final CatalogService catalogService;

    @GetMapping({"/api/regions", "/api/v1/catalog/regions"})
    @Operation(summary = "Get active regions", description = "Returns active operating regions with currency, symbol, and VAT rates.")
    public ResponseEntity<List<RegionDto>> getRegions() { return ResponseEntity.ok(catalogService.getAllActiveRegions()); }

    @GetMapping({"/api/categories", "/api/v1/catalog/categories"})
    @Operation(summary = "Get menu categories", description = "Returns menu categories ordered by display order.")
    public ResponseEntity<List<CategoryDto>> getCategories() { return ResponseEntity.ok(catalogService.getAllCategories()); }

    @GetMapping({"/api/products", "/api/v1/catalog/products"})
    @Operation(summary = "Get catalog products", description = "Returns products with regional pricing and availability.")
    public ResponseEntity<List<ProductDto>> getProducts
    (
        @Parameter(description = "Country / Region code (e.g. UZ, KZ, RU)", required = true)
        @RequestParam(required = false) String region,
        @Parameter(description = "Optional Category ID filter")
        @RequestParam(required = false) Long categoryId
    ) { return ResponseEntity.ok(catalogService.getProducts(region, categoryId)); }

    @GetMapping({"/api/products/{id}", "/api/v1/catalog/products/{id}"})
    @Operation(summary = "Get product by ID", description = "Returns detailed product card with regional pricing and modifier groups.")
    public ResponseEntity<ProductDto> getProductById
    (
        @PathVariable Long id,
        @Parameter(description = "Country / Region code (e.g. UZ, KZ, RU)", required = true)
        @RequestParam(required = false) String region
    ) { return ResponseEntity.ok(catalogService.getProductById(id, region)); }

    @GetMapping({"/api/pickup-points", "/api/v1/catalog/pickup-points"})
    @Operation(summary = "Get pickup locations", description = "Returns active café pickup points for a given region.")
    public ResponseEntity<List<PickupPointDto>> getPickupPoints(@RequestParam(required = false) String region)
    { return ResponseEntity.ok(catalogService.getPickupPoints(region)); }

    @GetMapping({"/api/delivery-zones", "/api/v1/catalog/delivery-zones"})
    @Operation(summary = "Get delivery zones", description = "Returns delivery zones and calculated courier delivery fees.")
    public ResponseEntity<List<DeliveryZoneDto>> getDeliveryZones(@RequestParam(required = false) String region)
    { return ResponseEntity.ok(catalogService.getDeliveryZones(region)); }

    @GetMapping({"/api/time-slots", "/api/v1/time-slots"})
    @Operation(summary = "Get time slots", description = "Returns delivery / pickup time slots on a given date with capacity and availability flag.")
    public ResponseEntity<List<TimeSlotResponse>> getTimeSlots(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date)
    { return ResponseEntity.ok(catalogService.getTimeSlots(date)); }
}