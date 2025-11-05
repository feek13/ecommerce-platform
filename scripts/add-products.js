// Script to batch insert products using Supabase client
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+?)\s*=\s*(.*)$/)
  if (match) {
    env[match[1].trim()] = match[2].trim()
  }
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const SELLER_ID = '3af03b6b-43f0-4b94-a9b4-aaccb4333638' // why@gmail.com

// Category IDs from database
const CATEGORIES = {
  '电子产品': 'e9a1fd00-af98-44d3-b85c-a8cfbbc40445',
  '服装鞋包': '5a45f6aa-9735-4cff-837d-ce0942f68682',
  '家居生活': '17865395-4c32-48e4-bc00-354d94db0fcf',
  '运动户外': 'a99fcdcf-2fd9-466d-8001-55afe9c3bdcb',
  '图书音像': 'd8fc92f1-ca05-4291-bc07-f0f2900e3c59'
}

const products = [
  // 电子产品类
  {
    seller_id: SELLER_ID,
    name: 'MacBook Pro 14英寸 M3 Pro芯片 深空黑色',
    description: 'Apple M3 Pro 芯片，18GB统一内存，512GB SSD存储。14.2英寸Liquid Retina XDR显示屏，ProMotion自适应刷新率技术。强大性能，续航持久，专业创作利器。',
    price: 14999,
    original_price: 16999,
    stock: 30,
    category_id: CATEGORIES['电子产品'],
    images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp14-spacegray-select-202310'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'iPad Air 第5代 10.9英寸 天蓝色',
    description: 'Apple M1芯片，10.9英寸Liquid Retina显示屏，支持Apple Pencil第二代。64GB存储，前置1200万像素超广角摄像头，支持人物居中功能。轻薄便携，性能强劲。',
    price: 4399,
    original_price: 4799,
    stock: 60,
    category_id: CATEGORIES['电子产品'],
    images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/ipad-air-select-wifi-blue-202203'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'AirPods Pro 第2代 USB-C充电',
    description: '主动降噪，通透模式，自适应音频。H2芯片带来更强大的降噪和3D音频体验。单次充电最长可使用6小时，配合充电盒总续航达30小时。',
    price: 1899,
    original_price: 1999,
    stock: 100,
    category_id: CATEGORIES['电子产品'],
    images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MQD83'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'Apple Watch Series 9 GPS 45mm 午夜色',
    description: 'S9芯片，全天候视网膜显示屏，血氧监测，心电图，睡眠追踪。45mm大表盘，支持双击手势，精准健康和运动追踪。',
    price: 3199,
    original_price: 3499,
    stock: 45,
    category_id: CATEGORIES['电子产品'],
    images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/watch-case-45-aluminum-midnight-nc-s9'],
    status: 'active'
  },

  // 服装鞋包类
  {
    seller_id: SELLER_ID,
    name: 'Nike Air Max 270 男子运动鞋 黑白配色',
    description: '经典Air Max气垫设计，提供出色缓震和舒适度。透气网眼鞋面，轻便耐穿。经典黑白配色，百搭时尚。适合日常休闲和轻度运动。',
    price: 899,
    original_price: 1099,
    stock: 80,
    category_id: CATEGORIES['服装鞋包'],
    images: ['https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-mens-shoes-KkLcGR.png'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'Adidas Originals 三叶草经典卫衣 黑色',
    description: '100%纯棉面料，舒适柔软。经典三叶草logo刺绣，宽松版型。适合春秋季节穿着，街头潮流必备单品。',
    price: 499,
    original_price: 699,
    stock: 120,
    category_id: CATEGORIES['服装鞋包'],
    images: ['https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Adicolor_Classics_Trefoil_Hoodie_Black_H06639_21_model.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'Levi\'s 501 Original 经典直筒牛仔裤 深蓝色',
    description: '经典501版型，直筒裤腿，中腰设计。100%纯棉丹宁布，耐穿耐洗。永不过时的经典款式，适合各种场合穿着。',
    price: 599,
    original_price: 799,
    stock: 90,
    category_id: CATEGORIES['服装鞋包'],
    images: ['https://lsco.scene7.com/is/image/lsco/005010114-front-pdp'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'Michael Kors Jet Set 女士单肩包 棕色',
    description: '优质PVC材质，搭配真皮饰边。多隔层设计，可放置手机、钱包等日常物品。经典MK logo，时尚百搭。',
    price: 1299,
    original_price: 1699,
    stock: 50,
    category_id: CATEGORIES['服装鞋包'],
    images: ['https://michaelkors.scene7.com/is/image/MichaelKors/30S3GTVT2B-0230'],
    status: 'active'
  },

  // 家居生活类
  {
    seller_id: SELLER_ID,
    name: '无印良品 懒人沙发 米白色 单人位',
    description: '可拆洗沙发套，内芯采用高密度海绵，舒适支撑。简约北欧风格，适合卧室、客厅使用。承重性好，经久耐用。',
    price: 899,
    original_price: 1299,
    stock: 40,
    category_id: CATEGORIES['家居生活'],
    images: ['https://img.muji.net/img/item/4550512685371_1260.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'IKEA 宜家 马尔姆 四斗抽屉柜 白色',
    description: '现代简约设计，四层大容量抽屉。优质刨花板材质，表面光滑易清洁。稳固耐用，适合卧室、客厅收纳衣物杂物。',
    price: 599,
    original_price: 799,
    stock: 35,
    category_id: CATEGORIES['家居生活'],
    images: ['https://www.ikea.cn/cn/zh/images/products/malm-chest-of-4-drawers-white__0484880_pe621374_s5.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: '德国双立人 不锈钢刀具五件套',
    description: '高碳不锈钢材质，锋利耐用。包含厨师刀、切片刀、多用刀、削皮刀和剪刀。人体工学手柄设计，握持舒适。专业厨房必备。',
    price: 1899,
    original_price: 2399,
    stock: 60,
    category_id: CATEGORIES['家居生活'],
    images: ['https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dw0e3c8e64/images/large/30768-000-0.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: '全棉时代纯棉四件套 简约条纹 1.8米床',
    description: '100%新疆长绒棉，A类婴儿级安全标准。包含被套、床单、2个枕套。亲肤透气，四季适用。多次水洗不起球不褪色。',
    price: 699,
    original_price: 999,
    stock: 70,
    category_id: CATEGORIES['家居生活'],
    images: ['https://cdn-fsly.yottaa.net/59b89c89bc8d3f0e388b4567/www.purcotton.com/v~4b.1a5/dyn/file/attachment/2023/01/07/1024x1024bb.jpg'],
    status: 'active'
  },

  // 食品生鲜类
  {
    seller_id: SELLER_ID,
    name: '良品铺子 每日坚果混合装 30袋',
    description: '精选夏威夷果、腰果、核桃仁、蔓越莓干等。每袋25g，独立小包装方便携带。无添加防腐剂，健康营养。',
    price: 129,
    original_price: 159,
    stock: 200,
    category_id: CATEGORIES['家居生活'], // 食品生鲜 mapped to 家居生活
    images: ['https://img.alicdn.com/imgextra/i1/2206609215489/O1CN01vMxK5w1K9rZqJxQYL_!!2206609215489.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: '三只松鼠 碧根果 奶油味 210g',
    description: '美国进口碧根果，颗颗饱满。奶香浓郁，香脆可口。罐装密封，锁鲜保脆。追剧必备零食。',
    price: 45,
    original_price: 59,
    stock: 300,
    category_id: CATEGORIES['家居生活'], // 食品生鲜 mapped to 家居生活
    images: ['https://gw.alicdn.com/imgextra/i1/2053469401/O1CN01RJoVJp2JQoaXtYqR6_!!2053469401.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: '农夫山泉 天然饮用水 550ml*12瓶',
    description: '取自千岛湖深层水源，天然弱碱性。不添加任何矿物质，自然纯净。运动健身、日常饮用首选。',
    price: 28,
    original_price: 35,
    stock: 500,
    category_id: CATEGORIES['家居生活'], // 食品生鲜 mapped to 家居生活
    images: ['https://nongfuspring.oss-cn-hangzhou.aliyuncs.com/upload/image/20200101/1577851200000.jpg'],
    status: 'active'
  },

  // 美妆个护类
  {
    seller_id: SELLER_ID,
    name: '雅诗兰黛小棕瓶精华液 50ml',
    description: '经典修护精华，改善肌肤细纹、暗沉。专利修护科技，深层滋养肌肤。适合各种肤质，早晚使用效果更佳。',
    price: 899,
    original_price: 1080,
    stock: 80,
    category_id: CATEGORIES['家居生活'], // 美妆个护 mapped to 家居生活
    images: ['https://www.esteelauder.com.cn/media/export/cms/products/558x768/el_sku_JJP001_558x768_0.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'SK-II 神仙水 230ml',
    description: '含Pitera™酵母精华，调理肌肤纹理。改善暗沉，提亮肤色。日本进口，经典护肤必备。',
    price: 1599,
    original_price: 1890,
    stock: 60,
    category_id: CATEGORIES['家居生活'], // 美妆个护 mapped to 家居生活
    images: ['https://www.sk-ii.com.cn/dw/image/v2/BJJL_PRD/on/demandware.static/-/Sites-sk2-master-catalog/default/dw0a3b0d3c/packshots/99350090399_1.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'MAC 魅可子弹头口红 Chili色号',
    description: '经典复古红棕色，适合秋冬季节。丝绒哑光质地，显色度高，持久不脱色。专业彩妆品牌，明星推荐色号。',
    price: 190,
    original_price: 210,
    stock: 150,
    category_id: CATEGORIES['家居生活'], // 美妆个护 mapped to 家居生活
    images: ['https://www.maccosmetics.com.cn/media/export/cms/products/640x600/mac_sku_M2CG01_640x600_0.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: '欧莱雅紫熨斗眼霜 15ml',
    description: '抗皱紧致，淡化细纹黑眼圈。含视黄醇和咖啡因成分。质地清爽易吸收，早晚使用改善眼周肌肤。',
    price: 269,
    original_price: 329,
    stock: 100,
    category_id: CATEGORIES['家居生活'], // 美妆个护 mapped to 家居生活
    images: ['https://www.lorealparis.com.cn/-/media/project/loreal/brand-sites/oap/apac/cn/products/skin-care/revitalift/revitalift-filler/eye-cream/packshot_eye_cream.jpg'],
    status: 'active'
  },

  // 运动户外类
  {
    seller_id: SELLER_ID,
    name: 'Lululemon 女士运动紧身裤 黑色',
    description: 'Nulu™面料，轻盈贴身，四向弹力。高腰设计，提臀收腹。透气排汗，瑜伽健身必备。',
    price: 750,
    original_price: 850,
    stock: 90,
    category_id: CATEGORIES['运动户外'],
    images: ['https://images.lululemon.com/is/image/lululemon/LW5CWNS_028646_1'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'Decathlon 迪卡侬专业瑜伽垫 6mm',
    description: 'NBR材质，防滑耐磨。6mm厚度提供良好缓冲保护。双面防滑纹理，初学者友好。附赠背带，方便携带。',
    price: 99,
    original_price: 129,
    stock: 200,
    category_id: CATEGORIES['运动户外'],
    images: ['https://contents.mediadecathlon.com/p1745146/k$7f3c0c4b5d0d4f8e9c7b1a2d3e4f5g6h/sq/yoga-mat-6mm-grey.jpg'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'Under Armour 男士运动T恤 速干透气',
    description: 'UA Tech™速干面料，快速排汗。松紧适中，运动不束缚。抗菌防臭，多色可选。',
    price: 199,
    original_price: 259,
    stock: 120,
    category_id: CATEGORIES['运动户外'],
    images: ['https://underarmour.scene7.com/is/image/Underarmour/1326799-001_DEFAULT'],
    status: 'active'
  },
  {
    seller_id: SELLER_ID,
    name: 'YETI 保温杯 26oz 不锈钢真空',
    description: '18/8不锈钢材质，双层真空隔热。保温保冷效果持久，冷饮24小时，热饮6小时。防漏设计，户外旅行必备。',
    price: 429,
    original_price: 499,
    stock: 80,
    category_id: CATEGORIES['运动户外'],
    images: ['https://www.yeti.com/dw/image/v2/BDRX_PRD/on/demandware.static/-/Sites-yeti-master-catalog/default/dw1a2b3c4d/images/drinkware/YRAMB26_black_quarter_turn_2400x1800.png'],
    status: 'active'
  }
]

async function addProducts() {
  console.log(`准备添加 ${products.length} 个商品...`)

  try {
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (error) {
      console.error('错误:', error)
      process.exit(1)
    }

    console.log(`✅ 成功添加 ${data.length} 个商品！`)
    console.log('商品列表:')
    data.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ¥${product.price}`)
    })
  } catch (err) {
    console.error('发生错误:', err)
    process.exit(1)
  }
}

addProducts()
