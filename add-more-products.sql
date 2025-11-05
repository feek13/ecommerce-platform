-- Add More Products Script
-- Run this in Supabase SQL Editor

-- Get user 31's ID as seller
DO $$
DECLARE
  v_seller_id uuid;
  v_electronics_id uuid;
  v_fashion_id uuid;
  v_home_id uuid;
  v_books_id uuid;
  v_sports_id uuid;
BEGIN
  -- Get seller ID
  SELECT id INTO v_seller_id FROM profiles WHERE full_name = '31' LIMIT 1;

  -- Get category IDs
  SELECT id INTO v_electronics_id FROM categories WHERE slug = 'electronics';
  SELECT id INTO v_fashion_id FROM categories WHERE slug = 'fashion';
  SELECT id INTO v_home_id FROM categories WHERE slug = 'home';
  SELECT id INTO v_books_id FROM categories WHERE slug = 'books';
  SELECT id INTO v_sports_id FROM categories WHERE slug = 'sports';

  -- Insert Electronics Products
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status) VALUES
  (v_seller_id, v_electronics_id, 'iPad Pro 12.9英寸 M2芯片', '配备 M2 芯片的 iPad Pro，性能强劲，支持 Apple Pencil 悬停功能。配备原彩显示 Liquid Retina XDR 显示屏。', 9299, 10299, 30, ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'], 'active'),
  (v_seller_id, v_electronics_id, '戴尔 XPS 15 笔记本电脑', 'Intel Core i7-13700H 处理器，NVIDIA GeForce RTX 4050 显卡，16GB内存，512GB固态硬盘。', 12999, 14999, 20, ARRAY['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'], 'active'),
  (v_seller_id, v_electronics_id, '罗技 MX Master 3S 无线鼠标', '静音点击，8K DPI传感器，支持多设备切换，人体工学设计。', 799, 899, 100, ARRAY['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'], 'active'),
  (v_seller_id, v_electronics_id, 'GoPro HERO12 Black 运动相机', '5.3K60视频录制，HyperSmooth 6.0增强防抖，10米防水。', 3498, 3998, 45, ARRAY['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800'], 'active'),
  (v_seller_id, v_electronics_id, 'DJI Mini 3 Pro 无人机', '轻巧便携，4K/60fps视频，智能跟随，避障系统，34分钟续航。', 4788, 5288, 25, ARRAY['https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800'], 'active');

  -- Insert Fashion Products
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status) VALUES
  (v_seller_id, v_fashion_id, 'The North Face 羽绒服', '700蓬松度鹅绒填充，防水面料，保暖舒适。', 1899, 2499, 60, ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'], 'active'),
  (v_seller_id, v_fashion_id, 'Ray-Ban 雷朋太阳镜经典款', '经典飞行员款式，偏光镜片，100%UV防护。', 1290, 1590, 80, ARRAY['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'], 'active'),
  (v_seller_id, v_fashion_id, 'Timberland 经典黄靴', '防水牛皮革，橡胶大底，舒适耐磨。', 1599, 1899, 50, ARRAY['https://images.unsplash.com/photo-1542840843-3349799cded6?w=800'], 'active'),
  (v_seller_id, v_fashion_id, 'Gap 经典卫衣', '纯棉面料，舒适柔软，经典Logo设计。', 299, 399, 150, ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'], 'active'),
  (v_seller_id, v_fashion_id, 'Michael Kors 女士手提包', '十字纹牛皮，多功能隔层，时尚百搭。', 2199, 2899, 35, ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'], 'active');

  -- Insert Home Products
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status) VALUES
  (v_seller_id, v_home_id, 'Dyson V15 Detect 吸尘器', '激光探测技术，HEPA过滤，60分钟续航。', 4490, 4990, 40, ARRAY['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'], 'active'),
  (v_seller_id, v_home_id, 'Nespresso 咖啡机', '19bar压力萃取，一键制作意式浓缩咖啡。', 1299, 1599, 55, ARRAY['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'], 'active'),
  (v_seller_id, v_home_id, 'MUJI 无印良品 简约床品四件套', '100%纯棉，亲肤透气，简约设计。', 599, 799, 80, ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], 'active'),
  (v_seller_id, v_home_id, 'Le Creuset 铸铁锅 24cm', '珐琅涂层，均匀受热，适合炖煮烘焙。', 1890, 2290, 30, ARRAY['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'], 'active'),
  (v_seller_id, v_home_id, 'Philips 空气炸锅', '4.1L大容量，Rapid Air技术，少油健康烹饪。', 899, 1199, 70, ARRAY['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'], 'active');

  -- Insert Books Products
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status) VALUES
  (v_seller_id, v_books_id, '《深度学习》Goodfellow', 'Ian Goodfellow等著，深度学习领域的经典教材。', 168, 198, 100, ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800'], 'active'),
  (v_seller_id, v_books_id, '《福尔摩斯探案全集》', '柯南·道尔经典侦探小说，全新中英双语版。', 128, 168, 120, ARRAY['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800'], 'active'),
  (v_seller_id, v_books_id, '《小王子》精装版', '圣埃克苏佩里著，精美插图，收藏版。', 68, 88, 200, ARRAY['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'], 'active'),
  (v_seller_id, v_books_id, 'Taylor Swift - 1989 (Taylor''s Version) CD', '泰勒重录版专辑，收录额外曲目。', 128, 158, 80, ARRAY['https://images.unsplash.com/photo-1619983081563-430f63602796?w=800'], 'active');

  -- Insert Sports Products
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status) VALUES
  (v_seller_id, v_sports_id, 'Garmin Fenix 7 运动手表', 'GPS定位，心率监测，多种运动模式，18天续航。', 5280, 5980, 35, ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'], 'active'),
  (v_seller_id, v_sports_id, 'Wilson 网球拍专业款', '碳纤维材质，适合中高级球员，配网球包。', 1099, 1399, 45, ARRAY['https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'], 'active'),
  (v_seller_id, v_sports_id, 'Spalding NBA官方比赛用球', '真皮材质，室内外通用，官方认证。', 399, 499, 90, ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'], 'active'),
  (v_seller_id, v_sports_id, 'Osprey 登山背包 65L', '防水面料，透气背负系统，多隔层设计。', 1299, 1599, 40, ARRAY['https://images.unsplash.com/photo-1622260614927-1c0ff962c08d?w=800'], 'active');

  RAISE NOTICE '✅ Successfully added 23 products!';
  RAISE NOTICE '📊 Product breakdown:';
  RAISE NOTICE '- Electronics: 5 products';
  RAISE NOTICE '- Fashion: 5 products';
  RAISE NOTICE '- Home: 5 products';
  RAISE NOTICE '- Books: 4 products';
  RAISE NOTICE '- Sports: 4 products';
END $$;
