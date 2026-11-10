-- CC-38: Link orders to optional pickup_point, delivery_zone and time_slot.

ALTER TABLE orders ADD COLUMN pickup_point_id BIGINT;
ALTER TABLE orders ADD COLUMN delivery_zone_id BIGINT;
ALTER TABLE orders ADD COLUMN time_slot_id BIGINT;

ALTER TABLE orders ADD CONSTRAINT fk_orders_pickup_point FOREIGN KEY (pickup_point_id) REFERENCES pickup_points (id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_delivery_zone FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones (id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_time_slot FOREIGN KEY (time_slot_id) REFERENCES time_slots (id);

