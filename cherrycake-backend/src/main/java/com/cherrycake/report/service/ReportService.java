package com.cherrycake.report.service;

import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.NotFoundException;
import com.cherrycake.report.dto.SalesReportResponse;
import com.cherrycake.report.dto.SalesReportResponse.Kpi;
import com.cherrycake.report.dto.SalesReportResponse.Row;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Aggregates sales metrics directly in SQL over the {@code orders} table (CC-50).
 */
@Service
@Transactional(readOnly = true)
public class ReportService {

    private static final BigDecimal ZERO_MONEY = new BigDecimal("0.00");

    private final JdbcTemplate jdbcTemplate;

    public ReportService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public SalesReportResponse getSalesReport(LocalDate from, LocalDate to, String region, String groupBy) {
        LocalDate fromDate = from != null ? from : LocalDate.now().minusMonths(6);
        LocalDate toDate = to != null ? to : LocalDate.now();
        if (fromDate.isAfter(toDate)) {
            throw new BadRequestException("from date must not be after to date");
        }

        String normalizedGroupBy = normalizeGroupBy(groupBy);
        String normalizedRegion = normalizeRegion(region);

        StringBuilder whereClause = new StringBuilder(" WHERE o.order_date BETWEEN ? AND ? ");
        List<Object> params = new ArrayList<>();
        params.add(fromDate);
        params.add(toDate);

        if (normalizedRegion != null) {
            whereClause.append(" AND r.code = ? ");
            params.add(normalizedRegion);
        }

        String kpiSql = """
                SELECT
                    COUNT(o.id)                         AS orders_count,
                    COALESCE(SUM(o.subtotal), 0)        AS subtotal_sum,
                    COALESCE(SUM(o.vat_amount), 0)      AS vat_sum,
                    COALESCE(SUM(o.discount_amount), 0) AS discount_sum,
                    COALESCE(SUM(o.total), 0)           AS total_sum
                FROM orders o
                JOIN regions r ON r.id = o.region_id
                """ + whereClause;

        Kpi kpi = jdbcTemplate.queryForObject(kpiSql, (rs, rowNum) -> new Kpi(
                rs.getLong("orders_count"),
                money(rs.getBigDecimal("subtotal_sum")),
                money(rs.getBigDecimal("vat_sum")),
                money(rs.getBigDecimal("discount_sum")),
                money(rs.getBigDecimal("total_sum"))
        ), params.toArray());

        String labelExpr = "MONTH".equals(normalizedGroupBy)
                ? "SUBSTRING(CAST(o.order_date AS VARCHAR), 1, 7)"
                : "r.code";
        String orderByExpr = "MONTH".equals(normalizedGroupBy) ? "label ASC" : "total DESC, label ASC";

        String rowsSql = String.format("""
                SELECT
                    %s                     AS label,
                    COUNT(o.id)            AS orders_count,
                    COALESCE(SUM(o.total), 0) AS total
                FROM orders o
                JOIN regions r ON r.id = o.region_id
                %s
                GROUP BY %s
                ORDER BY %s
                """, labelExpr, whereClause, labelExpr, orderByExpr);

        List<Row> rows = jdbcTemplate.query(rowsSql, (rs, rowNum) -> new Row(
                rs.getString("label"),
                rs.getLong("orders_count"),
                money(rs.getBigDecimal("total"))
        ), params.toArray());

        return new SalesReportResponse(
                fromDate,
                toDate,
                normalizedRegion != null ? normalizedRegion : "ALL",
                normalizedGroupBy,
                kpi,
                rows);
    }

    private String normalizeGroupBy(String groupBy) {
        if (groupBy == null || groupBy.isBlank()) {
            return "REGION";
        }
        String upper = groupBy.trim().toUpperCase();
        if (!"REGION".equals(upper) && !"MONTH".equals(upper)) {
            throw new BadRequestException("groupBy must be REGION or MONTH");
        }
        return upper;
    }

    private String normalizeRegion(String region) {
        if (region == null || region.isBlank() || "ALL".equalsIgnoreCase(region.trim())) {
            return null;
        }
        String code = region.trim().toUpperCase();
        Integer exists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM regions WHERE code = ?", Integer.class, code);
        if (exists == null || exists == 0) {
            throw new NotFoundException("Unknown region: " + code);
        }
        return code;
    }

    private static BigDecimal money(BigDecimal value) {
        return value == null ? ZERO_MONEY : value.setScale(2, RoundingMode.HALF_UP);
    }
}

