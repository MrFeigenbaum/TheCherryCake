package com.cherrycake.booking.service;

import com.cherrycake.booking.dto.BookingCreateRequest;
import com.cherrycake.booking.dto.BookingResponse;
import com.cherrycake.booking.entity.BookingStatus;
import com.cherrycake.booking.entity.TableBooking;
import com.cherrycake.booking.repository.TableBookingRepository;
import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.BookingConflictException;
import com.cherrycake.common.exception.ResourceNotFoundException;
import com.cherrycake.security.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService
{
    private static final AtomicLong BOOKING_COUNTER = new AtomicLong(40);

    private final TableBookingRepository tableBookingRepository;

    // Define cafe tables 1 to 12 with fixed capacities
    private static class CafeTable
    {
        final int tableNumber;
        final int capacity;

        CafeTable(int number, int capacity)
        {
            this.tableNumber = number;
            this.capacity = capacity;
        }
    }

    private static final List<CafeTable> CAFE_TABLES = Arrays.asList(
        new CafeTable(1, 2),
        new CafeTable(2, 2),
        new CafeTable(3, 2),
        new CafeTable(4, 4),
        new CafeTable(5, 4),
        new CafeTable(6, 4),
        new CafeTable(7, 6),
        new CafeTable(8, 6),
        new CafeTable(9, 8),
        new CafeTable(10, 8),
        new CafeTable(11, 10),
        new CafeTable(12, 12)
    );

    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request, User user)
    {
        if (request == null) throw new BadRequestException("Booking request cannot be null");

        // 1. Resolve date and time
        LocalDate targetDate = request.getDate();
        LocalTime targetTime = request.getTime();

        if (targetDate == null && request.getBookingTime() != null)
        {
            targetDate = request.getBookingTime().toLocalDate();
        }
        if (targetTime == null && request.getBookingTime() != null)
        {
            targetTime = request.getBookingTime().toLocalTime();
        }

        if (targetDate == null || targetTime == null)
        {
            throw new BadRequestException("Booking date and time are required");
        }

        // 2. Validate date >= today
        if (targetDate.isBefore(LocalDate.now()))
        {
            throw new BadRequestException("Booking date cannot be in the past: " + targetDate);
        }

        // 3. Validate working hours (10:00 - 22:00)
        LocalTime opening = LocalTime.of(10, 0);
        LocalTime closing = LocalTime.of(22, 0);
        if (targetTime.isBefore(opening) || targetTime.isAfter(closing))
        {
            throw new BadRequestException("Booking time must be within cafe working hours 10:00 - 22:00: " + targetTime);
        }

        // 4. Validate guests (1 - 12)
        int guests = request.getGuestsCount() != null ? request.getGuestsCount() : (request.getGuests() != null ? request.getGuests() : 0);
        if (guests < 1 || guests > 12)
        {
            throw new BadRequestException("Guests count must be between 1 and 12: " + guests);
        }

        LocalDateTime bookingDateTime = LocalDateTime.of(targetDate, targetTime);
        LocalDateTime windowStart = bookingDateTime.minusHours(2);
        LocalDateTime windowEnd = bookingDateTime.plusHours(2);

        // 5. Automatic Table Allocation by capacity ASC
        List<CafeTable> suitableTables = CAFE_TABLES.stream()
            .filter(t -> t.capacity >= guests)
            .sorted(Comparator.comparingInt(t -> t.capacity))
            .collect(Collectors.toList());

        Integer assignedTableNumber = null;

        // If client specifically specified a tableNumber, check if it's suitable and free
        if (request.getTableNumber() != null && request.getTableNumber() >= 1 && request.getTableNumber() <= 12)
        {
            int requestedNum = request.getTableNumber();
            boolean conflict = tableBookingRepository.existsByTableNumberAndBookingTimeBetween(requestedNum, windowStart, windowEnd);
            if (!conflict)
            {
                assignedTableNumber = requestedNum;
            }
        }

        if (assignedTableNumber == null)
        {
            for (CafeTable table : suitableTables)
            {
                boolean conflict = tableBookingRepository.existsByTableNumberAndBookingTimeBetween(table.tableNumber, windowStart, windowEnd);
                if (!conflict)
                {
                    assignedTableNumber = table.tableNumber;
                    break;
                }
            }
        }

        if (assignedTableNumber == null)
        {
            throw new BookingConflictException("Нет свободного столика на это время, попробуйте другое");
        }

        // 6. Generate booking number BK-YYYY-XXXXXX
        int year = LocalDate.now().getYear();
        long seq = BOOKING_COUNTER.incrementAndGet();
        String bookingNumber = String.format("BK-%d-%06d", year, seq);
        while (tableBookingRepository.existsByBookingNumber(bookingNumber))
        {
            seq = BOOKING_COUNTER.incrementAndGet();
            bookingNumber = String.format("BK-%d-%06d", year, seq);
        }

        TableBooking booking = TableBooking.builder()
            .bookingNumber(bookingNumber)
            .user(user)
            .tableNumber(assignedTableNumber)
            .guestsCount(guests)
            .bookingTime(bookingDateTime)
            .status(BookingStatus.CONFIRMED)
            .customerName(request.getCustomerName())
            .customerPhone(request.getCustomerPhone())
            .notes(request.getNotes())
            .createdAt(LocalDateTime.now())
            .build();

        TableBooking saved = tableBookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByNumber(String bookingNumber)
    {
        TableBooking booking = tableBookingRepository.findByBookingNumber(bookingNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with number: " + bookingNumber));
        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId)
    {
        return tableBookingRepository.findByUserIdOrderByBookingTimeDesc(userId).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(TableBooking booking)
    {
        LocalDate date = booking.getBookingTime() != null ? booking.getBookingTime().toLocalDate() : null;
        LocalTime time = booking.getBookingTime() != null ? booking.getBookingTime().toLocalTime() : null;

        return BookingResponse.builder()
            .id(booking.getId())
            .bookingNumber(booking.getBookingNumber())
            .tableNumber(booking.getTableNumber())
            .guests(booking.getGuestsCount())
            .date(date)
            .time(time)
            .bookingTime(booking.getBookingTime())
            .status(booking.getStatus())
            .customerName(booking.getCustomerName())
            .customerPhone(booking.getCustomerPhone())
            .notes(booking.getNotes())
            .createdAt(booking.getCreatedAt())
            .build();
    }
}
