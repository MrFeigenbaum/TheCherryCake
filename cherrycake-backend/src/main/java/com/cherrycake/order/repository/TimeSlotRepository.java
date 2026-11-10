package com.cherrycake.order.repository;

import com.cherrycake.order.entity.TimeSlot;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findBySlotDateOrderByStartTime(LocalDate slotDate);
}

