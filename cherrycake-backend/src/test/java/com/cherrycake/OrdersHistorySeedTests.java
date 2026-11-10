package com.cherrycake;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class OrdersHistorySeedTests {

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void seedsOrdersAcrossAllFiveCountries() {
        List<String> regions = jdbc.queryForList(
                "SELECT DISTINCT r.code FROM orders o JOIN regions r ON r.id = o.region_id ORDER BY r.code",
                String.class);

        assertThat(regions).containsExactly("CHN", "GEO", "KAZ", "UKR", "UZB");
        Integer totalOrders = jdbc.queryForObject("SELECT COUNT(*) FROM orders", Integer.class);
        assertThat(totalOrders).isGreaterThanOrEqualTo(30);
    }

    @Test
    void seedsOrdersSpanningSixMonths() {
        Integer distinctMonths = jdbc.queryForObject(
                "SELECT COUNT(DISTINCT FORMATDATETIME(order_date, 'yyyy-MM')) FROM orders",
                Integer.class);
        assertThat(distinctMonths).isGreaterThanOrEqualTo(5);
    }

    @Test
    void everySeededOrderHasItemsAndValidTotals() {
        Integer missingItems = jdbc.queryForObject(
                "SELECT COUNT(*) FROM orders o WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id)",
                Integer.class);
        assertThat(missingItems).isZero();

        Integer invalidMath = jdbc.queryForObject(
                "SELECT COUNT(*) FROM orders WHERE ABS((subtotal + vat_amount - discount_amount + delivery_fee) - total) > 0.01",
                Integer.class);
        assertThat(invalidMath).isZero();
    }
}

