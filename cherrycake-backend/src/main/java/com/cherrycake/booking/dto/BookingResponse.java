package com.cherrycake.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingResponse(
        String bookingNumber,
        String tableNumber,
        LocalDate date,
        LocalTime time,
        int guests) {
}
