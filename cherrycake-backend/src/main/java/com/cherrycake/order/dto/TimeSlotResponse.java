package com.cherrycake.order.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record TimeSlotResponse(
        Long id,
        LocalDate slotDate,
        LocalTime startTime,
        int capacity,
        int bookedCount,
        boolean isAvailable) {
}

