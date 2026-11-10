package com.cherrycake.booking.repository;

import com.cherrycake.booking.entity.DiningTable;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiningTableRepository extends JpaRepository<DiningTable, Long> {

    List<DiningTable> findBySeatsGreaterThanEqualOrderBySeatsAscIdAsc(int seats);
}
