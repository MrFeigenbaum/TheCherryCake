package com.cherrycake.booking.service;

import com.cherrycake.booking.dto.BookingCreateRequest;
import com.cherrycake.booking.dto.BookingResponse;
import com.cherrycake.booking.entity.Booking;
import com.cherrycake.booking.entity.DiningTable;
import com.cherrycake.booking.repository.BookingRepository;
import com.cherrycake.booking.repository.DiningTableRepository;
import com.cherrycake.common.exception.ConflictException;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Bonus stage 4 dining table reservation service preventing double-bookings (CC-39).
 */
@Service
public class BookingService {

    private static final AtomicLong BOOKING_SEQ = new AtomicLong(100);

    private final DiningTableRepository diningTableRepository;
    private final BookingRepository bookingRepository;

    public BookingService(
            DiningTableRepository diningTableRepository,
            BookingRepository bookingRepository) {
        this.diningTableRepository = diningTableRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request) {
        List<DiningTable> suitableTables = diningTableRepository
                .findBySeatsGreaterThanEqualOrderBySeatsAscIdAsc(request.guests());

        Set<Long> bookedTableIds = bookingRepository.findBookedTableIds(request.date(), request.time());

        DiningTable assignedTable = suitableTables.stream()
                .filter(table -> !bookedTableIds.contains(table.getId()))
                .findFirst()
                .orElseThrow(() -> new ConflictException(
                        "No dining table available for " + request.guests() + " guests at "
                                + request.date() + " " + request.time()));

        Booking booking = new Booking();
        booking.setBookingNumber(nextBookingNumber());
        booking.setTableId(assignedTable.getId());
        booking.setBookingDate(request.date());
        booking.setBookingTime(request.time());
        booking.setGuests(request.guests());
        booking.setName(request.name().trim());
        booking.setPhone(request.phone().trim());
        booking.setEmail(request.email().trim());
        booking.setCreatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        return new BookingResponse(
                saved.getBookingNumber(),
                assignedTable.getTableNumber(),
                saved.getBookingDate(),
                saved.getBookingTime(),
                saved.getGuests());
    }

    private String nextBookingNumber() {
        int year = Year.now().getValue();
        long candidate = Math.max(BOOKING_SEQ.incrementAndGet(), bookingRepository.count() + 101);
        String number = String.format("BK-%d-%06d", year, candidate);
        while (bookingRepository.existsByBookingNumber(number)) {
            candidate = BOOKING_SEQ.incrementAndGet();
            number = String.format("BK-%d-%06d", year, candidate);
        }
        return number;
    }
}
