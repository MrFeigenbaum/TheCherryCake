package com.cherrycake.order.controller;

import com.cherrycake.common.dto.ErrorResponse;
import com.cherrycake.order.dto.DeliveryZoneResponse;
import com.cherrycake.order.dto.PickupPointResponse;
import com.cherrycake.order.dto.TimeSlotResponse;
import com.cherrycake.order.service.LogisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Fulfillment & Slots (Bonus)", description = "Pickup points, delivery zones and time slots (CC-25)")
public class LogisticsController {

    private final LogisticsService logisticsService;

    public LogisticsController(LogisticsService logisticsService) {
        this.logisticsService = logisticsService;
    }

    @GetMapping("/pickup-points")
    @Operation(summary = "List pickup points for a country")
    @ApiResponse(responseCode = "200", description = "Pickup points for the region")
    @ApiResponse(responseCode = "400", description = "Region is missing",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Unknown region",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public List<PickupPointResponse> getPickupPoints(
            @Parameter(example = "UZB") @RequestParam String region) {
        return logisticsService.getPickupPoints(region);
    }

    @GetMapping("/delivery-zones")
    @Operation(summary = "List delivery zones and fees for a country")
    @ApiResponse(responseCode = "200", description = "Delivery zones with deliveryFee in local currency")
    @ApiResponse(responseCode = "400", description = "Region is missing",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Unknown region",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public List<DeliveryZoneResponse> getDeliveryZones(
            @Parameter(example = "UZB") @RequestParam String region) {
        return logisticsService.getDeliveryZones(region);
    }

    @GetMapping("/time-slots")
    @Operation(summary = "List time slots for a date with availability flag")
    @ApiResponse(responseCode = "200", description = "Time slots for the requested date")
    public List<TimeSlotResponse> getTimeSlots(
            @Parameter(description = "Date (YYYY-MM-DD); defaults to today", example = "2026-11-10")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return logisticsService.getTimeSlots(date);
    }
}

