package com.cherrycake.catalog.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionDto
{
    private Long id;
    private String code;
    private String name;
    private String currencyCode;
    private String currencySymbol;
    private BigDecimal vatRate;
    private boolean active;
}