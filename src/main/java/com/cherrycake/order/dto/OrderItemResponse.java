package com.cherrycake.order.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse
{
    private Long id;
    private Long productId;

    @JsonProperty("name")
    @JsonAlias({"productName", "name"})
    private String productName;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal modifiersCost;

    @JsonProperty("lineTotal")
    @JsonAlias({"totalPrice", "lineTotal"})
    private BigDecimal totalPrice;

    private String selectedModifiers;

    @JsonIgnore
    public String getName()
    {
        return productName;
    }

    public void setName(String n)
    {
        this.productName = n;
    }

    @JsonIgnore
    public BigDecimal getLineTotal()
    {
        return totalPrice;
    }

    public void setLineTotal(BigDecimal lt)
    {
        this.totalPrice = lt;
    }
}
