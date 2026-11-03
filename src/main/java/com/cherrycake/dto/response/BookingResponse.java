package com.cherrycake.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.cherrycake.model.enums.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse
{
    private Long id;
    private String bookingNumber;
    private Integer tableNumber;

    @JsonProperty("guests")
    @JsonAlias({"guestsCount", "guests"})
    private Integer guests;

    private LocalDate date;
    private LocalTime time;

    private LocalDateTime bookingTime;
    private BookingStatus status;
    private String customerName;
    private String customerPhone;
    private String notes;
    private LocalDateTime createdAt;

    // Backward compatibility
    @com.fasterxml.jackson.annotation.JsonIgnore
    public Integer getGuestsCount() { return guests; }
    public void setGuestsCount(Integer g) { this.guests = g; }
}
