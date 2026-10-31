package uz.itpu.cherrycake.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uz.itpu.cherrycake.dto.response.SalesReportResponse;
import uz.itpu.cherrycake.service.ReportService;

import java.time.LocalDate;

@RestController
@RequestMapping
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('VIEWER', 'STAFF', 'ADMIN')")
@Tag(name = "Reports & Analytics", description = "Sales analytics, KPI metrics and financial export in CSV and PDF formats")
public class ReportController
{
    private final ReportService reportService;

    @GetMapping({"/api/reports/sales", "/api/v1/reports/sales"})
    @Operation(summary = "Generate sales report", description = "Returns sales metrics, KPIs, and breakdowns by region or month for confirmed and completed orders.")
    public ResponseEntity<SalesReportResponse> getSalesReport
    (
        @Parameter(description = "Start date (YYYY-MM-DD)")
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @Parameter(description = "End date (YYYY-MM-DD)")
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @Parameter(description = "Region code (e.g. UZ, KZ, RU or empty for all)")
        @RequestParam(required = false) String region,
        @Parameter(description = "Aggregation mode: REGION or MONTH")
        @RequestParam(required = false, defaultValue = "REGION") String groupBy
    )
    {
        return ResponseEntity.ok(reportService.generateSalesReport(from, to, region, groupBy));
    }

    @GetMapping({"/api/reports/export", "/api/v1/reports/export"})
    @Operation(summary = "Export sales report", description = "Downloads sales report in CSV or PDF format matching the official specification.")
    public ResponseEntity<byte[]> exportReport
    (
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(required = false) String region,
        @RequestParam(required = false, defaultValue = "REGION") String groupBy,
        @RequestParam(required = false, defaultValue = "CSV") String format
    )
    {
        String fromStr = from != null ? from.toString() : "all";
        String toStr = to != null ? to.toString() : "all";

        if ("PDF".equalsIgnoreCase(format))
        {
            byte[] pdfBytes = reportService.exportPdf(from, to, region, groupBy);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sales_" + fromStr + "_" + toStr + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
        }
        else
        {
            byte[] csvBytes = reportService.exportCsv(from, to, region, groupBy);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sales_" + fromStr + "_" + toStr + ".csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvBytes);
        }
    }

    @GetMapping({"/api/reports/sales/csv", "/api/v1/reports/sales/csv"})
    @Operation(summary = "Legacy CSV export endpoint")
    public ResponseEntity<byte[]> exportCsvLegacy
    (
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(required = false) String regionCode
    )
    {
        byte[] csvBytes = reportService.exportCsv(startDate, endDate, regionCode, "REGION");
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sales_report.csv")
            .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
            .body(csvBytes);
    }
}
