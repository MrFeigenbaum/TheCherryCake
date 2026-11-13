package com.cherrycake.catalog.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class ProductDto
{
    private Long id;
    private String code;
    private String name;
    private String description;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private BigDecimal price;

    @JsonProperty("currencyCode")
    @JsonAlias({"currency", "currencyCode"})
    private String currencyCode;

    private String currencySymbol;

    @JsonProperty("isAvailable")
    @JsonAlias({"available", "isAvailable"})
    private boolean isAvailable;

    @Builder.Default
    private List<ProductModifierDto> modifiers = new ArrayList<>();

    @Builder.Default
    private List<ModifierGroupDto> modifierGroups = new ArrayList<>();

    // Backward compatibility
    public String getCurrency() { return currencyCode; }
    public void setCurrency(String c) { this.currencyCode = c; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean a) { this.isAvailable = a; }
}