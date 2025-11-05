-- 添加50个真实产品到数据库（修复版 - JSONB格式）
-- 请在 Supabase SQL Editor 中执行此脚本

DO $$
DECLARE
  v_seller_id UUID;
  v_electronics_id UUID := 'e9a1fd00-af98-44d3-b85c-a8cfbbc40445';
  v_fashion_id UUID := '5a45f6aa-9735-4cff-837d-ce0942f68682';
  v_home_id UUID := '17865395-4c32-48e4-bc00-354d94db0fcf';
  v_books_id UUID := 'd8fc92f1-ca05-4291-bc07-f0f2900e3c59';
  v_sports_id UUID := 'a99fcdcf-2fd9-466d-8001-55afe9c3bdcb';
BEGIN
  -- 获取第一个seller用户
  SELECT id INTO v_seller_id FROM profiles WHERE role = 'seller' LIMIT 1;

  IF v_seller_id IS NULL THEN
    RAISE EXCEPTION 'No seller found. Please create a seller account first.';
  END IF;

  -- 1. 电子产品 (10个)
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, status, images)
  VALUES
    (v_seller_id, v_electronics_id, 'iPhone 16 Pro 256GB', 'A18 Pro芯片，钛金属设计，全天候显示屏，ProMotion自适应刷新率技术，4800万像素主摄，支持5G网络。', 7999, 8999, 50, 'active', '["https://images.unsplash.com/photo-1696446702094-ad6a16acbb78?w=800", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, '小米14 Ultra 16GB+512GB', '骁龙8 Gen3处理器，徕卡专业光学镜头，2K AMOLED屏幕，120W快充，5000mAh大电池。', 6499, 6999, 80, 'active', '["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, '华为MatePad Pro 13.2英寸', '麒麟9000s芯片，13.2英寸柔性OLED屏幕，支持M-Pencil手写笔，HarmonyOS 4.0系统。', 5999, 6999, 60, 'active', '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, 'MacBook Air M3 13英寸', 'M3芯片，8核CPU和10核GPU，8GB统一内存，512GB固态硬盘，18小时续航。', 9999, 10999, 40, 'active', '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, '索尼Alpha 7 IV 全画幅微单', '3300万像素传感器，5轴防抖，4K 60p视频录制，693个相位检测对焦点，双卡槽设计。', 16999, 18999, 25, 'active', '["https://images.unsplash.com/photo-1606980619724-96b9d35a6611?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, 'AirPods Pro 第二代', 'H2芯片，主动降噪，自适应通透模式，空间音频，最长6小时单次电池续航。', 1899, 1999, 100, 'active', '["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, '戴尔XPS 15 笔记本电脑', '英特尔酷睿i7-13700H，16GB DDR5内存，512GB NVMe固态硬盘，15.6英寸4K OLED触控屏。', 11999, 13999, 35, 'active', '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, '大疆Mini 4 Pro 无人机', '4K/60fps视频拍摄，全向避障系统，34分钟续航，智能跟随3.0，支持夜景模式。', 4788, 5299, 45, 'active', '["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, 'Nintendo Switch OLED版', '7英寸OLED屏幕，64GB存储，可连接电视，支持Joy-Con手柄，包含健身环大冒险游戏。', 2499, 2699, 70, 'active', '["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800"]'::jsonb),
    (v_seller_id, v_electronics_id, '小米手环8 Pro', '1.74英寸AMOLED屏幕，14天续航，150+运动模式，全天候血氧监测，5ATM防水。', 399, 499, 150, 'active', '["https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800"]'::jsonb);

  -- 2. 服装鞋包 (10个)
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, status, images)
  VALUES
    (v_seller_id, v_fashion_id, '优衣库 AIRism棉质T恤', '100%纯棉面料，AIRism科技吸湿排汗，多种纯色可选，四季百搭基础款，修身剪裁。', 99, 129, 200, 'active', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'ZARA 花卉印花连衣裙', '2025春夏新款，雪纺面料，V领设计，波西米亚风格，适合度假和日常穿搭。', 399, 599, 80, 'active', '["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'Nike Air Max 270 运动鞋', 'Max Air气垫，透气网眼鞋面，缓震中底，耐磨橡胶外底，多种配色可选。', 1199, 1399, 60, 'active', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'Adidas三叶草 运动套装', '经典三条纹设计，100%聚酯纤维，透气排汗，包含连帽卫衣和运动裤。', 699, 999, 90, 'active', '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'COACH经典款单肩包', '进口牛皮材质，金属COACH标志，多隔层设计，可调节肩带，附防尘袋。', 2999, 3999, 40, 'active', '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'Levi''s 511修身牛仔裤', '经典五袋款，弹力丹宁面料，中腰修身设计，耐磨耐洗，多种洗水效果。', 599, 799, 100, 'active', '["https://images.unsplash.com/photo-1542272454315-7bfabf0c0e59?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'H&M 白色衬衫', '100%棉质，商务休闲两用，经典版型，防皱处理，适合办公室和约会场合。', 249, 349, 120, 'active', '["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'Under Armour运动内衣', 'HeatGear面料，高强度支撑，透气速干，防震设计，适合健身和跑步。', 299, 399, 75, 'active', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'Converse经典帆布鞋', '经典Chuck Taylor款式，帆布鞋面，橡胶鞋底，百搭休闲，多种颜色可选。', 329, 429, 150, 'active', '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"]'::jsonb),
    (v_seller_id, v_fashion_id, 'Columbia哥伦比亚冲锋衣', 'Omni-Tech防水透气，可脱卸内胆，防风保暖，多个口袋设计，适合户外运动。', 1299, 1699, 55, 'active', '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"]'::jsonb);

  -- 3. 家居生活 (10个)
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, status, images)
  VALUES
    (v_seller_id, v_home_id, 'MUJI无印良品 懒人沙发', '高密度海绵填充，可拆洗外套，人体工学设计，多种颜色可选，适合卧室和客厅。', 1299, 1699, 50, 'active', '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"]'::jsonb),
    (v_seller_id, v_home_id, 'IKEA宜家 MALM抽屉柜', '北欧简约风格，优质刨花板，四层抽屉设计，承重强，多种颜色可选。', 799, 999, 60, 'active', '["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800"]'::jsonb),
    (v_seller_id, v_home_id, '水星家纺 60支长绒棉四件套', '埃及长绒棉，60支高支高密，活性印染，包含被套、床单、2个枕套。', 899, 1299, 80, 'active', '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"]'::jsonb),
    (v_seller_id, v_home_id, '双立人Twin Chef刀具套装', '德国进口，5件套含主厨刀、面包刀、砍骨刀、削皮刀、剪刀，附赠刀座。', 1599, 2199, 40, 'active', '["https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800"]'::jsonb),
    (v_seller_id, v_home_id, '九阳破壁料理机', '2200W大功率，8叶精钢刀头，智能降噪，预约定时，支持豆浆、果汁、米糊等多种功能。', 799, 1099, 70, 'active', '["https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800"]'::jsonb),
    (v_seller_id, v_home_id, '飞利浦空气炸锅', '4.1L大容量，智能触控面板，360°热空气循环，少油健康，可烤可煎可烘焙。', 699, 999, 90, 'active', '["https://images.unsplash.com/photo-1585659722604-1a8d2cf79b87?w=800"]'::jsonb),
    (v_seller_id, v_home_id, '美的智能扫地机器人', 'LDS激光导航，3000Pa吸力，自动回充，智能规划路线，支持APP远程控制。', 1499, 1999, 55, 'active', '["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800"]'::jsonb),
    (v_seller_id, v_home_id, '网易严选纯棉毛巾6条装', '新疆长绒棉，A类婴儿级，柔软吸水，抑菌除螨，多种颜色组合。', 129, 199, 200, 'active', '["https://images.unsplash.com/photo-1600456899121-68eda5705257?w=800"]'::jsonb),
    (v_seller_id, v_home_id, '松下吹风机负离子护发', '纳米水离子技术，快速干发，3档风速调节，冷热风切换，低噪音设计。', 599, 799, 85, 'active', '["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800"]'::jsonb),
    (v_seller_id, v_home_id, '小米台灯Pro', '无蓝光伤害，Ra95高显色，四轴调节，支持米家APP控制，阅读和电脑模式。', 199, 299, 120, 'active', '["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"]'::jsonb);

  -- 4. 图书音像 (10个)
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, status, images)
  VALUES
    (v_seller_id, v_books_id, '《三体》全集（纪念版）', '刘慈欣科幻巨作，雨果奖获奖作品，精装典藏版，包含三体、黑暗森林、死神永生。', 129, 168, 100, 'active', '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800"]'::jsonb),
    (v_seller_id, v_books_id, '《百年孤独》马尔克斯', '诺贝尔文学奖作品，魔幻现实主义代表作，新译本，精装收藏版。', 59, 79, 150, 'active', '["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800"]'::jsonb),
    (v_seller_id, v_books_id, '《人类简史》尤瓦尔·赫拉利', '从动物到上帝的人类进化史，畅销全球，启迪思维的历史读物。', 68, 88, 120, 'active', '["https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800"]'::jsonb),
    (v_seller_id, v_books_id, '《活着》余华', '当代文学经典，感人至深的生命力作品，茅盾文学奖获奖作品。', 39, 52, 180, 'active', '["https://images.unsplash.com/photo-1589998059171-988d887df646?w=800"]'::jsonb),
    (v_seller_id, v_books_id, 'Kindle Paperwhite电子书阅读器', '6.8英寸无眩光屏幕，IPX8防水，20周续航，支持Audible有声书，16GB存储。', 998, 1198, 60, 'active', '["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800"]'::jsonb),
    (v_seller_id, v_books_id, '泰勒·斯威夫特《Midnights》黑胶唱片', '2025年格莱美获奖专辑，180克重黑胶，附赠精美歌词本和海报。', 299, 399, 50, 'active', '["https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800"]'::jsonb),
    (v_seller_id, v_books_id, '《原则》瑞·达利欧', '全球畅销书，桥水基金创始人的人生和工作原则，精装中文版。', 89, 119, 90, 'active', '["https://images.unsplash.com/photo-1553729784-e91953dec042?w=800"]'::jsonb),
    (v_seller_id, v_books_id, '《哈利·波特》全集（新版）', 'J.K.罗琳魔法世界经典，7本全集珍藏版，精美插图，适合收藏和阅读。', 399, 560, 70, 'active', '["https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=800"]'::jsonb),
    (v_seller_id, v_books_id, '《经济学原理》曼昆（第8版）', '全球最畅销的经济学教材，微观经济学和宏观经济学双册，附赠在线学习资源。', 168, 228, 55, 'active', '["https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800"]'::jsonb),
    (v_seller_id, v_books_id, 'BBC纪录片《地球脉动III》蓝光碟', '4K超高清画质，5.1环绕声，中英双语字幕，收录8集完整内容和幕后花絮。', 199, 299, 65, 'active', '["https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800"]'::jsonb);

  -- 5. 运动户外 (10个)
  INSERT INTO products (seller_id, category_id, name, description, price, original_price, stock, status, images)
  VALUES
    (v_seller_id, v_sports_id, 'Lululemon瑜伽垫', '5mm厚度，天然橡胶材质，双面防滑，轻量便携，附赠收纳袋。', 498, 698, 80, 'active', '["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, '迪卡侬专业跑步鞋', 'Kalenji系列，轻量透气，缓震中底，耐磨外底，适合日常训练和马拉松。', 399, 599, 100, 'active', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, 'Keep智能动感单车', '磁控静音，可调节座椅和把手，配合Keep APP使用，实时数据监测，承重150kg。', 1999, 2699, 45, 'active', '["https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, '李宁羽毛球拍对拍套装', '全碳素材质，攻守兼备，附赠2个羽毛球和球包，适合初中级选手。', 499, 799, 70, 'active', '["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, 'The North Face双肩登山包50L', '防水尼龙面料，多隔层设计，透气背负系统，登山杖固定，适合3-5天徒步。', 1299, 1799, 50, 'active', '["https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, '迪卡侬自动充气帐篷', '3-4人家庭帐篷，一键自动搭建，防雨防晒，双层通风，附赠地钉和防潮垫。', 899, 1299, 40, 'active', '["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, '威尔胜篮球NBA官方用球', '7号标准篮球，PU材质，耐磨防滑，室内外两用，NBA官方认证。', 299, 399, 120, 'active', '["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, 'YETI保温水壶1L', '双层真空不锈钢，24小时保冷/12小时保热，防漏设计，适合户外运动。', 399, 599, 90, 'active', '["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, '骆驼户外冲锋衣', '三合一可拆卸设计，防风防水，抓绒内胆，多个口袋，适合登山和徒步。', 699, 999, 65, 'active', '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"]'::jsonb),
    (v_seller_id, v_sports_id, '海德网球拍单拍', '碳纤维拍框，中等平衡点，适合进阶选手，附赠网球包和避震器。', 899, 1299, 55, 'active', '["https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"]'::jsonb);

  RAISE NOTICE '✅ 成功添加50个产品！';
END $$;

-- 验证添加的产品
SELECT
  c.name as 分类,
  COUNT(p.id) as 产品数量
FROM products p
JOIN categories c ON c.id = p.category_id
GROUP BY c.name
ORDER BY c.name;
