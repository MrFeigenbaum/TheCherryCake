package com.cherrycake.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cherrycake.model.entity.DeliveryZone;

import java.util.List;

@Repository
public interface DeliveryZoneRepository extends JpaRepository<DeliveryZone, Long>
{
    List<DeliveryZone> findByRegionIdAndActiveTrue(Long regionId);

    List<DeliveryZone> findByRegionCodeIgnoreCaseAndActiveTrue(String regionCode);
}