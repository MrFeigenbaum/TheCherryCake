-- V8__update_purble_place_cake_catalog.sql: Align product names, descriptions, and categories with authentic Purble Place Comfy Cakes assets

UPDATE categories SET name = 'Signature Cakes', description = 'Handcrafted celebration and signature heart cakes' WHERE id = 1;
UPDATE categories SET name = 'Artisan Cakes', description = 'Delicate square and petite handcrafted cakes' WHERE id = 2;
UPDATE categories SET name = 'Classic Cakes', description = 'Classic round gateaux and celebration cakes' WHERE id = 3;

UPDATE products SET 
    name = 'Cherry Blossom Heart Gateau',
    description = 'Three delicate tiers of strawberry sponge layered with sweet vanilla cream, glossy pink coulis, and a ruby sugar heart',
    image_url = 'assets/purble_place/STRAWBERRYCREMECAKE_anim0_f00.png'
WHERE code = 'CHERRY_BLOSSOM';

UPDATE products SET 
    name = 'Triple Berry Gumdrop Heart',
    description = 'Three luscious tiers of strawberry sponge layered with sweet berry cream, vibrant pink coulis, and colorful gumdrop jewels',
    image_url = 'assets/purble_place/TRIPLEHEARTFLIP_anim0_f00.png'
WHERE code = 'BLACK_FOREST';

UPDATE products SET 
    name = 'Golden Vanilla Fudge Heart',
    description = 'Two tiers of golden vanilla heart sponge layered with rich chocolate fudge glaze and sweet gumdrop jewels',
    image_url = 'assets/purble_place/2LAYERHEARTCAKE_anim0_f00.png'
WHERE code = 'RED_VELVET';

UPDATE products SET 
    name = 'Smiley Berry Artisan Square',
    description = 'Rich chocolate sponge topped with vibrant raspberry icing and the iconic Comfy Cakes smiley face',
    image_url = 'assets/purble_place/ONELAYERRECTFLIP_anim0_f00.png'
WHERE code = 'CHERRY_DANISH';

UPDATE products SET 
    name = 'Sweetheart Chocolate Petite',
    description = 'Single-tier rich chocolate heart sponge drenched in dark fudge glaze with a ruby sugar heart',
    image_url = 'assets/purble_place/ONELAYERHEARTFLIP_anim0_f00.png'
WHERE code = 'BUTTER_CROISSANT';

UPDATE products SET 
    name = 'Lucky Clover Chocolate Gateau',
    description = 'Classic round chocolate sponge coated in velvety dark fudge glaze and crowned with a vibrant shamrock clover',
    image_url = 'assets/purble_place/ROUNDCAKEFLIP_anim0_f00.png'
WHERE code = 'CHERRY_LATTE';

UPDATE products SET 
    name = 'Grand Celebration Round Cake',
    description = 'Three grand tiers of strawberry and vanilla round cake layered with sweet cream and jewel-toned gumdrops',
    image_url = 'assets/purble_place/TRIPLEROUNDFLIP_anim0_f00.png'
WHERE code = 'ESPRESSO_SPECIALTY';

-- Update modifiers for Product 6 to match cake theme
UPDATE product_modifiers SET name = 'Extra Chocolate Fudge Drizzle' WHERE product_id = 6 AND name = 'Oat Milk Alternative';
UPDATE product_modifiers SET name = 'Artisan Gift Box Packaging' WHERE product_id = 6 AND name = 'Extra Espresso Shot';

