-- V2__orders.sql: Orders and Order Items (CC-6)
-- Only two tables created: orders (заказы) and order_items (состав заказа)

-- 1. Orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT,
    region_id BIGINT NOT NULL REFERENCES regions(id),
    slot_id BIGINT,
    pickup_point_id BIGINT,
    delivery_zone_id BIGINT,
    order_type VARCHAR(20) NOT NULL DEFAULT 'PICKUP', -- PICKUP, DELIVERY
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',       -- NEW, CONFIRMED, DONE, CANCELLED
    subtotal NUMERIC(15, 2) NOT NULL,
    vat_rate NUMERIC(5, 4) NOT NULL,
    vat_amount NUMERIC(15, 2) NOT NULL,
    amount_incl_vat NUMERIC(15, 2) NOT NULL,
    discount_rate NUMERIC(5, 4) DEFAULT 0.0000,
    discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    promo_code VARCHAR(50),
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    delivery_address TEXT,
    order_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    product_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(15, 2) NOT NULL,
    line_total NUMERIC(15, 2) NOT NULL,
    selected_modifiers_json TEXT
);
