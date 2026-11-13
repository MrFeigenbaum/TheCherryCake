package com.cherrycake.order.entity;

public enum OrderStatus
{
    NEW,
    CONFIRMED,
    PREPARING,
    READY_FOR_PICKUP,
    OUT_FOR_DELIVERY,
    DONE,
    DELIVERED,
    CANCELLED,
    PENDING
}