package com.cherrycake;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SeedDataTests {

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void seedsRegionsWithVatAndExchangeRate() {
        List<Map<String, Object>> regions = jdbc.queryForList(
                "SELECT code, currency_code, vat_rate, exchange_rate FROM regions ORDER BY code");

        assertThat(regions).extracting(r -> (String) r.get("code"))
                .contains("CHN", "GEO", "KAZ", "UKR", "UZB", "ARM", "AZE", "TUR", "MDA", "ROU", "EST", "LVA", "LTU", "FIN", "SWE", "BLR", "RUS");
        assertThat(regions).hasSize(17);
        assertThat(regions).extracting(r -> (BigDecimal) r.get("exchange_rate"))
                .allMatch(rate -> rate.signum() > 0);
        assertThat(regions).extracting(r -> (BigDecimal) r.get("vat_rate"))
                .allMatch(rate -> rate.signum() > 0);
    }

    @Test
    void newlyAddedRegionsHaveConfiguredCurrencySymbolAndVat() {
        Map<String, Object> turkey = jdbc.queryForMap(
                "SELECT currency_code, currency_symbol, vat_rate, exchange_rate FROM regions WHERE code = 'TUR'");
        assertThat(turkey.get("currency_code")).isEqualTo("TRY");
        assertThat(turkey.get("currency_symbol")).isEqualTo("₺");
        assertThat((BigDecimal) turkey.get("vat_rate")).isEqualByComparingTo("0.18");
        assertThat((BigDecimal) turkey.get("exchange_rate")).isEqualByComparingTo("8.5");

        Map<String, Object> armenia = jdbc.queryForMap(
                "SELECT currency_code, currency_symbol, vat_rate, exchange_rate FROM regions WHERE code = 'ARM'");
        assertThat(armenia.get("currency_code")).isEqualTo("AMD");
        assertThat(armenia.get("currency_symbol")).isEqualTo("֏");
        assertThat((BigDecimal) armenia.get("vat_rate")).isEqualByComparingTo("0.20");
        assertThat((BigDecimal) armenia.get("exchange_rate")).isEqualByComparingTo("100");

        Map<String, Object> estonia = jdbc.queryForMap(
                "SELECT currency_code, currency_symbol, vat_rate, exchange_rate FROM regions WHERE code = 'EST'");
        assertThat(estonia.get("currency_code")).isEqualTo("EUR");
        assertThat(estonia.get("currency_symbol")).isEqualTo("€");
        assertThat((BigDecimal) estonia.get("vat_rate")).isEqualByComparingTo("0.22");
        assertThat((BigDecimal) estonia.get("exchange_rate")).isEqualByComparingTo("0.23");

        Map<String, Object> sweden = jdbc.queryForMap(
                "SELECT currency_code, currency_symbol, vat_rate, exchange_rate FROM regions WHERE code = 'SWE'");
        assertThat(sweden.get("currency_code")).isEqualTo("SEK");
        assertThat(sweden.get("currency_symbol")).isEqualTo("kr");
        assertThat((BigDecimal) sweden.get("vat_rate")).isEqualByComparingTo("0.25");
        assertThat((BigDecimal) sweden.get("exchange_rate")).isEqualByComparingTo("2.6");
    }

    @Test
    void seedsThreeCategoriesAndTwelveProducts() {
        assertThat(count("SELECT COUNT(*) FROM categories")).isEqualTo(3);
        assertThat(count("SELECT COUNT(*) FROM products")).isEqualTo(12);
    }

    @Test
    void everyProductHasPriceInEveryRegion() {
        int regionCount = count("SELECT COUNT(*) FROM regions");
        assertThat(count("SELECT COUNT(*) FROM regional_prices")).isEqualTo(12 * regionCount);
    }

    @Test
    void someProductsAreSoldOutInOneRegion() {
        List<String> soldOut = jdbc.queryForList(
                "SELECT p.name || ' ' || r.code FROM regional_prices rp "
                        + "JOIN products p ON p.id = rp.product_id JOIN regions r ON r.id = rp.region_id "
                        + "WHERE rp.in_stock = FALSE ORDER BY 1",
                String.class);

        assertThat(soldOut).containsExactly("Macarons Box CHN", "Napoleon Cake GEO");
    }

    @Test
    void everyModifierGroupHasModifiersAndEveryModifierHasPriceInEveryRegion() {
        assertThat(count("SELECT COUNT(*) FROM modifier_groups g "
                + "WHERE NOT EXISTS (SELECT 1 FROM modifiers m WHERE m.group_id = g.id)")).isZero();
        assertThat(count("SELECT COUNT(*) FROM modifiers")).isPositive();
        int regionCount = count("SELECT COUNT(*) FROM regions");
        assertThat(count("SELECT COUNT(*) FROM modifier_regional_prices"))
                .isEqualTo(count("SELECT COUNT(*) FROM modifiers") * regionCount);
    }

    @Test
    void seedsBothModifierGroupTypes() {
        assertThat(jdbc.queryForList("SELECT DISTINCT type FROM modifier_groups ORDER BY type", String.class))
                .containsExactly("MULTI", "SINGLE");
    }

    @Test
    void seedsDiscountTableFromSpec() {
        List<Map<String, Object>> rules = jdbc.queryForList(
                "SELECT threshold, rate FROM discount_rules ORDER BY threshold");

        assertThat(rules).extracting(r -> ((BigDecimal) r.get("threshold")).intValue())
                .containsExactly(100, 500, 700, 1000, 5000);
        assertThat(rules).extracting(r -> ((BigDecimal) r.get("rate")).stripTrailingZeros())
                .containsExactly(new BigDecimal("0.03"), new BigDecimal("0.05"), new BigDecimal("0.07"),
                        new BigDecimal("0.1"), new BigDecimal("0.15"));
    }

    @Test
    void leavesNoTemporaryTablesBehind() {
        assertThat(count("SELECT COUNT(*) FROM information_schema.tables "
                + "WHERE LOWER(table_name) IN ('seed_modifiers', 'seed_product_kinds')")).isZero();
    }

    private int count(String sql) {
        return jdbc.queryForObject(sql, Integer.class);
    }
}
