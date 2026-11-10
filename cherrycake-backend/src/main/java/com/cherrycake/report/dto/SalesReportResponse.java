package com.cherrycake.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Sales report response matching the platform API v1 contract (CC-10 / CC-50).
 */
public record SalesReportResponse(
        LocalDate from,
        LocalDate to,
        String region,
        String groupBy,
        Kpi kpi,
        List<Row> rows) {

    public record Kpi(
            long ordersCount,
            BigDecimal subtotalSum,
            BigDecimal vatSum,
            BigDecimal discountSum,
            BigDecimal totalSum) {
    }

    public record Row(
            String label,
            long ordersCount,
            BigDecimal total) {
    }
}

