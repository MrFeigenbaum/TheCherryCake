-- V5__align_proto_spec.sql: Ensure tables, columns, and seed data strictly match Proto requirements

-- 1. Add is_available column to product_prices if not exists
ALTER TABLE product_prices ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Add expiration dates to discounts for promo codes
ALTER TABLE discounts ADD COLUMN IF NOT EXISTS valid_from DATE;
ALTER TABLE discounts ADD COLUMN IF NOT EXISTS valid_to DATE;

-- 3. Add modifier group metadata to product_modifiers
ALTER TABLE product_modifiers ADD COLUMN IF NOT EXISTS group_name VARCHAR(100) DEFAULT 'Options';
ALTER TABLE product_modifiers ADD COLUMN IF NOT EXISTS group_type VARCHAR(20) DEFAULT 'MULTI'; -- SINGLE, MULTI
ALTER TABLE product_modifiers ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT FALSE;

-- 4. Ensure ISO 2-letter regions UZ, KZ, RU exist
INSERT INTO regions (code, name, currency_code, currency_symbol, vat_rate, is_active)
VALUES
('UZ', 'Uzbekistan', 'UZS', 'soʻm', 12.00, TRUE),
('KZ', 'Kazakhstan', 'KZT', '₸', 12.00, TRUE),
('RU', 'Russia', 'RUB', '₽', 20.00, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Also ensure prices for UZ and RU exist for Product 1 (Cherry Blossom) and others
-- For C01-C03 test cases: UZ price = 100.00, RU price = 120.00
INSERT INTO product_prices (product_id, region_id, price, is_available)
SELECT 1, r.id, 100.00, TRUE FROM regions r WHERE r.code = 'UZ'
ON CONFLICT (product_id, region_id) DO UPDATE SET price = 100.00, is_available = TRUE;

INSERT INTO product_prices (product_id, region_id, price, is_available)
SELECT 1, r.id, 120.00, TRUE FROM regions r WHERE r.code = 'RU'
ON CONFLICT (product_id, region_id) DO UPDATE SET price = 120.00, is_available = TRUE;

INSERT INTO product_prices (product_id, region_id, price, is_available)
SELECT 1, r.id, 100.00, TRUE FROM regions r WHERE r.code = 'KZ'
ON CONFLICT (product_id, region_id) DO UPDATE SET price = 100.00, is_available = TRUE;

-- Add prices for all other products in UZ, KZ, RU if missing
INSERT INTO product_prices (product_id, region_id, price, is_available)
SELECT p.id, r.id,
    CASE 
        WHEN p.id = 1 THEN 100.00
        WHEN p.id = 2 THEN 90.00
        WHEN p.id = 3 THEN 95.00
        WHEN p.id = 4 THEN 20.00
        WHEN p.id = 5 THEN 15.00
        WHEN p.id = 6 THEN 25.00
        ELSE 18.00
    END,
    TRUE
FROM products p
CROSS JOIN regions r
WHERE r.code IN ('UZ', 'KZ', 'RU')
ON CONFLICT (product_id, region_id) DO NOTHING;

-- 5. Add standard modifiers for test cases C03 (+10.00 modifier)
INSERT INTO product_modifiers (product_id, name, price_delta, is_default, group_name, group_type, is_required)
VALUES
(1, 'Extra Cherry Glaze (+10.00)', 10.00, FALSE, 'Add-ons', 'MULTI', FALSE)
ON CONFLICT DO NOTHING;

-- 6. Add Threshold discounts matching Proto §3.1 (>= 200 -> 5%, >= 500 -> 10%)
INSERT INTO discounts (code, name, discount_type, min_subtotal, percentage, fixed_amount, is_active)
VALUES
(NULL, 'Order >= 200 (5%)', 'THRESHOLD', 200.00, 5.00, 0.00, TRUE),
(NULL, 'Order >= 500 (10%)', 'THRESHOLD', 500.00, 10.00, 0.00, TRUE)
ON CONFLICT DO NOTHING;

-- 7. Add Promo codes matching Proto §3.1 (PROMO10 -> 10%)
INSERT INTO discounts (code, name, discount_type, min_subtotal, percentage, fixed_amount, is_active, valid_from, valid_to)
VALUES
('PROMO10', 'Promo 10% Off', 'PROMO_CODE', 0.00, 10.00, 0.00, TRUE, '2026-01-01', '2030-12-31')
ON CONFLICT (code) DO UPDATE SET percentage = 10.00, is_active = TRUE, valid_from = '2026-01-01', valid_to = '2030-12-31';

-- 8. Add delivery zone 'Center' with fee 5.00 for UZ (matching C08 test case)
INSERT INTO delivery_zones (region_id, name, delivery_fee, estimated_minutes, is_active)
SELECT r.id, 'Center (City Center)', 5.00, 30, TRUE FROM regions r WHERE r.code = 'UZ'
ON CONFLICT DO NOTHING;

-- 9. Add pickup points for UZ
INSERT INTO pickup_points (region_id, name, address, working_hours, is_active)
SELECT r.id, 'Main Flagship Bakery', 'Amir Temur Ave 45, Tashkent', '08:00 - 22:00', TRUE FROM regions r WHERE r.code = 'UZ'
ON CONFLICT DO NOTHING;

-- 10. Ensure user roles match RBAC matrix
-- admin@cherrycake.com (ROLE_ADMIN)
-- staff@cherrycake.com (ROLE_STAFF)
-- viewer@cherrycake.com (ROLE_VIEWER)
-- customer@cherrycake.com (ROLE_CUSTOMER)
INSERT INTO users (email, password_hash, full_name, phone, role)
VALUES
('staff@cherrycake.com', '.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Staff Member', '+998901112233', 'ROLE_STAFF'),
('viewer@cherrycake.com', '.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Auditor Viewer', '+998904445566', 'ROLE_VIEWER')
ON CONFLICT (email) DO NOTHING;

UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'admin@cherrycake.com';
UPDATE users SET role = 'ROLE_CUSTOMER' WHERE email = 'customer@cherrycake.com';
