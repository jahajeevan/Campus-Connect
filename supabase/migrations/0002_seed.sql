-- ============================================================================
--  Campus Connect — demo seed data (canteens, categories, food items)
--  Staff accounts are provisioned via Supabase Auth — see README.
-- ============================================================================

insert into public.canteens (id, slug, name, tagline, location, opens_at, closes_at, is_open, accent) values
  ('10000000-0000-0000-0000-000000000001', 'central-canteen',    'Central Canteen',    'The heart of campus dining — full meals all day.',          'Academic Block · Ground Floor',   '07:30', '21:00', true,  'maroon'),
  ('10000000-0000-0000-0000-000000000002', 'adithya-food-court',  'Adithya Food Court', 'Quick bites, chaats and cold brews between classes.',       'Near Adithya Hostel · Food Street', '08:00', '22:30', true,  'gold'),
  ('10000000-0000-0000-0000-000000000003', 'nila-night-canteen',  'Nila Night Canteen', 'Late-night Maggi, chai and comfort food for hostellers.',   'Nila Hostel Block · Courtyard',   '17:00', '01:30', false, 'green');

insert into public.categories (id, canteen_id, name, sort_order) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Breakfast',      0),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'South Indian',   1),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Lunch Meals',    2),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Beverages',      3),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Desserts',       4),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'Snacks',         0),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'Chaat Corner',   1),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'Rolls & Wraps',  2),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002', 'Cold Brews',     3),
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', 'Maggi & Noodles',0),
  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000003', 'Late-night Bites',1),
  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000003', 'Hot Beverages',  2);

insert into public.food_items (canteen_id, category_id, name, description, price, availability, dietary, sort_order) values
  -- Central · Breakfast
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Masala Dosa','Crisp dosa with spiced potato masala & chutney',55,'available','veg',0),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Idli Vada Combo','Two idlis, one medu vada, sambar & chutney',45,'available','veg',1),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Poha','Flattened rice with peanuts & curry leaves',35,'sold_out','veg',2),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Bread Omelette','Fluffy omelette with toasted bread',40,'available','egg',3),
  -- Central · South Indian
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','Ghee Podi Idli','Idlis tossed in ghee & gunpowder',50,'available','veg',0),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','Onion Uttapam','Thick pancake topped with onions & chillies',55,'available','veg',1),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','Rava Kesari','Warm semolina sweet with cashews',30,'coming_soon','veg',2),
  -- Central · Lunch Meals
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','South Indian Meals','Rice, sambar, rasam, poriyal, curd & appalam',90,'available','veg',0),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','Curd Rice','Comforting tempered curd rice',45,'available','veg',1),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','Chicken Biryani','Fragrant seeraga samba rice with chicken',130,'sold_out','non_veg',2),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','Veg Fried Rice','Wok-tossed rice with garden vegetables',80,'available','veg',3),
  -- Central · Beverages
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','Filter Coffee','Strong South-Indian degree coffee',20,'available','veg',0),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','Masala Chai','Spiced milk tea',15,'available','veg',1),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','Fresh Lime Soda','Sweet & salt, your choice',30,'available','veg',2),
  -- Central · Desserts
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','Gulab Jamun','Two warm jamuns in saffron syrup',35,'available','veg',0),
  ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','Fruit Custard','Chilled custard with seasonal fruit',40,'coming_soon','veg',1),
  -- Adithya · Snacks
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000006','Masala Vada','Crunchy lentil fritters',25,'available','veg',0),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000006','Veg Puff','Flaky puff with spiced veg filling',20,'available','veg',1),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000006','Egg Puff','Flaky puff with masala egg',25,'sold_out','egg',2),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000006','French Fries','Salted crispy fries',60,'available','veg',3),
  -- Adithya · Chaat Corner
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000007','Pani Puri','Six puris with spiced water',40,'available','veg',0),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000007','Sev Puri','Crisp puris, chutneys & sev',45,'available','veg',1),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000007','Samosa Chaat','Crushed samosa with curd & chutneys',55,'coming_soon','veg',2),
  -- Adithya · Rolls & Wraps
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000008','Paneer Kathi Roll','Grilled paneer wrapped in paratha',85,'available','veg',0),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000008','Chicken Kathi Roll','Spiced chicken wrapped in paratha',95,'available','non_veg',1),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000008','Veg Schezwan Wrap','Spicy veg & noodles wrap',75,'sold_out','veg',2),
  -- Adithya · Cold Brews
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000009','Cold Coffee','Blended iced coffee with cream',60,'available','veg',0),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000009','Oreo Shake','Thick shake with cookie crumble',70,'available','veg',1),
  ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000009','Watermelon Cooler','Fresh pressed watermelon juice',45,'available','veg',2),
  -- Nila · Maggi & Noodles
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000010','Masala Maggi','Classic masala Maggi with veggies',40,'available','veg',0),
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000010','Cheese Maggi','Loaded with melted cheese',55,'available','veg',1),
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000010','Veg Hakka Noodles','Stir-fried noodles with veg',70,'available','veg',2),
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000010','Egg Noodles','Wok noodles with scrambled egg',80,'coming_soon','egg',3),
  -- Nila · Late-night Bites
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000011','Cheese Garlic Bread','Toasted bread with garlic butter & cheese',65,'available','veg',0),
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000011','Chicken Momos','Steamed dumplings with spicy chutney',90,'available','non_veg',1),
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000011','Paneer Momos','Steamed paneer dumplings',80,'sold_out','veg',2),
  -- Nila · Hot Beverages
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000012','Ginger Chai','Strong chai with fresh ginger',18,'available','veg',0),
  ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000012','Hot Chocolate','Rich cocoa with steamed milk',50,'available','veg',1);
