-- V4__bonus_features.sql: Bonus features (Users, Logistics, Slots, Tables, Bookings)

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pickup Points
CREATE TABLE IF NOT EXISTS pickup_points (
    id BIGSERIAL PRIMARY KEY,
    region_id BIGINT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    working_hours VARCHAR(50) DEFAULT '08:00 - 22:00',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Delivery Zones
CREATE TABLE IF NOT EXISTS delivery_zones (
    id BIGSERIAL PRIMARY KEY,
    region_id BIGINT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    estimated_minutes INT DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. Time Slots
CREATE TABLE IF NOT EXISTS time_slots (
    id BIGSERIAL PRIMARY KEY,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT NOT NULL DEFAULT 10,
    booked_count INT NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_slot_datetime UNIQUE (slot_date, start_time)
);

-- 5. Restaurant Tables
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id BIGSERIAL PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL DEFAULT 4,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. Table Bookings
CREATE TABLE IF NOT EXISTS table_bookings (
    id BIGSERIAL PRIMARY KEY,
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id),
    table_id BIGINT REFERENCES restaurant_tables(id),
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    guests_count INT NOT NULL DEFAULT 2,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    comment TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Seed Users (Bcrypt hash for password123)
INSERT INTO users (id, email, password_hash, full_name, phone, role) VALUES
(1, 'admin@cherrycake.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Администратор системы', '+998901234567', 'ADMIN'),
(2, 'staff@cherrycake.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Менеджер смены', '+998902345678', 'STAFF'),
(3, 'viewer@cherrycake.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Аудитор / Наблюдатель', '+998903456789', 'VIEWER'),
(4, 'customer@cherrycake.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Постоянный гость', '+998904567890', 'CUSTOMER')
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Pickup Points
INSERT INTO pickup_points (region_id, name, address, working_hours, is_active)
SELECT r.id, val.name, val.address, '08:00 - 22:00', TRUE
FROM regions r
JOIN (VALUES
    ('UZ', 'Кондитерская на Амира Темура', 'ул. Амира Темура, 42, Ташкент'),
    ('KZ', 'Флагманский бутик Достык', 'пр. Достык, 89, Алматы'),
    ('GE', 'Кафе на Руставели', 'пр. Шота Руставели, 18, Тбилиси'),
    ('UA', 'Кондитерская на Крещатике', 'ул. Крещатик, 24, Киев'),
    ('CN', 'Ванфуцзин Бутик', 'Wangfujing St 138, Пекин'),
    ('SE', 'Stockholm Gamla Stan Bakery', 'Stortorget 7, Стокгольм'),
    ('FI', 'Helsinki Esplanadi Café', 'Pohjoisesplanadi 21, Хельсинки'),
    ('BY', 'Кондитерская на Независимости', 'пр. Независимости, 25, Минск'),
    ('EE', 'Tallinn Rotermann Boutique', 'Rotermanni 8, Таллин'),
    ('LT', 'Vilnius Old Town Bakery', 'Pilies g. 12, Вильнюс'),
    ('LV', 'Riga Art Nouveau Café', 'Elizabetes iela 33, Рига'),
    ('AM', 'Кафе на Абовяна', 'ул. Абовяна, 14, Ереван')
) AS val(code, name, address) ON r.code = val.code;

-- 9. Seed Delivery Zones
INSERT INTO delivery_zones (region_id, name, delivery_fee, fee, estimated_minutes, is_active)
SELECT r.id, val.name, val.fee, val.fee, 35, TRUE
FROM regions r
JOIN (VALUES
    ('UZ', 'Ташкент — Центр', 20000.00),
    ('KZ', 'Алматы — Медеуский р-н', 1200.00),
    ('GE', 'Тбилиси — Центр', 8.00),
    ('UA', 'Киев — Печерский р-н', 90.00),
    ('CN', 'Пекин — Район Дунчэн', 25.00),
    ('SE', 'Stockholm Inner City', 45.00),
    ('FI', 'Helsinki Kamppi & Center', 4.50),
    ('BY', 'Минск — Центральный р-н', 8.00),
    ('EE', 'Tallinn Kesklinn', 3.50),
    ('LT', 'Vilnius Central', 3.00),
    ('LV', 'Riga Central', 3.00),
    ('AM', 'Ереван — Кентрон', 800.00)
) AS val(code, name, fee) ON r.code = val.code;

-- 10. Seed Time Slots
INSERT INTO time_slots (slot_date, start_time, end_time, capacity, booked_count, is_available) VALUES
(CURRENT_DATE, '10:00:00', '12:00:00', 10, 0, TRUE),
(CURRENT_DATE, '12:00:00', '14:00:00', 10, 0, TRUE),
(CURRENT_DATE, '14:00:00', '16:00:00', 10, 0, TRUE),
(CURRENT_DATE, '16:00:00', '18:00:00', 10, 0, TRUE),
(CURRENT_DATE, '18:00:00', '20:00:00', 10, 0, TRUE),
(CURRENT_DATE, '20:00:00', '22:00:00', 10, 0, TRUE)
ON CONFLICT (slot_date, start_time) DO NOTHING;

-- 11. Seed Tables
INSERT INTO restaurant_tables (table_number, capacity, is_active) VALUES
('T-01', 2, TRUE),
('T-02', 2, TRUE),
('T-03', 4, TRUE),
('T-04', 4, TRUE),
('T-05', 6, TRUE)
ON CONFLICT (table_number) DO NOTHING;

