-- CC-37: Additional regions seed data (rates, VAT, product regional prices, modifier regional prices).

INSERT INTO regions (code, name, currency_code, currency_symbol, vat_rate, exchange_rate) VALUES
    ('ARM', 'Armenia',    'AMD', '֏',   0.2000, 100.0000),
    ('AZE', 'Azerbaijan', 'AZN', '₼',   0.1800,   0.4250),
    ('TUR', 'Turkey',     'TRY', '₺',   0.1800,   8.5000),
    ('MDA', 'Moldova',    'MDL', 'L',   0.2000,   4.5000),
    ('ROU', 'Romania',    'RON', 'lei', 0.1900,   1.1500),
    ('EST', 'Estonia',    'EUR', '€',   0.2200,   0.2300),
    ('LVA', 'Latvia',     'EUR', '€',   0.2100,   0.2300),
    ('LTU', 'Lithuania',  'EUR', '€',   0.2100,   0.2300),
    ('FIN', 'Finland',    'EUR', '€',   0.2400,   0.2300),
    ('SWE', 'Sweden',     'SEK', 'kr',  0.2500,   2.6000),
    ('BLR', 'Belarus',    'BYN', 'Br',  0.2000,   0.8200),
    ('RUS', 'Russia',     'RUB', '₽',   0.2000,  24.0000);

-- Populate regional prices for all products in the new regions based on standard conventional units (from UZB prices)
INSERT INTO regional_prices (product_id, region_id, price, in_stock)
SELECT p.id, r.id, rp.price, TRUE
FROM products p
JOIN regional_prices rp ON rp.product_id = p.id AND rp.region_id = (SELECT id FROM regions WHERE code = 'UZB')
CROSS JOIN regions r
WHERE r.code IN ('ARM', 'AZE', 'TUR', 'MDA', 'ROU', 'EST', 'LVA', 'LTU', 'FIN', 'SWE', 'BLR', 'RUS');

-- Populate modifier regional prices for the new regions (using standard deltas from UZB)
INSERT INTO modifier_regional_prices (modifier_id, region_id, price_delta)
SELECT mrp.modifier_id, r.id, mrp.price_delta
FROM modifier_regional_prices mrp
CROSS JOIN regions r
WHERE mrp.region_id = (SELECT id FROM regions WHERE code = 'UZB')
  AND r.code IN ('ARM', 'AZE', 'TUR', 'MDA', 'ROU', 'EST', 'LVA', 'LTU', 'FIN', 'SWE', 'BLR', 'RUS');
