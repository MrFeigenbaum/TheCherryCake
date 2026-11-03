package com.cherrycake.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cherrycake.model.entity.PickupPoint;

import java.util.List;

@Repository
public interface PickupPointRepository extends JpaRepository<PickupPoint, Long>
{
    List<PickupPoint> findByRegionIdAndActiveTrue(Long regionId);

    List<PickupPoint> findByRegionCodeIgnoreCaseAndActiveTrue(String regionCode);
}