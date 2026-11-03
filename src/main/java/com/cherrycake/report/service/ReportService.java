package com.cherrycake.report.service;

import com.cherrycake.order.entity.Order;
import com.cherrycake.order.entity.OrderStatus;
import com.cherrycake.order.repository.OrderRepository;
import com.cherrycake.report.dto.SalesReportResponse;
import com.cherrycake.report.dto.SalesReportResponse.KpiBlock;
import com.cherrycake.report.dto.SalesReportResponse.ReportRow;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService
{
    private final OrderRepository orderRepository;

    public SalesReportResponse generateSalesReport(LocalDate from, LocalDate to, String region, String groupBy)
    {
        LocalDate fromDate = from != null ? from : LocalDate.now().minusMonths(6);
        LocalDate toDate = to != null ? to : LocalDate.now();
        String groupMode = (groupBy != null && groupBy.equalsIgnoreCase("MONTH")) ? "MONTH" : "REGION";

        LocalDateTime startDateTime = fromDate.atStartOfDay();
        LocalDateTime endDateTime = toDate.atTime(23, 59, 59);

        // Fetch orders and filter strictly by status IN (CONFIRMED, DONE)
        List<Order> allOrders = orderRepository.findByCreatedAtBetween(startDateTime, endDateTime);
        List<Order> validOrders = allOrders.stream()
            .filter(o -> o.getStatus() == OrderStatus.CONFIRMED || o.getStatus() == OrderStatus.DONE)
            .filter(o -> region == null || region.trim().isEmpty() || region.equalsIgnoreCase("ALL") 
                         || (o.getRegion() != null && o.getRegion().getCode().equalsIgnoreCase(region.trim())))
            .collect(Collectors.toList());

        BigDecimal totalSubtotal = BigDecimal.ZERO;
        BigDecimal totalVat = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        BigDecimal totalDeliveryFee = BigDecimal.ZERO;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        Map<String, List<Order>> groupedMap = new LinkedHashMap<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Order o : validOrders)
        {
            totalSubtotal = totalSubtotal.add(o.getSubtotal());
            totalVat = totalVat.add(o.getVatAmount());
            totalDiscount = totalDiscount.add(o.getDiscountAmount());
            totalDeliveryFee = totalDeliveryFee.add(o.getDeliveryFee());
            totalRevenue = totalRevenue.add(o.getTotalAmount());

            String key;
            if ("MONTH".equals(groupMode))
            {
                key = o.getOrderDate() != null ? o.getOrderDate().format(monthFormatter) : o.getCreatedAt().format(monthFormatter);
            }
            else
            {
                key = o.getRegion() != null ? o.getRegion().getCode() : "DEFAULT";
            }
            groupedMap.computeIfAbsent(key, k -> new ArrayList<>()).add(o);
        }

        List<ReportRow> rows = new ArrayList<>();
        for (Map.Entry<String, List<Order>> entry : groupedMap.entrySet())
        {
            String label = entry.getKey();
            List<Order> groupOrders = entry.getValue();

            BigDecimal rSubtotal = BigDecimal.ZERO;
            BigDecimal rVat = BigDecimal.ZERO;
            BigDecimal rDiscount = BigDecimal.ZERO;
            BigDecimal rFee = BigDecimal.ZERO;
            BigDecimal rTotal = BigDecimal.ZERO;
            String curCode = groupOrders.isEmpty() ? "UZS" : groupOrders.get(0).getCurrency();

            for (Order o : groupOrders)
            {
                rSubtotal = rSubtotal.add(o.getSubtotal());
                rVat = rVat.add(o.getVatAmount());
                rDiscount = rDiscount.add(o.getDiscountAmount());
                rFee = rFee.add(o.getDeliveryFee());
                rTotal = rTotal.add(o.getTotalAmount());
            }

            rows.add(ReportRow.builder()
                .label(label)
                .ordersCount((long) groupOrders.size())
                .subtotal(rSubtotal.setScale(2, RoundingMode.HALF_UP))
                .vatAmount(rVat.setScale(2, RoundingMode.HALF_UP))
                .discountAmount(rDiscount.setScale(2, RoundingMode.HALF_UP))
                .deliveryFee(rFee.setScale(2, RoundingMode.HALF_UP))
                .total(rTotal.setScale(2, RoundingMode.HALF_UP))
                .currencyCode(curCode)
                .build());
        }

        long ordersCount = validOrders.size();
        BigDecimal avgCheck = ordersCount > 0
            ? totalRevenue.divide(BigDecimal.valueOf(ordersCount), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        KpiBlock kpi = KpiBlock.builder()
            .subtotal(totalSubtotal.setScale(2, RoundingMode.HALF_UP))
            .vatAmount(totalVat.setScale(2, RoundingMode.HALF_UP))
            .discountAmount(totalDiscount.setScale(2, RoundingMode.HALF_UP))
            .total(totalRevenue.setScale(2, RoundingMode.HALF_UP))
            .averageCheck(avgCheck)
            .ordersCount(ordersCount)
            .build();

        Map<String, Object> filtersMap = new HashMap<>();
        filtersMap.put("from", fromDate.toString());
        filtersMap.put("to", toDate.toString());
        filtersMap.put("region", region != null ? region : "ALL");
        filtersMap.put("groupBy", groupMode);

        return SalesReportResponse.builder()
            .groupBy(groupMode)
            .filters(filtersMap)
            .generatedAt(Instant.now().toString())
            .kpi(kpi)
            .rows(rows)
            .period(fromDate + " to " + toDate)
            .regionFilter(region != null ? region : "ALL")
            .totalSubtotal(kpi.getSubtotal())
            .totalVat(kpi.getVatAmount())
            .totalDiscount(kpi.getDiscountAmount())
            .totalRevenue(kpi.getTotal())
            .averageCheck(kpi.getAverageCheck())
            .totalOrdersCount(kpi.getOrdersCount())
            .build();
    }

    public byte[] exportCsv(LocalDate from, LocalDate to, String region, String groupBy)
    {
        SalesReportResponse report = generateSalesReport(from, to, region, groupBy);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream())
        {
            // UTF-8 BOM
            baos.write(new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF });

            try (OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
                 CSVWriter writer = new CSVWriter(osw))
            {
                // Header strictly matching Glossary §9
                writer.writeNext(new String[] {
                    "label", "ordersCount", "subtotal", "vatAmount", "discountAmount", "deliveryFee", "total", "currencyCode"
                });

                for (ReportRow row : report.getRows())
                {
                    writer.writeNext(new String[] {
                        row.getLabel(),
                        String.valueOf(row.getOrdersCount()),
                        row.getSubtotal().toString(),
                        row.getVatAmount().toString(),
                        row.getDiscountAmount().toString(),
                        row.getDeliveryFee().toString(),
                        row.getTotal().toString(),
                        row.getCurrencyCode() != null ? row.getCurrencyCode() : "UZS"
                    });
                }

                writer.flush();
            }

            return baos.toByteArray();
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to generate CSV sales report", e);
        }
    }

    public byte[] exportPdf(LocalDate from, LocalDate to, String region, String groupBy)
    {
        SalesReportResponse report = generateSalesReport(from, to, region, groupBy);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream())
        {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(123, 30, 60));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);

            // Title
            Paragraph title = new Paragraph("Cherry Cake — Отчёт о продажах", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(8);
            document.add(title);

            // Filters & GeneratedAt
            String filtersText = String.format("Период: %s — %s | Регион: %s | Группировка: %s | Сгенерирован: %s",
                report.getFilters().get("from"),
                report.getFilters().get("to"),
                report.getFilters().get("region"),
                report.getFilters().get("groupBy"),
                report.getGeneratedAt());
            Paragraph subtitle = new Paragraph(filtersText, subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(15);
            document.add(subtitle);

            // KPI Table
            KpiBlock kpi = report.getKpi();
            PdfPTable kpiTable = new PdfPTable(6);
            kpiTable.setWidthPercentage(100);
            kpiTable.setSpacingAfter(15);

            String[] kpiHeaders = { "Заказов", "Subtotal", "НДС", "Скидка", "Выручка", "Ср. чек" };
            for (String h : kpiHeaders)
            {
                PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
                cell.setBackgroundColor(new Color(245, 230, 211));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                kpiTable.addCell(cell);
            }

            kpiTable.addCell(new Phrase(String.valueOf(kpi.getOrdersCount()), textFont));
            kpiTable.addCell(new Phrase(kpi.getSubtotal().toString(), textFont));
            kpiTable.addCell(new Phrase(kpi.getVatAmount().toString(), textFont));
            kpiTable.addCell(new Phrase(kpi.getDiscountAmount().toString(), textFont));
            kpiTable.addCell(new Phrase(kpi.getTotal().toString(), textFont));
            kpiTable.addCell(new Phrase(kpi.getAverageCheck().toString(), textFont));
            document.add(kpiTable);

            // JFreeChart Bar Chart
            if (!report.getRows().isEmpty())
            {
                DefaultCategoryDataset dataset = new DefaultCategoryDataset();
                for (ReportRow row : report.getRows())
                {
                    dataset.addValue(row.getTotal(), "Выручка", row.getLabel());
                }

                JFreeChart barChart = ChartFactory.createBarChart(
                    "Выручка по " + ("MONTH".equals(report.getGroupBy()) ? "месяцам" : "регионам"),
                    "Категория",
                    "Сумма",
                    dataset,
                    PlotOrientation.VERTICAL,
                    false, true, false);

                barChart.setBackgroundPaint(Color.WHITE);
                BufferedImage chartImg = barChart.createBufferedImage(500, 220);
                com.lowagie.text.Image pdfImg = com.lowagie.text.Image.getInstance(chartImg, null);
                pdfImg.setAlignment(Element.ALIGN_CENTER);
                pdfImg.setSpacingAfter(15);
                document.add(pdfImg);
            }

            // Rows Table
            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);

            String[] tableHeaders = { "Метка", "Заказы", "Subtotal", "НДС", "Скидка", "Доставка", "Итог", "Валюта" };
            for (String th : tableHeaders)
            {
                PdfPCell c = new PdfPCell(new Phrase(th, boldFont));
                c.setBackgroundColor(new Color(245, 230, 211));
                table.addCell(c);
            }

            for (ReportRow r : report.getRows())
            {
                table.addCell(new Phrase(r.getLabel(), textFont));
                table.addCell(new Phrase(String.valueOf(r.getOrdersCount()), textFont));
                table.addCell(new Phrase(r.getSubtotal().toString(), textFont));
                table.addCell(new Phrase(r.getVatAmount().toString(), textFont));
                table.addCell(new Phrase(r.getDiscountAmount().toString(), textFont));
                table.addCell(new Phrase(r.getDeliveryFee().toString(), textFont));
                table.addCell(new Phrase(r.getTotal().toString(), textFont));
                table.addCell(new Phrase(r.getCurrencyCode() != null ? r.getCurrencyCode() : "UZS", textFont));
            }

            document.add(table);
            document.close();

            return baos.toByteArray();
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to generate PDF sales report", e);
        }
    }
}
