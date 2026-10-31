-- V6__add_order_discount_rate_and_promo.sql: Add discount_rate, promo_code and delivery_zone_id to orders table

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_rate NUMERIC(5, 4) DEFAULT 0.0000;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone_id BIGINT REFERENCES delivery_zones(id);

