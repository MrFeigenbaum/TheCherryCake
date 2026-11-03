package com.cherrycake.catalog.repository;

import com.cherrycake.catalog.entity.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>
{
    Optional<Product> findByCode(String code);

    List<Product> findByCategoryIdAndAvailableTrue(Long categoryId);

    List<Product> findAllByAvailableTrue();
}