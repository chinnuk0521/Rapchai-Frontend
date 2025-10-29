-- Rapchai Menu Data for Supabase
-- This script adds all Rapchai menu categories and items to Supabase

-- Insert Categories
INSERT INTO categories (id, name, slug, description, "createdAt", "updatedAt") VALUES
('cat_chais', 'Chais & Signature Coffees', 'chais-coffees', 'Traditional Assam chai and signature coffees brewed with our special filter', NOW(), NOW()),
('cat_burgers', 'Mini Burgers', 'mini-burgers', 'Perfect bite-sized sliders in veg and non-veg options', NOW(), NOW()),
('cat_sandwiches', 'Sandwiches', 'sandwiches', 'Delicious sandwiches on our 4-inch sub bread', NOW(), NOW()),
('cat_rolls', 'Rolls & Soups', 'rolls-soups', 'Juicy rolls and perfect soups for cold days', NOW(), NOW()),
('cat_specials', 'Our Specials', 'our-specials', 'Chef special creations that have become staples', NOW(), NOW()),
('cat_squares', 'Our Squares', 'our-squares', 'Homemade biscuits - spicy, buttery, and fruity', NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "updatedAt" = NOW();

-- Insert Menu Items
INSERT INTO menu_items (id, name, description, "pricePaise", "isVeg", "categoryId", "createdAt", "updatedAt") VALUES
-- Chais & Signature Coffees
('item_1', 'Traditional Assam Chai', 'Brewed from Assam leaves using our traditional filter for perfect decoction', 8000, true, 'cat_chais', NOW(), NOW()),
('item_2', 'Masala Chai', 'Spiced chai with aromatic spices', 9000, true, 'cat_chais', NOW(), NOW()),
('item_3', 'Ginger Chai', 'Warming ginger chai for cold days', 9000, true, 'cat_chais', NOW(), NOW()),
('item_4', 'Cardamom Chai', 'Fragrant cardamom-infused chai', 10000, true, 'cat_chais', NOW(), NOW()),
('item_5', 'Cold Chai', 'Refreshing iced chai perfect for warm days', 10000, true, 'cat_chais', NOW(), NOW()),
('item_6', 'Signature Coffee', 'Our special coffee blend brewed with traditional filter', 12000, true, 'cat_chais', NOW(), NOW()),
('item_7', 'Cappuccino', 'Rich espresso with steamed milk foam', 15000, true, 'cat_chais', NOW(), NOW()),
('item_8', 'Latte', 'Smooth coffee with steamed milk', 14000, true, 'cat_chais', NOW(), NOW()),
('item_9', 'Americano', 'Strong black coffee', 10000, true, 'cat_chais', NOW(), NOW()),
('item_10', 'Cold Coffee', 'Iced coffee with milk', 13000, true, 'cat_chais', NOW(), NOW()),

-- Mini Burgers
('item_11', 'Veg Mini Burger', 'Perfect bite-sized veg slider with fresh vegetables', 12000, true, 'cat_burgers', NOW(), NOW()),
('item_12', 'Chicken Mini Burger', 'Juicy chicken patty in a mini bun', 15000, false, 'cat_burgers', NOW(), NOW()),
('item_13', 'Beef Mini Burger', 'Tender beef patty slider', 18000, false, 'cat_burgers', NOW(), NOW()),
('item_14', 'Paneer Mini Burger', 'Cottage cheese patty with spices', 14000, true, 'cat_burgers', NOW(), NOW()),
('item_15', 'Fish Mini Burger', 'Crispy fish patty slider', 16000, false, 'cat_burgers', NOW(), NOW()),
('item_16', 'Mushroom Mini Burger', 'Grilled mushroom patty slider', 13000, true, 'cat_burgers', NOW(), NOW()),

-- Sandwiches
('item_17', 'Veg Sandwich', 'Fresh vegetables on our 4-inch sub bread', 10000, true, 'cat_sandwiches', NOW(), NOW()),
('item_18', 'Chicken Sandwich', 'Grilled chicken on 4-inch sub bread', 14000, false, 'cat_sandwiches', NOW(), NOW()),
('item_19', 'Beef Sandwich', 'Tender beef on 4-inch sub bread', 16000, false, 'cat_sandwiches', NOW(), NOW()),
('item_20', 'Paneer Sandwich', 'Cottage cheese with vegetables', 12000, true, 'cat_sandwiches', NOW(), NOW()),
('item_21', 'Egg Sandwich', 'Scrambled eggs with vegetables', 11000, false, 'cat_sandwiches', NOW(), NOW()),
('item_22', 'Grilled Cheese Sandwich', 'Melted cheese on toasted bread', 10000, true, 'cat_sandwiches', NOW(), NOW()),

-- Rolls & Soups
('item_23', 'Chicken Roll', 'Juicy chicken wrapped in soft bread', 12000, false, 'cat_rolls', NOW(), NOW()),
('item_24', 'Egg Roll', 'Scrambled eggs wrapped in soft bread', 10000, false, 'cat_rolls', NOW(), NOW()),
('item_25', 'Veg Roll', 'Fresh vegetables wrapped in soft bread', 9000, true, 'cat_rolls', NOW(), NOW()),
('item_26', 'Paneer Roll', 'Cottage cheese wrapped in soft bread', 11000, true, 'cat_rolls', NOW(), NOW()),
('item_27', 'Tomato Soup', 'Perfect soup for cold days', 8000, true, 'cat_rolls', NOW(), NOW()),
('item_28', 'Chicken Soup', 'Hearty chicken soup', 10000, false, 'cat_rolls', NOW(), NOW()),
('item_29', 'Vegetable Soup', 'Fresh vegetable soup', 8000, true, 'cat_rolls', NOW(), NOW()),
('item_30', 'Corn Soup', 'Sweet corn soup', 9000, true, 'cat_rolls', NOW(), NOW()),

-- Our Specials
('item_31', 'Chef Special Pasta', 'Our signature pasta creation', 18000, true, 'cat_specials', NOW(), NOW()),
('item_32', 'Special Chicken Curry', 'Chef special chicken curry', 20000, false, 'cat_specials', NOW(), NOW()),
('item_33', 'Rapchai Special Rice', 'Our unique rice preparation', 16000, true, 'cat_specials', NOW(), NOW()),
('item_34', 'Special Veggie Bowl', 'Healthy vegetable bowl', 15000, true, 'cat_specials', NOW(), NOW()),
('item_35', 'Chef Special Wrap', 'Our signature wrap creation', 14000, true, 'cat_specials', NOW(), NOW()),
('item_36', 'Special Fish Fry', 'Chef special fish preparation', 22000, false, 'cat_specials', NOW(), NOW()),

-- Our Squares
('item_37', 'Spicy Squares', 'Homemade spicy biscuits', 3000, true, 'cat_squares', NOW(), NOW()),
('item_38', 'Buttery Squares', 'Rich buttery homemade biscuits', 3000, true, 'cat_squares', NOW(), NOW()),
('item_39', 'Fruity Squares', 'Sweet fruity homemade biscuits', 3000, true, 'cat_squares', NOW(), NOW()),
('item_40', 'Chocolate Squares', 'Chocolate-flavored homemade biscuits', 3500, true, 'cat_squares', NOW(), NOW()),
('item_41', 'Mixed Squares', 'Assorted homemade biscuits', 4000, true, 'cat_squares', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "pricePaise" = EXCLUDED."pricePaise",
  "isVeg" = EXCLUDED."isVeg",
  "categoryId" = EXCLUDED."categoryId",
  "updatedAt" = NOW();
