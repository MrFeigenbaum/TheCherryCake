-- V3__seed.sql: Catalog Seed Data (CC-7)
-- 3 Categories, 12 Products, Modifiers, Regional Prices for all regions, Discounts & Promo Codes

-- 1. Categories (Cakes, Pastries, Desserts, Beverages)
INSERT INTO categories (id, name, code, description, sort_order, display_order) VALUES
(1, 'Торты', 'CAKES', 'Фирменные торты и десерты Comfy Cakes', 1, 1),
(2, 'Выпечка', 'PASTRIES', 'Свежая выпечка и французские круассаны', 2, 2),
(3, 'Десерты', 'DESSERTS', 'Нежные макароны, эклеры и муссы', 3, 3),
(4, 'Напитки', 'BEVERAGES', 'Авторский кофе, чай и вишнёвые напитки', 4, 4)
ON CONFLICT (id) DO NOTHING;

-- 2. Products (12 items)
INSERT INTO products (id, category_id, code, name, description, image_url, is_active, is_available) VALUES
(1, 1, 'CHERRY_BLOSSOM', 'Торт «Вишнёвый Сад» (Signature)', 'Фирменный трёхъярусный торт с сочной спелой вишней, взбитым сливочным кремом и бельгийским шоколадным бисквитом.', '/assets/01_Comfy_Cakes/Cakes/CherryBlossom.png', TRUE, TRUE),
(2, 1, 'BLACK_FOREST', 'Торт «Шварцвальд» (Black Forest)', 'Классический вишнёвый торт с шоколадным бисквитом, киршем и взбитыми сливками.', '/assets/01_Comfy_Cakes/Cakes/BlackForest.png', TRUE, TRUE),
(3, 1, 'RED_VELVET', 'Торт «Красный Бархат» (Red Velvet)', 'Бархатистый бисквит с нежным крем-чизом и нотками натуральной ванили.', '/assets/01_Comfy_Cakes/Cakes/RedVelvet.png', TRUE, TRUE),
(4, 1, 'BURNT_CARAMEL_CAKE', 'Торт «Жжёная Карамель» (Burnt Caramel)', 'Насыщенный карамельный бисквит с лёгкой соленой карамелью и кремом пралине.', '/assets/01_Comfy_Cakes/Cakes/BurntCaramel.png', TRUE, TRUE),
(5, 2, 'CHERRY_DANISH', 'Вишнёвый Даниш (Cherry Danish)', 'Хрустящее слоёное тесто с тёплой вишнёвой начинкой и миндальными лепестками.', '/assets/01_Comfy_Cakes/Cakes/CherryDanish.png', TRUE, TRUE),
(6, 2, 'BUTTER_CROISSANT', 'Французский Масляный Круассан', 'Воздушный золотистый круассан на натуральном сливочном масле из Нормандии.', '/assets/01_Comfy_Cakes/Cakes/Croissant.png', TRUE, TRUE),
(7, 2, 'PAIN_AU_CHOCOLAT', 'Шоколадный Круассан (Pain au Chocolat)', 'Слоёная булочка с двумя брусками тёмного шоколада Valrhona.', '/assets/01_Comfy_Cakes/Cakes/PainAuChocolat.png', TRUE, TRUE),
(8, 3, 'SAKURA_MACARON', 'Макарон «Сакура» (Box of 4)', 'Французские макароны с нежным вишнёвым ганашем и нотками цветущей сакуры.', '/assets/01_Comfy_Cakes/Cakes/MacaronSakura.png', TRUE, TRUE),
(9, 3, 'BERRY_CHEESECAKE', 'Чизкейк «Лесные Ягоды»', 'Нью-йоркский запечённый чизкейк со свежим ягодным кули из дикой вишни и малины.', '/assets/01_Comfy_Cakes/Cakes/BerryCheesecake.png', TRUE, TRUE),
(10, 3, 'CHERRY_TARTLET', 'Тарталетка с Вишней и Фисташкой', 'Песочная корзинка с фисташковым франжипаном и глазированной вишней.', '/assets/01_Comfy_Cakes/Cakes/Tartlet.png', TRUE, TRUE),
(11, 4, 'CHERRY_LATTE', 'Вишнёвый Латте (Cherry Blossom Latte)', 'Эспрессо из 100% арабики со вспененным молоком и сиропом из дикой вишни.', '/assets/01_Comfy_Cakes/Cakes/CherryLatte.png', TRUE, TRUE),
(12, 4, 'ESPRESSO_SPECIALTY', 'Эспрессо Спешелти (Double Shot)', 'Классический двойной эспрессо с бархатистой крема и фруктово-шоколадным профилем.', '/assets/01_Comfy_Cakes/Cakes/Espresso.png', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Regional Prices across all operating regions
INSERT INTO regional_prices (product_id, region_id, price, is_available)
SELECT p.id, r.id,
    CASE
        WHEN r.currency_code = 'UZS' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 220000.00
                WHEN 'BLACK_FOREST' THEN 195000.00
                WHEN 'RED_VELVET' THEN 205000.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 185000.00
                WHEN 'CHERRY_DANISH' THEN 38000.00
                WHEN 'BUTTER_CROISSANT' THEN 28000.00
                WHEN 'PAIN_AU_CHOCOLAT' THEN 32000.00
                WHEN 'SAKURA_MACARON' THEN 65000.00
                WHEN 'BERRY_CHEESECAKE' THEN 55000.00
                WHEN 'CHERRY_TARTLET' THEN 42000.00
                WHEN 'CHERRY_LATTE' THEN 36000.00
                WHEN 'ESPRESSO_SPECIALTY' THEN 24000.00
                ELSE 30000.00
            END
        WHEN r.currency_code = 'KZT' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 9500.00
                WHEN 'BLACK_FOREST' THEN 8500.00
                WHEN 'RED_VELVET' THEN 8900.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 8000.00
                WHEN 'CHERRY_DANISH' THEN 1650.00
                WHEN 'BUTTER_CROISSANT' THEN 1200.00
                WHEN 'PAIN_AU_CHOCOLAT' THEN 1400.00
                WHEN 'SAKURA_MACARON' THEN 2800.00
                WHEN 'BERRY_CHEESECAKE' THEN 2400.00
                WHEN 'CHERRY_TARTLET' THEN 1800.00
                WHEN 'CHERRY_LATTE' THEN 1550.00
                WHEN 'ESPRESSO_SPECIALTY' THEN 1050.00
                ELSE 1500.00
            END
        WHEN r.currency_code = 'GEL' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 55.00
                WHEN 'BLACK_FOREST' THEN 48.00
                WHEN 'RED_VELVET' THEN 50.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 45.00
                WHEN 'CHERRY_DANISH' THEN 9.50
                WHEN 'BUTTER_CROISSANT' THEN 6.80
                WHEN 'PAIN_AU_CHOCOLAT' THEN 7.50
                WHEN 'SAKURA_MACARON' THEN 16.00
                WHEN 'BERRY_CHEESECAKE' THEN 14.00
                WHEN 'CHERRY_TARTLET' THEN 10.50
                WHEN 'CHERRY_LATTE' THEN 9.00
                WHEN 'ESPRESSO_SPECIALTY' THEN 6.00
                ELSE 8.00
            END
        WHEN r.currency_code = 'UAH' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 720.00
                WHEN 'BLACK_FOREST' THEN 640.00
                WHEN 'RED_VELVET' THEN 670.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 610.00
                WHEN 'CHERRY_DANISH' THEN 125.00
                WHEN 'BUTTER_CROISSANT' THEN 90.00
                WHEN 'PAIN_AU_CHOCOLAT' THEN 105.00
                WHEN 'SAKURA_MACARON' THEN 210.00
                WHEN 'BERRY_CHEESECAKE' THEN 180.00
                WHEN 'CHERRY_TARTLET' THEN 135.00
                WHEN 'CHERRY_LATTE' THEN 120.00
                WHEN 'ESPRESSO_SPECIALTY' THEN 80.00
                ELSE 100.00
            END
        WHEN r.currency_code = 'CNY' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 125.00
                WHEN 'BLACK_FOREST' THEN 110.00
                WHEN 'RED_VELVET' THEN 115.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 105.00
                WHEN 'CHERRY_DANISH' THEN 22.00
                WHEN 'BUTTER_CROISSANT' THEN 16.00
                WHEN 'PAIN_AU_CHOCOLAT' THEN 18.00
                WHEN 'SAKURA_MACARON' THEN 36.00
                WHEN 'BERRY_CHEESECAKE' THEN 32.00
                WHEN 'CHERRY_TARTLET' THEN 24.00
                WHEN 'CHERRY_LATTE' THEN 20.00
                WHEN 'ESPRESSO_SPECIALTY' THEN 14.00
                ELSE 18.00
            END
        WHEN r.currency_code = 'EUR' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 18.50
                WHEN 'BLACK_FOREST' THEN 16.50
                WHEN 'RED_VELVET' THEN 17.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 15.50
                WHEN 'CHERRY_DANISH' THEN 3.80
                WHEN 'BUTTER_CROISSANT' THEN 2.60
                WHEN 'PAIN_AU_CHOCOLAT' THEN 3.00
                WHEN 'SAKURA_MACARON' THEN 5.80
                WHEN 'BERRY_CHEESECAKE' THEN 4.80
                WHEN 'CHERRY_TARTLET' THEN 3.90
                WHEN 'CHERRY_LATTE' THEN 3.60
                WHEN 'ESPRESSO_SPECIALTY' THEN 2.40
                ELSE 3.00
            END
        WHEN r.currency_code = 'SEK' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 195.00
                WHEN 'BLACK_FOREST' THEN 175.00
                WHEN 'RED_VELVET' THEN 180.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 165.00
                WHEN 'CHERRY_DANISH' THEN 40.00
                WHEN 'BUTTER_CROISSANT' THEN 28.00
                WHEN 'PAIN_AU_CHOCOLAT' THEN 32.00
                WHEN 'SAKURA_MACARON' THEN 62.00
                WHEN 'BERRY_CHEESECAKE' THEN 52.00
                WHEN 'CHERRY_TARTLET' THEN 42.00
                WHEN 'CHERRY_LATTE' THEN 38.00
                WHEN 'ESPRESSO_SPECIALTY' THEN 26.00
                ELSE 30.00
            END
        WHEN r.currency_code = 'BYN' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 55.00
                WHEN 'BLACK_FOREST' THEN 49.00
                WHEN 'RED_VELVET' THEN 51.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 46.00
                WHEN 'CHERRY_DANISH' THEN 10.00
                WHEN 'BUTTER_CROISSANT' THEN 7.20
                WHEN 'PAIN_AU_CHOCOLAT' THEN 8.20
                WHEN 'SAKURA_MACARON' THEN 16.50
                WHEN 'BERRY_CHEESECAKE' THEN 14.00
                WHEN 'CHERRY_TARTLET' THEN 11.00
                WHEN 'CHERRY_LATTE' THEN 9.50
                WHEN 'ESPRESSO_SPECIALTY' THEN 6.50
                ELSE 8.00
            END
        WHEN r.currency_code = 'AMD' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 6800.00
                WHEN 'BLACK_FOREST' THEN 6100.00
                WHEN 'RED_VELVET' THEN 6400.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 5800.00
                WHEN 'CHERRY_DANISH' THEN 1300.00
                WHEN 'BUTTER_CROISSANT' THEN 950.00
                WHEN 'PAIN_AU_CHOCOLAT' THEN 1100.00
                WHEN 'SAKURA_MACARON' THEN 2200.00
                WHEN 'BERRY_CHEESECAKE' THEN 1900.00
                WHEN 'CHERRY_TARTLET' THEN 1450.00
                WHEN 'CHERRY_LATTE' THEN 1300.00
                WHEN 'ESPRESSO_SPECIALTY' THEN 850.00
                ELSE 1000.00
            END
        WHEN r.currency_code = 'RUB' THEN
            CASE p.code
                WHEN 'CHERRY_BLOSSOM' THEN 1500.00
                WHEN 'BLACK_FOREST' THEN 1350.00
                WHEN 'RED_VELVET' THEN 1420.00
                WHEN 'BURNT_CARAMEL_CAKE' THEN 1280.00
                WHEN 'CHERRY_DANISH' THEN 260.00
                WHEN 'BUTTER_CROISSANT' THEN 190.00
                WHEN 'PAIN_AU_CHOCOLAT' THEN 220.00
                WHEN 'SAKURA_MACARON' THEN 450.00
                WHEN 'BERRY_CHEESECAKE' THEN 380.00
                WHEN 'CHERRY_TARTLET' THEN 290.00
                WHEN 'CHERRY_LATTE' THEN 320.00
                WHEN 'ESPRESSO_SPECIALTY' THEN 210.00
                ELSE 200.00
            END
        ELSE 20.00
    END AS price,
    TRUE AS is_available
FROM products p
CROSS JOIN regions r
ON CONFLICT (product_id, region_id) DO NOTHING;

-- Backward compatibility table: product_prices
INSERT INTO product_prices (product_id, region_id, price, is_available)
SELECT product_id, region_id, price, is_available FROM regional_prices
ON CONFLICT (product_id, region_id) DO NOTHING;

-- 4. Modifier Groups and Modifiers
INSERT INTO modifier_groups (id, product_id, name, type, is_required, sort_order) VALUES
(1, 1, 'Размер торта', 'SINGLE', TRUE, 1),
(2, 1, 'Дополнения', 'MULTI', FALSE, 2),
(3, 11, 'Молоко', 'SINGLE', FALSE, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO modifiers (id, group_id, name, sort_order) VALUES
(1, 1, 'Стандартный (1 кг)', 1),
(2, 1, 'Большой (2 кг)', 2),
(3, 2, 'Экстра вишня', 1),
(4, 2, 'Праздничная свеча', 2),
(5, 3, 'Овсяное молоко', 1),
(6, 3, 'Миндальное молоко', 2)
ON CONFLICT (id) DO NOTHING;

-- Modifier Regional Prices
INSERT INTO modifier_regional_prices (modifier_id, region_id, price_delta)
SELECT m.id, r.id,
    CASE
        WHEN m.id = 2 THEN -- Big size
            CASE WHEN r.currency_code = 'UZS' THEN 90000.00 WHEN r.currency_code = 'KZT' THEN 4000.00 ELSE 8.00 END
        WHEN m.id = 3 THEN -- Extra cherry
            CASE WHEN r.currency_code = 'UZS' THEN 25000.00 WHEN r.currency_code = 'KZT' THEN 1100.00 ELSE 2.50 END
        WHEN m.id = 4 THEN -- Candle
            CASE WHEN r.currency_code = 'UZS' THEN 10000.00 WHEN r.currency_code = 'KZT' THEN 450.00 ELSE 1.00 END
        WHEN m.id IN (5, 6) THEN -- Plant milk
            CASE WHEN r.currency_code = 'UZS' THEN 8000.00 WHEN r.currency_code = 'KZT' THEN 350.00 ELSE 0.80 END
        ELSE 0.00
    END AS price_delta
FROM modifiers m
CROSS JOIN regions r
ON CONFLICT (modifier_id, region_id) DO NOTHING;

-- Backward compatibility table: product_modifiers
INSERT INTO product_modifiers (id, product_id, name, price_delta, is_default, group_name, group_type, is_required) VALUES
(1, 1, 'Стандартный (1 кг)', 0.00, TRUE, 'Размер торта', 'SINGLE', TRUE),
(2, 1, 'Большой (2 кг)', 90000.00, FALSE, 'Размер торта', 'SINGLE', TRUE),
(3, 1, 'Экстра вишня', 25000.00, FALSE, 'Дополнения', 'MULTI', FALSE),
(4, 1, 'Праздничная свеча', 10000.00, FALSE, 'Дополнения', 'MULTI', FALSE),
(5, 11, 'Овсяное молоко', 8000.00, FALSE, 'Молоко', 'SINGLE', FALSE),
(6, 11, 'Миндальное молоко', 8000.00, FALSE, 'Молоко', 'SINGLE', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 5. Discounts & Promo Codes
INSERT INTO discount_rules (id, region_id, threshold_amount, discount_rate) VALUES
(1, NULL, 500000.00, 0.0500),  -- 5% above 500k in UZS
(2, NULL, 1000000.00, 0.1000)  -- 10% above 1M in UZS
ON CONFLICT (id) DO NOTHING;

INSERT INTO promo_codes (id, code, discount_rate, valid_from, valid_to, is_active) VALUES
(1, 'CHERRY2026', 0.1000, '2026-01-01', '2026-12-31', TRUE),
(2, 'WELCOME', 0.0500, '2026-01-01', '2026-12-31', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO discounts (id, code, name, discount_type, min_subtotal, percentage, fixed_amount, is_active) VALUES
(1, 'CHERRY2026', 'Промокод CHERRY2026', 'PROMO_CODE', 0.00, 10.00, 0.00, TRUE),
(2, 'WELCOME', 'Промокод WELCOME', 'PROMO_CODE', 0.00, 5.00, 0.00, TRUE),
(3, NULL, 'Скидка от 500 000 UZS', 'THRESHOLD', 500000.00, 5.00, 0.00, TRUE),
(4, NULL, 'Скидка от 1 000 000 UZS', 'THRESHOLD', 1000000.00, 10.00, 0.00, TRUE)
ON CONFLICT (id) DO NOTHING;
