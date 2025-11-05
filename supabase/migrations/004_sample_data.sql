-- ================================
-- 示例数据（测试用）
-- ================================

-- 注意：执行此文件前，请先注册至少一个用户账号

-- 1. 创建一个测试商家账号（将第一个用户设置为商家）
-- 如果你已经注册了账号，可以执行下面的 SQL 将其设置为商家
-- UPDATE profiles SET role = 'seller' WHERE email = 'your-email@example.com';

-- 2. 插入示例商品数据
-- 使用第一个商家账号作为卖家
INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  '苹果 iPhone 15 Pro',
  'A17 Pro 芯片，全新钛金属设计，专业级摄像系统。6.1 英寸超视网膜 XDR 显示屏。',
  7999.00,
  8999.00,
  50,
  '["https://images.unsplash.com/photo-1592286927505-2c0d9e32e5b7?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  'MacBook Pro 14 英寸',
  'M3 Pro 芯片，18GB 统一内存，512GB 固态硬盘。Liquid 视网膜 XDR 显示屏。',
  14999.00,
  16999.00,
  30,
  '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  'AirPods Pro (第二代)',
  '主动降噪，自适应通透模式，空间音频。提供长达 6 小时的聆听时间。',
  1899.00,
  100,
  '["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1),
  '男士休闲夹克',
  '纯棉面料，舒适透气。经典款式，适合春秋季节穿着。多色可选。',
  299.00,
  499.00,
  200,
  '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1),
  '女士运动鞋',
  '轻量化设计，透气网面，舒适缓震。适合跑步、健身等运动场景。',
  399.00,
  150,
  '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'home' LIMIT 1),
  '智能扫地机器人',
  '激光导航，智能规划路径。支持扫拖一体，APP 远程控制。2500Pa 大吸力。',
  1599.00,
  1999.00,
  80,
  '["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'home' LIMIT 1),
  '北欧风格台灯',
  '简约设计，护眼 LED 光源。三档调光，适合阅读、工作。USB 充电，无线使用。',
  199.00,
  300,
  '["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'books' LIMIT 1),
  '《人类简史》',
  '尤瓦尔·赫拉利 著。从认知革命到科技革命，探索人类历史的发展轨迹。',
  68.00,
  88.00,
  500,
  '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'sports' LIMIT 1),
  '瑜伽垫',
  '加厚 10mm，TPE 环保材质。防滑耐磨，适合瑜伽、健身等运动。附送收纳袋。',
  89.00,
  1000,
  '["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, images, status)
SELECT
  (SELECT id FROM profiles WHERE role = 'seller' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'sports' LIMIT 1),
  '哑铃套装',
  '可调节重量 5-30kg，环保橡胶包裹。适合家庭健身，节省空间。',
  299.00,
  399.00,
  120,
  '["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop"]'::jsonb,
  'active'
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1);

-- 3. 提示信息
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'seller' LIMIT 1) THEN
    RAISE NOTICE '警告：未找到商家账号！请先注册一个账号，然后执行：UPDATE profiles SET role = ''seller'' WHERE email = ''your-email@example.com'';';
  ELSE
    RAISE NOTICE '成功！已插入 10 个示例商品。';
  END IF;
END $$;
