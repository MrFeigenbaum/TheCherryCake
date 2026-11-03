package com.cherrycake.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

    @Column(name = "slot_time", nullable = false)
    private LocalDateTime slotTime;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 10;

    @Column(name = "reserved_count", nullable = false)
    @Builder.Default
    private Integer reservedCount = 0;

    public boolean isFull() { return reservedCount >= capacity; }

    public boolean isAvailable() { return reservedCount < capacity; }

    public LocalDate getSlotDate() { return slotTime != null ? slotTime.toLocalDate() : null; }

    public LocalTime getStartTime() { return slotTime != null ? slotTime.toLocalTime() : null; }

    public LocalTime getEndTime() { return slotTime != null ? slotTime.toLocalTime().plusMinutes(30) : null; }
}
