package com.cherrycake.order.dto;

import java.math.BigDecimal;

public record DeliveryZoneResponse(Long id, String name, BigDecimal deliveryFee) {
}

