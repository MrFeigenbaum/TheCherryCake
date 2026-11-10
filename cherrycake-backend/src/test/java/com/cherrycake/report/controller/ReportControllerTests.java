package com.cherrycake.report.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lowagie.text.pdf.PdfReader;
import com.lowagie.text.pdf.parser.PdfTextExtractor;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ReportControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void returnsSalesReportGroupedByRegionMatchingSql() throws Exception {
        Long sqlCount = jdbc.queryForObject("SELECT COUNT(*) FROM orders", Long.class);
        BigDecimal sqlTotal = jdbc.queryForObject("SELECT SUM(total) FROM orders", BigDecimal.class);

        mockMvc.perform(get("/api/reports/sales").param("groupBy", "REGION"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.groupBy").value("REGION"))
                .andExpect(jsonPath("$.kpi.ordersCount").value(sqlCount.intValue()))
                .andExpect(jsonPath("$.kpi.totalSum").value(sqlTotal.doubleValue()))
                .andExpect(jsonPath("$.rows", hasSize(5)));
    }

    @Test
    void returnsSalesReportGroupedByMonthSpanningMultipleMonths() throws Exception {
        mockMvc.perform(get("/api/reports/sales").param("groupBy", "MONTH"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.groupBy").value("MONTH"))
                .andExpect(jsonPath("$.rows.length()", greaterThanOrEqualTo(5)));
    }

    @Test
    void filtersSalesReportByRegion() throws Exception {
        Long uzbCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM orders o JOIN regions r ON r.id = o.region_id WHERE r.code = 'UZB'",
                Long.class);

        mockMvc.perform(get("/api/reports/sales").param("region", "UZB"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.region").value("UZB"))
                .andExpect(jsonPath("$.kpi.ordersCount").value(uzbCount.intValue()))
                .andExpect(jsonPath("$.rows", hasSize(1)))
                .andExpect(jsonPath("$.rows[0].label").value("UZB"));
    }

    @Test
    void returns400OnInvalidGroupByOrDateRange() throws Exception {
        mockMvc.perform(get("/api/reports/sales").param("groupBy", "WEEK"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));

        mockMvc.perform(get("/api/reports/sales")
                        .param("from", "2026-12-01")
                        .param("to", "2026-01-01"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void returns404OnUnknownRegionFilter() throws Exception {
        mockMvc.perform(get("/api/reports/sales").param("region", "XYZ"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void exportsPdfMatchingSqlAndWebReport() throws Exception {
        Long sqlCount = jdbc.queryForObject("SELECT COUNT(*) FROM orders", Long.class);
        BigDecimal sqlTotal = jdbc.queryForObject("SELECT SUM(total) FROM orders", BigDecimal.class)
                .setScale(2, RoundingMode.HALF_UP);

        MvcResult result = mockMvc.perform(get("/api/reports/export")
                        .param("groupBy", "REGION")
                        .param("format", "PDF"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition", "attachment; filename=sales-report.pdf"))
                .andReturn();

        byte[] pdfBytes = result.getResponse().getContentAsByteArray();
        assertThat(pdfBytes.length).isGreaterThan(1000);
        assertThat(new String(pdfBytes, 0, 5)).isEqualTo("%PDF-");

        try (PdfReader reader = new PdfReader(pdfBytes)) {
            String text = new PdfTextExtractor(reader).getTextFromPage(1);
            assertThat(text).contains("Cherry Cake - Sales Report");
            assertThat(text).contains(String.valueOf(sqlCount));
            assertThat(text).contains(sqlTotal.toPlainString());
            assertThat(text).contains("UZB", "KAZ", "GEO", "UKR", "CHN");
        }
    }

    @Test
    void returns400OnUnsupportedExportFormat() throws Exception {
        mockMvc.perform(get("/api/reports/export").param("format", "XLSX"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}

