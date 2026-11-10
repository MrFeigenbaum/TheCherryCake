package com.cherrycake.order.repository;

import com.cherrycake.order.entity.PickupPoint;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickupPointRepository extends JpaRepository<PickupPoint, Long> {

    List<PickupPoint> findByRegionIdOrderById(Long regionId);
}

