package com.cherrycake.order.service;

import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.NotFoundException;
import com.cherrycake.order.dto.DeliveryZoneResponse;
import com.cherrycake.order.dto.PickupPointResponse;
import com.cherrycake.order.dto.TimeSlotResponse;
import com.cherrycake.order.repository.DeliveryZoneRepository;
import com.cherrycake.order.repository.PickupPointRepository;
import com.cherrycake.order.repository.TimeSlotRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Bonus stage 4 queries for pickup points, delivery zones and time slots (CC-25).
 */
@Service
@Transactional(readOnly = true)
public class LogisticsService {

    private final PickupPointRepository pickupPointRepository;
    private final DeliveryZoneRepository deliveryZoneRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final JdbcTemplate jdbcTemplate;

    public LogisticsService(
            PickupPointRepository pickupPointRepository,
            DeliveryZoneRepository deliveryZoneRepository,
            TimeSlotRepository timeSlotRepository,
            JdbcTemplate jdbcTemplate) {
        this.pickupPointRepository = pickupPointRepository;
        this.deliveryZoneRepository = deliveryZoneRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<PickupPointResponse> getPickupPoints(String regionCode) {
        Long regionId = resolveRegionId(regionCode);
        return pickupPointRepository.findByRegionIdOrderById(regionId).stream()
                .map(p -> new PickupPointResponse(p.getId(), p.getName(), p.getAddress()))
                .toList();
    }

    public List<DeliveryZoneResponse> getDeliveryZones(String regionCode) {
        Long regionId = resolveRegionId(regionCode);
        return deliveryZoneRepository.findByRegionIdOrderById(regionId).stream()
                .map(z -> new DeliveryZoneResponse(z.getId(), z.getName(), z.getDeliveryFee()))
                .toList();
    }

    public List<TimeSlotResponse> getTimeSlots(LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return timeSlotRepository.findBySlotDateOrderByStartTime(targetDate).stream()
                .map(s -> new TimeSlotResponse(
                        s.getId(),
                        s.getSlotDate(),
                        s.getStartTime(),
                        s.getCapacity(),
                        s.getBookedCount(),
                        s.isAvailable()))
                .toList();
    }

    private Long resolveRegionId(String regionCode) {
        if (regionCode == null || regionCode.isBlank()) {
            throw new BadRequestException("region is required");
        }
        String normalized = regionCode.trim().toUpperCase();
        List<Long> ids = jdbcTemplate.query(
                "SELECT id FROM regions WHERE code = ?",
                (rs, rowNum) -> rs.getLong("id"),
                normalized);
        if (ids.isEmpty()) {
            throw new NotFoundException("Unknown region: " + normalized);
        }
        return ids.get(0);
    }
}

