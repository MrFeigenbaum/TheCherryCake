-- CC-72: 6-month historical order seed across all 5 operating countries (UZB, KAZ, GEO, UKR, CHN).
-- All amounts are pre-computed in each region's local currency with HALF_UP rounding.

INSERT INTO orders (
    order_number, order_date, region_id, customer_name, phone, email,
    subtotal, vat_rate, vat_amount, amount_incl_vat,
    discount_rate, discount_amount, delivery_fee, total, currency_code, created_at
)
SELECT
    v.order_number,
    CAST(CURRENT_DATE - v.days_ago AS DATE),
    r.id,
    v.customer_name,
    v.phone,
    v.email,
    v.subtotal,
    r.vat_rate,
    v.vat_amount,
    v.amount_incl_vat,
    v.discount_rate,
    v.discount_amount,
    0.00,
    v.total,
    r.currency_code,
    CAST(CURRENT_DATE - v.days_ago AS TIMESTAMP)
FROM (VALUES
    -- Month -5 (~150 days ago)
    ('CC-2026-000001', 150, 'UZB', 'Dilnoza Karimova',  '+998901112233', 'dilnoza@example.uz',  720000.00, 108000.00, 828000.00, 0.0300, 24840.00, 803160.00),
    ('CC-2026-000002', 148, 'KAZ', 'Nurlan Serikov',    '+77012223344',  'nurlan@example.kz',    45360.00,   9072.00,  54432.00, 0.0300,  1632.96,  52799.04),
    ('CC-2026-000003', 146, 'GEO', 'Nino Beridze',      '+995599112233', 'nino@example.ge',         85.80,     10.30,     96.10, 0.0300,     2.88,     93.22),
    ('CC-2026-000004', 144, 'UKR', 'Olena Kovalenko',   '+380671112233', 'olena@example.ua',    2280.00,    182.40,   2462.40, 0.0300,    73.87,   2388.53),
    ('CC-2026-000005', 142, 'CHN', 'Li Wei',            '+8613800138001', 'liwei@example.cn',     966.00,    173.88,   1139.88, 0.0500,    56.99,   1082.89),

    -- Month -4 (~120 days ago)
    ('CC-2026-000006', 120, 'UZB', 'Azizbek Rakhimov',  '+998902223344', 'azizbek@example.uz', 1800000.00, 270000.00, 2070000.00, 0.0500, 103500.00, 1966500.00),
    ('CC-2026-000007', 118, 'KAZ', 'Aigerim Toleuova',  '+77023334455',  'aigerim@example.kz',   45360.00,   9072.00,   54432.00, 0.0300,   1632.96,   52799.04),
    ('CC-2026-000008', 116, 'GEO', 'Giorgi Maisuradze', '+995591223344', 'giorgi@example.ge',      171.60,     20.59,     192.19, 0.0300,      5.77,     186.42),
    ('CC-2026-000009', 114, 'UKR', 'Taras Shevchenko',  '+380502223344', 'taras@example.ua',     2280.00,    182.40,    2462.40, 0.0300,     73.87,    2388.53),
    ('CC-2026-000010', 112, 'CHN', 'Zhang Min',         '+8613900139002', 'zhang@example.cn',     966.00,    173.88,    1139.88, 0.0500,     56.99,    1082.89),

    -- Month -3 (~90 days ago)
    ('CC-2026-000011',  90, 'UZB', 'Madina Usmanova',   '+998903334455', 'madina@example.uz',   720000.00, 108000.00,  828000.00, 0.0300,  24840.00,  803160.00),
    ('CC-2026-000012',  88, 'KAZ', 'Timur Akhmetov',    '+77054445566',  'timur@example.kz',     90720.00,  18144.00,  108864.00, 0.0700,   7620.48,  101243.52),
    ('CC-2026-000013',  86, 'GEO', 'Tamara Kapanadze',  '+995595334455', 'tamara@example.ge',       85.80,     10.30,      96.10, 0.0300,      2.88,      93.22),
    ('CC-2026-000014',  84, 'UKR', 'Iryna Melnyk',      '+380933334455', 'iryna@example.ua',     4560.00,    364.80,    4924.80, 0.0300,    147.74,    4777.06),
    ('CC-2026-000015',  82, 'CHN', 'Wang Fang',         '+8613700137003', 'wang@example.cn',      966.00,    173.88,    1139.88, 0.0500,     56.99,    1082.89),

    -- Month -2 (~60 days ago)
    ('CC-2026-000016',  60, 'UZB', 'Sardor Alimov',     '+998904445566', 'sardor@example.uz',  1800000.00, 270000.00, 2070000.00, 0.0500, 103500.00, 1966500.00),
    ('CC-2026-000017',  58, 'KAZ', 'Dana Omarova',      '+77075556677',  'dana@example.kz',      45360.00,   9072.00,   54432.00, 0.0300,   1632.96,   52799.04),
    ('CC-2026-000018',  56, 'GEO', 'Levan Gelashvili',  '+995597445566', 'levan@example.ge',       171.60,     20.59,     192.19, 0.0300,      5.77,     186.42),
    ('CC-2026-000019',  54, 'UKR', 'Dmytro Bondar',     '+380664445566', 'dmytro@example.ua',    2280.00,    182.40,    2462.40, 0.0300,     73.87,    2388.53),
    ('CC-2026-000020',  52, 'CHN', 'Chen Hao',          '+8613600136004', 'chen@example.cn',     1932.00,    347.76,    2279.76, 0.1000,    227.98,    2051.78),

    -- Month -1 (~30 days ago)
    ('CC-2026-000021',  30, 'UZB', 'Malika Tursunova',  '+998905556677', 'malika@example.uz',   720000.00, 108000.00,  828000.00, 0.0300,  24840.00,  803160.00),
    ('CC-2026-000022',  28, 'KAZ', 'Arman Bekov',       '+77086667788',  'arman@example.kz',     90720.00,  18144.00,  108864.00, 0.0700,   7620.48,  101243.52),
    ('CC-2026-000023',  26, 'GEO', 'Ana Lomidze',       '+995598556677', 'ana@example.ge',          85.80,     10.30,      96.10, 0.0300,      2.88,      93.22),
    ('CC-2026-000024',  24, 'UKR', 'Kateryna Savchenko','+380955556677', 'kateryna@example.ua',  4560.00,    364.80,    4924.80, 0.0300,    147.74,    4777.06),
    ('CC-2026-000025',  22, 'CHN', 'Liu Yang',          '+8613500135005', 'liu@example.cn',       966.00,    173.88,    1139.88, 0.0500,     56.99,    1082.89),

    -- Current month (last few days)
    ('CC-2026-000026',   5, 'UZB', 'Jasur Mirzayev',    '+998906667788', 'jasur@example.uz',   1800000.00, 270000.00, 2070000.00, 0.0500, 103500.00, 1966500.00),
    ('CC-2026-000027',   4, 'KAZ', 'Zarina Kassymova',  '+77777778899',  'zarina@example.kz',    45360.00,   9072.00,   54432.00, 0.0300,   1632.96,   52799.04),
    ('CC-2026-000028',   3, 'GEO', 'Davit Chikovani',   '+995593667788', 'davit@example.ge',       171.60,     20.59,     192.19, 0.0300,      5.77,     186.42),
    ('CC-2026-000029',   2, 'UKR', 'Maksym Tkachenko',  '+380976667788', 'maksym@example.ua',    2280.00,    182.40,    2462.40, 0.0300,     73.87,    2388.53),
    ('CC-2026-000030',   1, 'CHN', 'Zhou Jie',          '+8613400134006', 'zhou@example.cn',     1932.00,    347.76,    2279.76, 0.1000,    227.98,    2051.78)
) AS v (
    order_number, days_ago, region_code, customer_name, phone, email,
    subtotal, vat_amount, amount_incl_vat, discount_rate, discount_amount, total
)
JOIN regions r ON r.code = v.region_code;

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, modifiers_price, modifiers_json, line_total)
SELECT
    o.id,
    p.id,
    p.name,
    CASE WHEN o.subtotal > 0 AND rp.price > 0 THEN GREATEST(1, CAST(ROUND(o.subtotal / (rp.price * r.exchange_rate), 0) AS INTEGER)) ELSE 1 END,
    ROUND(rp.price * r.exchange_rate, 2),
    0.00,
    '[]',
    o.subtotal
FROM orders o
JOIN regions r ON r.id = o.region_id
JOIN products p ON p.name = 'Cherry Cake'
JOIN regional_prices rp ON rp.product_id = p.id AND rp.region_id = r.id
WHERE o.order_number LIKE 'CC-2026-0000%';
