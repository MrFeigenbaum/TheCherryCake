package com.cherrycake.catalog.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModifierGroupDto
{
    private Long id;
    private String name;
    private String type; // SINGLE or MULTI
    private boolean isRequired;
    
    @Builder.Default
    private List<ModifierItemDto> modifiers = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModifierItemDto
    {
        private Long id;
        private String name;
        private BigDecimal priceDelta;
    }
}