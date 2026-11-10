package com.cherrycake.booking.controller;

import com.cherrycake.booking.dto.BookingCreateRequest;
import com.cherrycake.booking.dto.BookingResponse;
import com.cherrycake.booking.service.BookingService;
import com.cherrycake.common.dto.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings (Bonus)", description = "Dining table booking endpoints (CC-39)")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Book a dining table for 1-12 guests; prevents double booking")
    @ApiResponse(responseCode = "201", description = "Table booked")
    @ApiResponse(responseCode = "400", description = "Validation error (guests out of 1-12, invalid date/email)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "All suitable tables are already booked for that slot",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public BookingResponse createBooking(@Valid @RequestBody BookingCreateRequest request) {
        return bookingService.createBooking(request);
    }
}
