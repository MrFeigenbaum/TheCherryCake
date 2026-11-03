package com.cherrycake.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cherrycake.model.entity.ProductModifier;

import java.util.List;

@Repository
public interface ProductModifierRepository extends JpaRepository<ProductModifier, Long>
{ List<ProductModifier> findByProductId(Long productId); }