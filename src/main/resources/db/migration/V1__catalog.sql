-- V1__catalog.sql: Catalog, Regions, Regional Prices, Modifiers, and Discounts (CC-5)

-- 1. Regions table
CREATE TABLE IF NOT EXISTS regions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    vat_rate NUMERIC(5, 4) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0
);

-- 3. Products table (Note: prices are NOT stored here, but in regional_prices)
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    code VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Regional prices (CC-5 specification: PK on product_id, region_id)
CREATE TABLE IF NOT EXISTS regional_prices (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    region_id BIGINT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    price NUMERIC(12, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (product_id, region_id)
);

-- Backward compatibility table product_prices
CREATE TABLE IF NOT EXISTS product_prices (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    region_id BIGINT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    price NUMERIC(12, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_product_prices_prod_reg UNIQUE (product_id, region_id)
);

-- 5. Modifier groups
CREATE TABLE IF NOT EXISTS modifier_groups (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'MULTI', -- SINGLE or MULTI
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0
);

-- 6. Modifiers
CREATE TABLE IF NOT EXISTS modifiers (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

-- 7. Modifier regional prices
CREATE TABLE IF NOT EXISTS modifier_regional_prices (
    modifier_id BIGINT NOT NULL REFERENCES modifiers(id) ON DELETE CASCADE,
    region_id BIGINT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    price_delta NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (modifier_id, region_id)
);

-- Backward compatibility table product_modifiers
CREATE TABLE IF NOT EXISTS product_modifiers (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_delta NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    group_name VARCHAR(100) DEFAULT 'Options',
    group_type VARCHAR(20) DEFAULT 'MULTI',
    is_required BOOLEAN NOT NULL DEFAULT FALSE
);

-- 8. Discount rules
CREATE TABLE IF NOT EXISTS discount_rules (
    id BIGSERIAL PRIMARY KEY,
    region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE, -- NULL = all regions
    threshold_amount NUMERIC(12, 2) NOT NULL,
    discount_rate NUMERIC(5, 4) NOT NULL
);

-- Backward compatibility table discounts
CREATE TABLE IF NOT EXISTS discounts (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    discount_type VARCHAR(30) NOT NULL,
    min_subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    fixed_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 9. Promo codes
CREATE TABLE IF NOT EXISTS promo_codes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_rate NUMERIC(5, 4) NOT NULL,
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Seed operating regions and currencies (UZB, KAZ, GEO, UKR, CHN, SWE, FIN, BEL, EST, LIT, LAT, ARM, etc.)
INSERT INTO regions (code, name, currency_code, currency_symbol, vat_rate, is_active) VALUES
('UZ', 'Uzbekistan', 'UZS', 'so''m', 0.1500, TRUE),
('UZB', 'Uzbekistan (Alt)', 'UZS', 'so''m', 0.1500, TRUE),
('KZ', 'Kazakhstan', 'KZT', '₸', 0.2000, TRUE),
('KAZ', 'Kazakhstan (Alt)', 'KZT', '₸', 0.2000, TRUE),
('GE', 'Georgia', 'GEL', '₾', 0.1200, TRUE),
('GEO', 'Georgia (Alt)', 'GEL', '₾', 0.1200, TRUE),
('UA', 'Ukraine', 'UAH', '₴', 0.0800, TRUE),
('UKR', 'Ukraine (Alt)', 'UAH', '₴', 0.0800, TRUE),
('CN', 'China', 'CNY', '¥', 0.1800, TRUE),
('CHN', 'China (Alt)', 'CNY', '¥', 0.1800, TRUE),
('SE', 'Sweden', 'SEK', 'kr', 0.2500, TRUE),
('SWE', 'Sweden (Alt)', 'SEK', 'kr', 0.2500, TRUE),
('FI', 'Finland', 'EUR', '€', 0.2550, TRUE),
('FIN', 'Finland (Alt)', 'EUR', '€', 0.2550, TRUE),
('BY', 'Belarus', 'BYN', 'Br', 0.2000, TRUE),
('BEL', 'Belarus (Alt)', 'BYN', 'Br', 0.2000, TRUE),
('EE', 'Estonia', 'EUR', '€', 0.2200, TRUE),
('EST', 'Estonia (Alt)', 'EUR', '€', 0.2200, TRUE),
('LT', 'Lithuania', 'EUR', '€', 0.2100, TRUE),
('LIT', 'Lithuania (Alt)', 'EUR', '€', 0.2100, TRUE),
('LV', 'Latvia', 'EUR', '€', 0.2100, TRUE),
('LAT', 'Latvia (Alt)', 'EUR', '€', 0.2100, TRUE),
('AM', 'Armenia', 'AMD', '֏', 0.2000, TRUE),
('ARM', 'Armenia (Alt)', 'AMD', '֏', 0.2000, TRUE),
('MD', 'Moldova', 'MDL', 'L', 0.2000, TRUE),
('RO', 'Romania', 'RON', 'lei', 0.1900, TRUE),
('TR', 'Turkey', 'TRY', '₺', 0.2000, TRUE),
('AZ', 'Azerbaijan', 'AZN', '₼', 0.1800, TRUE)
ON CONFLICT (code) DO NOTHING;

