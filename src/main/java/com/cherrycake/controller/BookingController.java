package com.cherrycake.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.dto.request.BookingCreateRequest;
import com.cherrycake.dto.response.BookingResponse;
import com.cherrycake.model.entity.User;
import com.cherrycake.service.AuthService;
import com.cherrycake.service.BookingService;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Café table reservation and booking management")
public class BookingController
{
    private final BookingService bookingService;
    private final AuthService authService;

    @PostMapping({"/api/bookings", "/api/v1/bookings"})
    @Operation(summary = "Reserve a table in the café with automatic capacity allocation")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingCreateRequest request)
    {
        User currentUser = authService.getCurrentAuthenticatedUser();
        BookingResponse response = bookingService.createBooking(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping({"/api/bookings/{bookingNumber}", "/api/v1/bookings/{bookingNumber}"})
    @Operation(summary = "Get table booking details by booking number")
    public ResponseEntity<BookingResponse> getBookingByNumber(@PathVariable String bookingNumber)
    {
        return ResponseEntity.ok(bookingService.getBookingByNumber(bookingNumber));
    }

    @GetMapping({"/api/bookings/my", "/api/v1/bookings/my"})
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current authenticated user's reservations")
    public ResponseEntity<List<BookingResponse>> getMyBookings()
    {
        User currentUser = authService.getCurrentAuthenticatedUser();

        if (currentUser == null)
        {
            throw new BadRequestException("User not authenticated");
        }

        return ResponseEntity.ok(bookingService.getUserBookings(currentUser.getId()));
    }
}
