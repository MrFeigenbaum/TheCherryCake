package com.cherrycake.booking.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateRequest
{
    private Integer tableNumber;

    @NotNull(message = "Guests count is required")
    @Min(value = 1, message = "Guests count must be between 1 and 12")
    @Max(value = 12, message = "Guests count must be between 1 and 12")
    @JsonAlias({"guests", "guestsCount"})
    private Integer guestsCount;

    private LocalDate date;

    private LocalTime time;

    @com.fasterxml.jackson.databind.annotation.JsonDeserialize(using = com.cherrycake.common.util.FlexibleLocalDateTimeDeserializer.class)
    private LocalDateTime bookingTime;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "Phone must be valid")
    private String customerPhone;

    private String notes;

    public Integer getGuests() { return guestsCount; }
    public void setGuests(Integer g) { this.guestsCount = g; }
}
