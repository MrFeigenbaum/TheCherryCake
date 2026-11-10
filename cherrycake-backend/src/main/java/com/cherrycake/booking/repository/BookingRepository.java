package com.cherrycake.booking.repository;

import com.cherrycake.booking.entity.Booking;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b.tableId FROM Booking b WHERE b.bookingDate = :date AND b.bookingTime = :time")
    Set<Long> findBookedTableIds(@Param("date") LocalDate date, @Param("time") LocalTime time);

    boolean existsByBookingNumber(String bookingNumber);
}
