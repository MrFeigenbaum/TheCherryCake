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
public class ProductModifierDto
{
    private Long id;
    private String name;
    private BigDecimal priceDelta;
    private boolean isDefault;
}