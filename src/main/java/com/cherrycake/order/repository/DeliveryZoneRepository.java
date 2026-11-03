package com.cherrycake.order.repository;

import com.cherrycake.order.entity.DeliveryZone;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryZoneRepository extends JpaRepository<DeliveryZone, Long>
{
    List<DeliveryZone> findByRegionIdAndActiveTrue(Long regionId);

    List<DeliveryZone> findByRegionCodeIgnoreCaseAndActiveTrue(String regionCode);
}