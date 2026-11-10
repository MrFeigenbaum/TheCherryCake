package com.cherrycake.report.controller;

import com.cherrycake.common.dto.ErrorResponse;
import com.cherrycake.report.dto.SalesReportResponse;
import com.cherrycake.report.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Open sales analytics and report endpoints")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/sales")
    @Operation(summary = "Aggregated sales KPI and chart rows by region or month")
    @ApiResponse(responseCode = "200", description = "Aggregated sales report")
    @ApiResponse(responseCode = "400", description = "Invalid filter or groupBy parameter",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Unknown region filter",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public SalesReportResponse getSalesReport(
            @Parameter(description = "Start date (YYYY-MM-DD)", example = "2026-05-01")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @Parameter(description = "End date (YYYY-MM-DD)", example = "2026-12-31")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @Parameter(description = "Optional 3-letter country code (UZB, KAZ, GEO, UKR, CHN)", example = "UZB")
            @RequestParam(required = false) String region,
            @Parameter(description = "Grouping mode: REGION or MONTH", example = "REGION")
            @RequestParam(required = false, defaultValue = "REGION") String groupBy) {
        return reportService.getSalesReport(from, to, region, groupBy);
    }
}

