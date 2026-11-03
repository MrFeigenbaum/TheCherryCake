package com.cherrycake.catalog.repository;

import com.cherrycake.catalog.entity.ProductPrice;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long>
{
    Optional<ProductPrice> findByProductIdAndRegionId(Long productId, Long regionId);

    Optional<ProductPrice> findByProductCodeAndRegionCode(String productCode, String regionCode);
}