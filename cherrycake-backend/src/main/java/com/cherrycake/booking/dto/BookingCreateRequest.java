package com.cherrycake.booking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record BookingCreateRequest(
        @Schema(example = "2026-12-31")
        @NotNull(message = "date is required")
        @FutureOrPresent(message = "booking date must not be in the past")
        LocalDate date,

        @Schema(example = "18:00:00")
        @NotNull(message = "time is required")
        LocalTime time,

        @Schema(example = "4")
        @NotNull(message = "guests is required")
        @Min(value = 1, message = "guests must be between 1 and 12")
        @Max(value = 12, message = "guests must be between 1 and 12")
        Integer guests,

        @Schema(example = "Amir Karimov")
        @NotBlank(message = "name is required")
        String name,

        @Schema(example = "+998901234567")
        @NotBlank(message = "phone is required")
        String phone,

        @Schema(example = "amir@example.com")
        @NotBlank(message = "email is required")
        @Email(message = "email must be valid")
        String email) {
}
