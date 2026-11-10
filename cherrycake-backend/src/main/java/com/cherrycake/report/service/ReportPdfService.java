package com.cherrycake.report.service;

import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.report.dto.SalesReportResponse;
import com.cherrycake.report.dto.SalesReportResponse.Kpi;
import com.cherrycake.report.dto.SalesReportResponse.Row;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.stereotype.Service;

/**
 * Renders the sales report as a PDF with KPI summary, JFreeChart bar chart and detail table (CC-51).
 */
@Service
public class ReportPdfService {

    private static final Color BURGUNDY = new Color(123, 30, 60);
    private static final Color CREAM = new Color(245, 230, 211);

    private final ReportService reportService;

    public ReportPdfService(ReportService reportService) {
        this.reportService = reportService;
    }

    public byte[] exportSalesPdf(LocalDate from, LocalDate to, String region, String groupBy, String format) {
        if (format != null && !format.isBlank() && !"PDF".equalsIgnoreCase(format.trim())) {
            throw new BadRequestException("Unsupported export format: " + format + ". Only PDF is supported.");
        }

        SalesReportResponse report = reportService.getSalesReport(from, to, region, groupBy);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            addHeader(document, report);
            addKpiTable(document, report.kpi());
            addChart(document, report);
            addRowsTable(document, report);

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException ex) {
            throw new IllegalStateException("Failed to generate sales report PDF", ex);
        }
    }

    private void addHeader(Document document, SalesReportResponse report) throws DocumentException {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BURGUNDY);
        Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);

        Paragraph title = new Paragraph("Cherry Cake - Sales Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(6);
        document.add(title);

        String meta = String.format("Period: %s to %s | Region: %s | Group By: %s",
                report.from(), report.to(), report.region(), report.groupBy());
        Paragraph subtitle = new Paragraph(meta, metaFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(16);
        document.add(subtitle);
    }

    private void addKpiTable(Document document, Kpi kpi) throws DocumentException {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
        Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingAfter(16);

        String[] headers = {"Orders", "Subtotal", "VAT", "Discount", "Total"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(CREAM);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(6);
            table.addCell(cell);
        }

        addCenteredCell(table, String.valueOf(kpi.ordersCount()), valueFont);
        addCenteredCell(table, kpi.subtotalSum().toPlainString(), valueFont);
        addCenteredCell(table, kpi.vatSum().toPlainString(), valueFont);
        addCenteredCell(table, kpi.discountSum().toPlainString(), valueFont);
        addCenteredCell(table, kpi.totalSum().toPlainString(), valueFont);

        document.add(table);
    }

    private void addChart(Document document, SalesReportResponse report) throws DocumentException, IOException {
        if (report.rows().isEmpty()) {
            return;
        }
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (Row row : report.rows()) {
            dataset.addValue(row.total(), "Revenue", row.label());
        }

        String chartTitle = "Revenue by " + ("MONTH".equals(report.groupBy()) ? "Month" : "Region");
        String xAxis = "MONTH".equals(report.groupBy()) ? "Month" : "Region";
        JFreeChart chart = ChartFactory.createBarChart(
                chartTitle, xAxis, "Total", dataset, PlotOrientation.VERTICAL, false, false, false);
        chart.setBackgroundPaint(Color.WHITE);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(Color.WHITE);
        plot.setRangeGridlinePaint(new Color(220, 220, 220));
        if (plot.getRenderer() instanceof BarRenderer renderer) {
            renderer.setSeriesPaint(0, BURGUNDY);
        }

        BufferedImage image = chart.createBufferedImage(500, 230);
        Image pdfImage = Image.getInstance(image, null);
        pdfImage.setAlignment(Element.ALIGN_CENTER);
        pdfImage.setSpacingAfter(16);
        document.add(pdfImage);
    }

    private void addRowsTable(Document document, SalesReportResponse report) throws DocumentException {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);

        String[] headers = {"Label", "Orders Count", "Total"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(CREAM);
            cell.setPadding(6);
            table.addCell(cell);
        }

        for (Row row : report.rows()) {
            PdfPCell labelCell = new PdfPCell(new Phrase(row.label(), cellFont));
            labelCell.setPadding(5);
            table.addCell(labelCell);

            PdfPCell countCell = new PdfPCell(new Phrase(String.valueOf(row.ordersCount()), cellFont));
            countCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            countCell.setPadding(5);
            table.addCell(countCell);

            PdfPCell totalCell = new PdfPCell(new Phrase(row.total().toPlainString(), cellFont));
            totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalCell.setPadding(5);
            table.addCell(totalCell);
        }

        document.add(table);
    }

    private static void addCenteredCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(6);
        table.addCell(cell);
    }
}

