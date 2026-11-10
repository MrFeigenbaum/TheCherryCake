package com.cherrycake.booking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "dining_tables")
public class DiningTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number", nullable = false, unique = true, length = 20)
    private String tableNumber;

    @Column(name = "seats", nullable = false)
    private int seats;

    public DiningTable() {
    }

    public Long getId() {
        return id;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public int getSeats() {
        return seats;
    }
}
