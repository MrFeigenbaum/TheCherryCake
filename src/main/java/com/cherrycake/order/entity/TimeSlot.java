package com.cherrycake.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "time_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlot
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 10;

    @Column(name = "booked_count", nullable = false)
    @Builder.Default
    private Integer bookedCount = 0;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private boolean isAvailable = true;

    public boolean isFull() { return bookedCount >= capacity; }

    public boolean isAvailable() { return isAvailable && bookedCount < capacity; }

    public LocalDateTime getSlotTime()
    { return slotDate != null && startTime != null ? LocalDateTime.of(slotDate, startTime) : null; }

    public void setSlotTime(LocalDateTime ldt)
    {
        if (ldt != null)
        {
            this.slotDate = ldt.toLocalDate();
            this.startTime = ldt.toLocalTime();
            this.endTime = ldt.toLocalTime().plusMinutes(30);
        }
    }

    // Aliases for compatibility
    public Integer getReservedCount() { return bookedCount; }
    public void setReservedCount(Integer count) { this.bookedCount = count; }
}