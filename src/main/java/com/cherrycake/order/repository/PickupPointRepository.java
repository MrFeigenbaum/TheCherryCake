package com.cherrycake.order.repository;

import com.cherrycake.order.entity.PickupPoint;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PickupPointRepository extends JpaRepository<PickupPoint, Long>
{
    List<PickupPoint> findByRegionIdAndActiveTrue(Long regionId);

    List<PickupPoint> findByRegionCodeIgnoreCaseAndActiveTrue(String regionCode);
}