-- Sample data for testing the Nushka e-commerce system
-- This script populates the database with sample products and test data

-- Insert sample products
INSERT INTO products (id, name, description, price, compare_at_price, sku, category, subcategory, tags, images, stock_quantity, weight, dimensions, seo_title, seo_description) VALUES
(
  uuid_generate_v4(),
  'Organic Cotton T-Shirt',
  'Comfortable and sustainable organic cotton t-shirt perfect for everyday wear. Made from 100% certified organic cotton.',
  899.00,
  1299.00,
  'NUSHKA-TEE-001',
  'Clothing',
  'T-Shirts',
  ARRAY['organic', 'cotton', 'sustainable', 'casual'],
  ARRAY['/placeholder.svg?height=400&width=400'],
  50,
  0.15,
  '{"length": 70, "width": 50, "height": 2}',
  'Organic Cotton T-Shirt - Sustainable Fashion | Nushka',
  'Shop our comfortable organic cotton t-shirt. Eco-friendly, sustainable fashion for conscious consumers.'
),
(
  uuid_generate_v4(),
  'Handwoven Silk Scarf',
  'Luxurious handwoven silk scarf with traditional Indian patterns. Perfect accessory for any outfit.',
  2499.00,
  3499.00,
  'NUSHKA-SCARF-001',
  'Accessories',
  'Scarves',
  ARRAY['silk', 'handwoven', 'traditional', 'luxury'],
  ARRAY['/placeholder.svg?height=400&width=400'],
  25,
  0.05,
  '{"length": 180, "width": 70, "height": 1}',
  'Handwoven Silk Scarf - Traditional Indian Patterns | Nushka',
  'Discover our collection of handwoven silk scarves featuring traditional Indian patterns and designs.'
),
(
  uuid_generate_v4(),
  'Bamboo Fiber Yoga Mat',
  'Eco-friendly yoga mat made from sustainable bamboo fiber. Non-slip surface with excellent grip.',
  1899.00,
  2499.00,
  'NUSHKA-YOGA-001',
  'Fitness',
  'Yoga',
  ARRAY['bamboo', 'eco-friendly', 'yoga', 'fitness'],
  ARRAY['/placeholder.svg?height=400&width=400'],
  30,
  1.2,
  '{"length": 183, "width": 61, "height": 6}',
  'Bamboo Fiber Yoga Mat - Eco-Friendly Fitness | Nushka',
  'Practice yoga sustainably with our bamboo fiber yoga mat. Non-slip, durable, and environmentally friendly.'
),
(
  uuid_generate_v4(),
  'Artisan Ceramic Mug Set',
  'Beautiful set of 4 handcrafted ceramic mugs. Each piece is unique with subtle variations in glaze.',
  1599.00,
  2199.00,
  'NUSHKA-MUG-SET-001',
  'Home & Kitchen',
  'Drinkware',
  ARRAY['ceramic', 'handcrafted', 'artisan', 'set'],
  ARRAY['/placeholder.svg?height=400&width=400'],
  20,
  0.8,
  '{"length": 20, "width": 15, "height": 25}',
  'Artisan Ceramic Mug Set - Handcrafted Drinkware | Nushka',
  'Enjoy your beverages in style with our handcrafted ceramic mug set. Perfect for gifts or personal use.'
),
(
  uuid_generate_v4(),
  'Organic Skincare Gift Box',
  'Curated gift box containing organic skincare essentials: face wash, moisturizer, and serum.',
  3299.00,
  4499.00,
  'NUSHKA-SKINCARE-BOX-001',
  'Beauty & Personal Care',
  'Skincare',
  ARRAY['organic', 'skincare', 'gift', 'natural'],
  ARRAY['/placeholder.svg?height=400&width=400'],
  15,
  0.5,
  '{"length": 25, "width": 20, "height": 8}',
  'Organic Skincare Gift Box - Natural Beauty Products | Nushka',
  'Pamper yourself or someone special with our organic skincare gift box featuring natural ingredients.'
);

-- Insert product variants for the t-shirt
INSERT INTO product_variants (id, product_id, name, sku, price, stock_quantity, variant_options, images) 
SELECT 
  uuid_generate_v4(),
  p.id,
  'Small - White',
  'NUSHKA-TEE-001-S-WHITE',
  899.00,
  15,
  '{"size": "S", "color": "White"}',
  ARRAY['/placeholder.svg?height=400&width=400']
FROM products p WHERE p.sku = 'NUSHKA-TEE-001';

