package com.cherrycake.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cherrycake.model.entity.Discount;
import com.cherrycake.model.enums.DiscountType;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long>
{
    Optional<Discount> findByCodeIgnoreCaseAndActiveTrue(String code);

    List<Discount> findByDiscountTypeAndActiveTrue(DiscountType discountType);
}