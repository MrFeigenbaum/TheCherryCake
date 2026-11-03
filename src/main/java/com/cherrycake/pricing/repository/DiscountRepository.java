package com.cherrycake.pricing.repository;

import com.cherrycake.pricing.entity.Discount;
import com.cherrycake.pricing.entity.DiscountType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long>
{
    Optional<Discount> findByCodeIgnoreCaseAndActiveTrue(String code);

    List<Discount> findByDiscountTypeAndActiveTrue(DiscountType discountType);
}