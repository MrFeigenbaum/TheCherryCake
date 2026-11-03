package com.cherrycake.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.cherrycake.model.enums.OrderStatus;
import com.cherrycake.model.enums.OrderType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse
{
    private Long id;
    private String orderNumber;
    private OrderType orderType;
    private OrderStatus status;

    private String regionCode;

    @JsonProperty("currencyCode")
    @JsonAlias({"currency", "currencyCode"})
    private String currencyCode;

    private BigDecimal subtotal;
    private BigDecimal vatRate;
    private BigDecimal vatAmount;
    private BigDecimal amountInclVat;

    @Builder.Default
    private BigDecimal discountRate = BigDecimal.ZERO;

    private BigDecimal discountAmount;
    private BigDecimal deliveryFee;

    @JsonProperty("total")
    @JsonAlias({"totalAmount", "total"})
    private BigDecimal total;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String deliveryAddress;

    private String pickupPointName;
    private PickupPointDto pickupPoint;
    private DeliveryZoneDto deliveryZone;
    private LocalDateTime timeSlot;
    private LocalDateTime orderDate;
    private LocalDateTime createdAt;

    @Builder.Default
    private List<OrderItemResponse> items = new ArrayList<>();

    // Backward compatibility
    @com.fasterxml.jackson.annotation.JsonIgnore
    public String getCurrency() { return currencyCode; }
    public void setCurrency(String c) { this.currencyCode = c; }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public BigDecimal getTotalAmount() { return total; }
    public void setTotalAmount(BigDecimal t) { this.total = t; }
}
