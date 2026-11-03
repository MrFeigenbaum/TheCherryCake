package com.cherrycake.pricing.dto;

import com.cherrycake.order.entity.OrderType;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class CartCalculateRequest
{
    @NotBlank(message = "Country/Region code is required")
    @JsonAlias({"region", "regionCode"})
    private String regionCode;

    @Valid
    @NotEmpty(message = "Cart cannot be empty")
    @Builder.Default
    private List<CartItemDto> items = new ArrayList<>();

    private String promoCode;

    @Builder.Default
    private OrderType orderType = OrderType.PICKUP;

    private Long deliveryZoneId;

    public String region() { return regionCode; }

    public List<CartItemDto> items() { return items; }

    public String promoCode() { return promoCode; }

    public OrderType orderType() { return orderType; }

    public Long deliveryZoneId() { return deliveryZoneId; }
}
