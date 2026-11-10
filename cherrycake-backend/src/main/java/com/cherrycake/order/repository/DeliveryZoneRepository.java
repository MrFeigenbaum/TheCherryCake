package com.cherrycake.order.repository;

import com.cherrycake.order.entity.DeliveryZone;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryZoneRepository extends JpaRepository<DeliveryZone, Long> {

    List<DeliveryZone> findByRegionIdOrderById(Long regionId);
}

