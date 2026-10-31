package uz.itpu.cherrycake.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartCalculateResponse
{
    @JsonProperty("regionCode")
    @JsonAlias({"region", "regionCode"})
    private String regionCode;

    @JsonProperty("currencyCode")
    @JsonAlias({"currency", "currencyCode"})
    private String currencyCode;

    private String currency;

    @JsonProperty("currencySymbol")
    private String currencySymbol;

    @JsonProperty("subtotal")
    private BigDecimal subtotal;

    @JsonProperty("vatRate")
    private BigDecimal vatRate; // e.g. 0.12

    @JsonProperty("vatAmount")
    private BigDecimal vatAmount;

    @JsonProperty("amountInclVat")
    private BigDecimal amountInclVat;

    @JsonProperty("discountRate")
    private BigDecimal discountRate; // e.g. 0.05

    @JsonProperty("discountAmount")
    private BigDecimal discountAmount;

    @JsonProperty("discountDescription")
    private String discountDescription;

    @JsonProperty("deliveryFee")
    private BigDecimal deliveryFee;

    @JsonProperty("total")
    @JsonAlias({"finalTotal", "total"})
    private BigDecimal total;

    private BigDecimal finalTotal;

    @JsonProperty("items")
    @Builder.Default
    private List<CalculatedItemDto> items = new ArrayList<>();

    public String getCurrencyCode()
    {
        return currencyCode != null ? currencyCode : currency;
    }

    public String getCurrency()
    {
        return currency != null ? currency : currencyCode;
    }

    public BigDecimal getTotal()
    {
        return total != null ? total : finalTotal;
    }

    public BigDecimal getFinalTotal()
    {
        return finalTotal != null ? finalTotal : total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CalculatedItemDto
    {
        @JsonProperty("productId")
        private Long productId;

        @JsonProperty("name")
        @JsonAlias({"productName", "name"})
        private String name;

        private String productName;

        @JsonProperty("quantity")
        private Integer quantity;

        @JsonProperty("unitPrice")
        private BigDecimal unitPrice;

        @JsonProperty("modifiersPrice")
        private BigDecimal modifiersPrice;

        @JsonProperty("lineTotal")
        private BigDecimal lineTotal;

        @JsonProperty("modifiers")
        @JsonAlias({"modifierNames", "modifiers"})
        @Builder.Default
        private List<String> modifiers = new ArrayList<>();

        private List<String> modifierNames;

        public String getName() { return name != null ? name : productName; }
        @com.fasterxml.jackson.annotation.JsonIgnore
        public String getProductName() { return productName != null ? productName : name; }
        public List<String> getModifiers() { return modifiers != null ? modifiers : modifierNames; }
        @com.fasterxml.jackson.annotation.JsonIgnore
        public List<String> getModifierNames() { return modifierNames != null ? modifierNames : modifiers; }
    }
}
