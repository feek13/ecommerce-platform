-- 批量添加商品数据
-- seller_id: why@gmail.com = 3af03b6b-43f0-4b94-a9b4-aaccb4333638

-- Category IDs:
-- 电子产品: e9a1fd00-af98-44d3-b85c-a8cfbbc40445
-- 服装鞋包: 5a45f6aa-9735-4cff-837d-ce0942f68682
-- 家居生活: 17865395-4c32-48e4-bc00-354d94db0fcf
-- 运动户外: a99fcdcf-2fd9-466d-8001-55afe9c3bdcb

-- 电子产品类
INSERT INTO products (seller_id, name, description, price, original_price, stock, category_id, images, status) VALUES
('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'MacBook Pro 14英寸 M3 Pro芯片 深空黑色', 'Apple M3 Pro 芯片，18GB统一内存，512GB SSD存储。14.2英寸Liquid Retina XDR显示屏，ProMotion自适应刷新率技术。强大性能，续航持久，专业创作利器。', 14999, 16999, 30, 'e9a1fd00-af98-44d3-b85c-a8cfbbc40445', ARRAY['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp14-spacegray-select-202310'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'iPad Air 第5代 10.9英寸 天蓝色', 'Apple M1芯片，10.9英寸Liquid Retina显示屏，支持Apple Pencil第二代。64GB存储，前置1200万像素超广角摄像头，支持人物居中功能。轻薄便携，性能强劲。', 4399, 4799, 60, 'e9a1fd00-af98-44d3-b85c-a8cfbbc40445', ARRAY['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/ipad-air-select-wifi-blue-202203'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'AirPods Pro 第2代 USB-C充电', '主动降噪，通透模式，自适应音频。H2芯片带来更强大的降噪和3D音频体验。单次充电最长可使用6小时，配合充电盒总续航达30小时。', 1899, 1999, 100, 'e9a1fd00-af98-44d3-b85c-a8cfbbc40445', ARRAY['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MQD83'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'Apple Watch Series 9 GPS 45mm 午夜色', 'S9芯片，全天候视网膜显示屏，血氧监测，心电图，睡眠追踪。45mm大表盘，支持双击手势，精准健康和运动追踪。', 3199, 3499, 45, 'e9a1fd00-af98-44d3-b85c-a8cfbbc40445', ARRAY['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/watch-case-45-aluminum-midnight-nc-s9'], 'active');

-- 服装鞋包类
INSERT INTO products (seller_id, name, description, price, original_price, stock, category_id, images, status) VALUES
('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'Nike Air Max 270 男子运动鞋 黑白配色', '经典Air Max气垫设计，提供出色缓震和舒适度。透气网眼鞋面，轻便耐穿。经典黑白配色，百搭时尚。适合日常休闲和轻度运动。', 899, 1099, 80, '5a45f6aa-9735-4cff-837d-ce0942f68682', ARRAY['https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-mens-shoes-KkLcGR.png'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'Adidas Originals 三叶草经典卫衣 黑色', '100%纯棉面料，舒适柔软。经典三叶草logo刺绣，宽松版型。适合春秋季节穿着，街头潮流必备单品。', 499, 699, 120, '5a45f6aa-9735-4cff-837d-ce0942f68682', ARRAY['https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Adicolor_Classics_Trefoil_Hoodie_Black_H06639_21_model.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'Levi''s 501 Original 经典直筒牛仔裤 深蓝色', '经典501版型，直筒裤腿，中腰设计。100%纯棉丹宁布，耐穿耐洗。永不过时的经典款式，适合各种场合穿着。', 599, 799, 90, '5a45f6aa-9735-4cff-837d-ce0942f68682', ARRAY['https://lsco.scene7.com/is/image/lsco/005010114-front-pdp'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'Michael Kors Jet Set 女士单肩包 棕色', '优质PVC材质，搭配真皮饰边。多隔层设计，可放置手机、钱包等日常物品。经典MK logo，时尚百搭。', 1299, 1699, 50, '5a45f6aa-9735-4cff-837d-ce0942f68682', ARRAY['https://michaelkors.scene7.com/is/image/MichaelKors/30S3GTVT2B-0230'], 'active');

-- 家居生活类
INSERT INTO products (seller_id, name, description, price, original_price, stock, category_id, images, status) VALUES
('3af03b6b-43f0-4b94-a9b4-aaccb4333638', '无印良品 懒人沙发 米白色 单人位', '可拆洗沙发套，内芯采用高密度海绵，舒适支撑。简约北欧风格，适合卧室、客厅使用。承重性好，经久耐用。', 899, 1299, 40, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://img.muji.net/img/item/4550512685371_1260.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'IKEA 宜家 马尔姆 四斗抽屉柜 白色', '现代简约设计，四层大容量抽屉。优质刨花板材质，表面光滑易清洁。稳固耐用，适合卧室、客厅收纳衣物杂物。', 599, 799, 35, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://www.ikea.cn/cn/zh/images/products/malm-chest-of-4-drawers-white__0484880_pe621374_s5.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', '德国双立人 不锈钢刀具五件套', '高碳不锈钢材质，锋利耐用。包含厨师刀、切片刀、多用刀、削皮刀和剪刀。人体工学手柄设计，握持舒适。专业厨房必备。', 1899, 2399, 60, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dw0e3c8e64/images/large/30768-000-0.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', '全棉时代纯棉四件套 简约条纹 1.8米床', '100%新疆长绒棉，A类婴儿级安全标准。包含被套、床单、2个枕套。亲肤透气，四季适用。多次水洗不起球不褪色。', 699, 999, 70, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://cdn-fsly.yottaa.net/59b89c89bc8d3f0e388b4567/www.purcotton.com/v~4b.1a5/dyn/file/attachment/2023/01/07/1024x1024bb.jpg'], 'active');

-- 食品生鲜类
INSERT INTO products (seller_id, name, description, price, original_price, stock, category_id, images, status) VALUES
('3af03b6b-43f0-4b94-a9b4-aaccb4333638', '良品铺子 每日坚果混合装 30袋', '精选夏威夷果、腰果、核桃仁、蔓越莓干等。每袋25g，独立小包装方便携带。无添加防腐剂，健康营养。', 129, 159, 200, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://chaoshi.detail.tmall.com/item_o2o.htm'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', '三只松鼠 碧根果 奶油味 210g', '美国进口碧根果，颗颗饱满。奶香浓郁，香脆可口。罐装密封，锁鲜保脆。追剧必备零食。', 45, 59, 300, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://gw.alicdn.com/imgextra/i1/2053469401/O1CN01RJoVJp2JQoaXtYqR6_!!2053469401.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', '农夫山泉 天然饮用水 550ml*12瓶', '取自千岛湖深层水源，天然弱碱性。不添加任何矿物质，自然纯净。运动健身、日常饮用首选。', 28, 35, 500, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://nongfuspring.oss-cn-hangzhou.aliyuncs.com/upload/image/20200101/1577851200000.jpg'], 'active');

-- 美妆个护类
INSERT INTO products (seller_id, name, description, price, original_price, stock, category_id, images, status) VALUES
('3af03b6b-43f0-4b94-a9b4-aaccb4333638', '雅诗兰黛小棕瓶精华液 50ml', '经典修护精华，改善肌肤细纹、暗沉。专利修护科技，深层滋养肌肤。适合各种肤质，早晚使用效果更佳。', 899, 1080, 80, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://www.esteelauder.com.cn/media/export/cms/products/558x768/el_sku_JJP001_558x768_0.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'SK-II 神仙水 230ml', '含Pitera™酵母精华，调理肌肤纹理。改善暗沉，提亮肤色。日本进口，经典护肤必备。', 1599, 1890, 60, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://www.sk-ii.com.cn/dw/image/v2/BJJL_PRD/on/demandware.static/-/Sites-sk2-master-catalog/default/dw0a3b0d3c/packshots/99350090399_1.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'MAC 魅可子弹头口红 Chili色号', '经典复古红棕色，适合秋冬季节。丝绒哑光质地，显色度高，持久不脱色。专业彩妆品牌，明星推荐色号。', 190, 210, 150, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://www.maccosmetics.com.cn/media/export/cms/products/640x600/mac_sku_M2CG01_640x600_0.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', '欧莱雅紫熨斗眼霜 15ml', '抗皱紧致，淡化细纹黑眼圈。含视黄醇和咖啡因成分。质地清爽易吸收，早晚使用改善眼周肌肤。', 269, 329, 100, '17865395-4c32-48e4-bc00-354d94db0fcf', ARRAY['https://www.lorealparis.com.cn/-/media/project/loreal/brand-sites/oap/apac/cn/products/skin-care/revitalift/revitalift-filler/eye-cream/packshot_eye_cream.jpg'], 'active');

-- 运动户外类
INSERT INTO products (seller_id, name, description, price, original_price, stock, category_id, images, status) VALUES
('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'Lululemon 女士运动紧身裤 黑色', 'Nulu™面料，轻盈贴身，四向弹力。高腰设计，提臀收腹。透气排汗，瑜伽健身必备。', 750, 850, 90, 'a99fcdcf-2fd9-466d-8001-55afe9c3bdcb', ARRAY['https://images.lululemon.com/is/image/lululemon/LW5CWNS_028646_1'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'Decathlon 迪卡侬专业瑜伽垫 6mm', 'NBR材质，防滑耐磨。6mm厚度提供良好缓冲保护。双面防滑纹理，初学者友好。附赠背带，方便携带。', 99, 129, 200, 'a99fcdcf-2fd9-466d-8001-55afe9c3bdcb', ARRAY['https://contents.mediadecathlon.com/p1745146/k$7f3c0c4b5d0d4f8e9c7b1a2d3e4f5g6h/sq/yoga-mat-6mm-grey.jpg'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'Under Armour 男士运动T恤 速干透气', 'UA Tech™速干面料，快速排汗。松紧适中，运动不束缚。抗菌防臭，多色可选。', 199, 259, 120, 'a99fcdcf-2fd9-466d-8001-55afe9c3bdcb', ARRAY['https://underarmour.scene7.com/is/image/Underarmour/1326799-001_DEFAULT'], 'active'),

('3af03b6b-43f0-4b94-a9b4-aaccb4333638', 'YETI 保温杯 26oz 不锈钢真空', '18/8不锈钢材质，双层真空隔热。保温保冷效果持久，冷饮24小时，热饮6小时。防漏设计，户外旅行必备。', 429, 499, 80, 'a99fcdcf-2fd9-466d-8001-55afe9c3bdcb', ARRAY['https://www.yeti.com/dw/image/v2/BDRX_PRD/on/demandware.static/-/Sites-yeti-master-catalog/default/dw1a2b3c4d/images/drinkware/YRAMB26_black_quarter_turn_2400x1800.png'], 'active');
