package com.cherrycake.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cherrycake.model.entity.Product;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>
{
    Optional<Product> findByCode(String code);

    List<Product> findByCategoryIdAndAvailableTrue(Long categoryId);

    List<Product> findAllByAvailableTrue();
}