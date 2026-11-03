package com.cherrycake.catalog.repository;

import com.cherrycake.catalog.entity.Region;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long>
{
    Optional<Region> findByCodeIgnoreCase(String code);

    List<Region> findAllByActiveTrue();
}