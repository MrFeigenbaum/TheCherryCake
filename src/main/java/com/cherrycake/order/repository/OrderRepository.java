package com.cherrycake.order.repository;

import com.cherrycake.order.entity.Order;
import com.cherrycake.order.entity.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>
{
    Optional<Order> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Order> findByRegionCodeIgnoreCaseAndCreatedAtBetween(String regionCode, LocalDateTime startDate, LocalDateTime endDate);

    @Query
    (
        "SELECT r.code AS regionCode, r.name AS regionName, SUM(o.totalAmount) AS totalSales, COUNT(o) AS orderCount " +
        "FROM Order o JOIN o.region r " +
        "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
        "GROUP BY r.code, r.name"
    )
    List<Object[]> getSalesAggregateByRegion(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
