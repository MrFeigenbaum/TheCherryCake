package uz.itpu.cherrycake.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportResponse
{
    private String groupBy;

    @Builder.Default
    private Map<String, Object> filters = new HashMap<>();

    @Builder.Default
    private String generatedAt = Instant.now().toString();

    private KpiBlock kpi;

    @Builder.Default
    private List<ReportRow> rows = new ArrayList<>();

    // Backward compatibility fields
    private String period;
    private String regionFilter;
    private BigDecimal totalSubtotal;
    private BigDecimal totalVat;
    private BigDecimal totalDiscount;
    private BigDecimal totalRevenue;
    private BigDecimal averageCheck;
    private Long totalOrdersCount;

    @Builder.Default
    private List<RegionSalesItem> salesByRegion = new ArrayList<>();

    @Builder.Default
    private List<MonthlySalesItem> salesByMonth = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KpiBlock
    {
        private BigDecimal subtotal;
        private BigDecimal vatAmount;
        private BigDecimal discountAmount;
        private BigDecimal total;
        private BigDecimal averageCheck;
        private Long ordersCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReportRow
    {
        private String label;
        private Long ordersCount;
        private BigDecimal subtotal;
        private BigDecimal vatAmount;
        private BigDecimal discountAmount;
        private BigDecimal deliveryFee;
        private BigDecimal total;
        private String currencyCode;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionSalesItem
    {
        private String regionCode;
        private String regionName;
        private Long orderCount;
        private BigDecimal totalSales;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlySalesItem
    {
        private String month;
        private Long orderCount;
        private BigDecimal totalSales;
    }
}