INSERT INTO product_variants (id, product_id, name, sku, price, stock_quantity, variant_options, images) 
SELECT 
  uuid_generate_v4(),
  p.id,
  'Medium - White',
  'NUSHKA-TEE-001-M-WHITE',
  899.00,
  20,
  '{"size": "M", "color": "White"}',
  ARRAY['/placeholder.svg?height=400&width=400']
FROM products p WHERE p.sku = 'NUSHKA-TEE-001';

INSERT INTO product_variants (id, product_id, name, sku, price, stock_quantity, variant_options, images) 
SELECT 
  uuid_generate_v4(),
  p.id,
  'Large - Black',
  'NUSHKA-TEE-001-L-BLACK',
  899.00,
  15,
  '{"size": "L", "color": "Black"}',
  ARRAY['/placeholder.svg?height=400&width=400']
FROM products p WHERE p.sku = 'NUSHKA-TEE-001';

-- Insert sample coupons
INSERT INTO coupons (id, code, name, description, type, value, minimum_amount, maximum_discount, usage_limit, is_active, starts_at, expires_at) VALUES
(
  uuid_generate_v4(),
  'WELCOME10',
  'Welcome Discount',
  'Get 10% off on your first order',
  'percentage',
  10.00,
  500.00,
  500.00,
  100,
  true,
  NOW(),
  NOW() + INTERVAL '30 days'
),
(
  uuid_generate_v4(),
  'SAVE500',
  'Flat ₹500 Off',
  'Get flat ₹500 off on orders above ₹2000',
  'fixed_amount',
  500.00,
  2000.00,
  500.00,
  50,
  true,
  NOW(),
  NOW() + INTERVAL '15 days'
),
(
  uuid_generate_v4(),
  'FREESHIP',
  'Free Shipping',
  'Free shipping on all orders (₹99 discount)',
  'fixed_amount',
  99.00,
  0.00,
  99.00,
  200,
  true,
  NOW(),
  NOW() + INTERVAL '60 days'
);

-- Create some sample reviews (these would normally be created by authenticated users)
-- Note: In a real implementation, these would reference actual user IDs from auth.users
INSERT INTO product_reviews (id, product_id, rating, title, comment, is_verified, is_approved) 
SELECT 
  uuid_generate_v4(),
  p.id,
  5,
  'Amazing quality!',
  'This organic cotton t-shirt is incredibly soft and comfortable. The fit is perfect and the quality is outstanding. Highly recommended!',
  true,
  true
FROM products p WHERE p.sku = 'NUSHKA-TEE-001';

INSERT INTO product_reviews (id, product_id, rating, title, comment, is_verified, is_approved) 
SELECT 
  uuid_generate_v4(),
  p.id,
  4,
  'Beautiful scarf',
  'The silk scarf is gorgeous with intricate patterns. The quality is excellent and it adds elegance to any outfit.',
  true,
  true
FROM products p WHERE p.sku = 'NUSHKA-SCARF-001';

INSERT INTO product_reviews (id, product_id, rating, title, comment, is_verified, is_approved) 
SELECT 
  uuid_generate_v4(),
  p.id,
  5,
  'Perfect for yoga practice',
  'This bamboo yoga mat provides excellent grip and cushioning. Love that it''s eco-friendly too!',
  true,
  true
FROM products p WHERE p.sku = 'NUSHKA-YOGA-001';

-- Update product stock quantities and ratings based on reviews
UPDATE products SET 
  stock_quantity = 45,
  updated_at = NOW()
WHERE sku = 'NUSHKA-TEE-001';

UPDATE products SET 
  stock_quantity = 23,
  updated_at = NOW()
WHERE sku = 'NUSHKA-SCARF-001';

UPDATE products SET 
  stock_quantity = 28,
  updated_at = NOW()
WHERE sku = 'NUSHKA-YOGA-001';

-- Add some sample order status history entries
-- These would be created automatically when orders are updated in a real system
INSERT INTO order_status_history (id, order_id, status, notes) 
SELECT 
  uuid_generate_v4(),
  o.id,
  'confirmed',
  'Order confirmed and payment received'
FROM orders o 
WHERE o.status = 'confirmed'
LIMIT 5;

INSERT INTO order_status_history (id, order_id, status, notes) 
SELECT 
  uuid_generate_v4(),
  o.id,
  'processing',
  'Order is being prepared for shipment'
FROM orders o 
WHERE o.status = 'processing'
LIMIT 3;
