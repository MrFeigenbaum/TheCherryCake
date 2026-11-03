package com.cherrycake.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cherrycake.dto.request.CartCalculateRequest;
import com.cherrycake.dto.response.CartCalculateResponse;
import com.cherrycake.service.PriceCalculatorService;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Cart & Pricing", description = "Dynamic cart recalculation and multi-region pricing engine")
public class CartController
{
    private final PriceCalculatorService priceCalculatorService;

    @PostMapping({"/api/cart/calculate", "/api/v1/cart/calculate"})
    @Operation(summary = "Calculate cart totals", description = "Recalculates cart items, regional unit prices, VAT, discounts, and delivery fee.")
    public ResponseEntity<CartCalculateResponse> calculateCart(@Valid @RequestBody CartCalculateRequest request)
    {
        CartCalculateResponse response = priceCalculatorService.calculateCart(request);
        return ResponseEntity.ok(response);
    }
}
