package com.cherrycake.pricing.controller;

import com.cherrycake.order.entity.OrderType;
import com.cherrycake.pricing.dto.CartCalculateRequest;
import com.cherrycake.pricing.dto.CartCalculateResponse;
import com.cherrycake.pricing.dto.CartItemDto;
import com.cherrycake.pricing.service.PriceCalculatorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CartControllerTest
{
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PriceCalculatorService priceCalculatorService;

    @Test
    @DisplayName("POST /api/v1/cart/calculate should return 200 OK and calculated total")
    void testCalculateCartEndpoint() throws Exception
    {
        CartCalculateResponse mockResponse = CartCalculateResponse.builder()
            .regionCode("UZB")
            .currency("UZS")
            .currencySymbol("soʻm")
            .subtotal(new BigDecimal("200000.00"))
            .vatRate(new BigDecimal("15.00"))
            .vatAmount(new BigDecimal("30000.00"))
            .amountInclVat(new BigDecimal("230000.00"))
            .discountAmount(BigDecimal.ZERO)
            .deliveryFee(BigDecimal.ZERO)
            .finalTotal(new BigDecimal("230000.00"))
            .build();

        when(priceCalculatorService.calculateCart(any(CartCalculateRequest.class))).thenReturn(mockResponse);

        CartCalculateRequest request = CartCalculateRequest.builder()
            .regionCode("UZB")
            .orderType(OrderType.PICKUP)
            .items(List.of(CartItemDto.builder()
                .productId(1L)
                .quantity(1)
                .build()))
            .build();

        mockMvc.perform(post("/api/v1/cart/calculate").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.regionCode").value("UZB"))
            .andExpect(jsonPath("$.total").value(230000.00));

        mockMvc.perform(post("/api/cart/calculate").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.regionCode").value("UZB"))
            .andExpect(jsonPath("$.total").value(230000.00));
    }

    @Test
    @DisplayName("POST /api/v1/cart/calculate should return 400 Bad Request if items empty")
    void testCalculateCartValidationFailure() throws Exception
    {
        CartCalculateRequest invalidRequest = CartCalculateRequest.builder()
            .regionCode("UZB")
            .items(List.of())
            .build();

        mockMvc.perform(post("/api/v1/cart/calculate").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.message").value("Validation failed"));
    }
}