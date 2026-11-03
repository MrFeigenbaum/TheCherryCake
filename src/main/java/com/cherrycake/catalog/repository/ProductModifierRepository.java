package com.cherrycake.catalog.repository;

import com.cherrycake.catalog.entity.ProductModifier;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductModifierRepository extends JpaRepository<ProductModifier, Long>
{ List<ProductModifier> findByProductId(Long productId); }