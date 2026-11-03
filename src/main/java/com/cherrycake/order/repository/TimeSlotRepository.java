package com.cherrycake.order.repository;

import com.cherrycake.order.entity.TimeSlot;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long>
{ List<TimeSlot> findBySlotTimeAfterOrderBySlotTimeAsc(LocalDateTime now); }