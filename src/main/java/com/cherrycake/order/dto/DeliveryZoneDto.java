package com.cherrycake.order.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryZoneDto
{
    private Long id;
    private Long regionId;
    private String name;
    private BigDecimal deliveryFee;
    private Integer estimatedMinutes;
}