// 添加50个真实产品（每个分类10个）
// 使用商家账户登录后添加
// 运行: node scripts/add-50-products.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取环境变量
const envContent = readFileSync(join(__dirname, '../.env.local'), 'utf8')
const lines = envContent.split('\n')
let supabaseUrl, supabaseKey

for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim()
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim()
  }
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 分类 ID (从之前的查询结果)
const CATEGORIES = {
  electronics: 'e9a1fd00-af98-44d3-b85c-a8cfbbc40445',
  fashion: '5a45f6aa-9735-4cff-837d-ce0942f68682',
  home: '17865395-4c32-48e4-bc00-354d94db0fcf',
  books: 'd8fc92f1-ca05-4291-bc07-f0f2900e3c59',
  sports: 'a99fcdcf-2fd9-466d-8001-55afe9c3bdcb',
}

// 产品数据
const products = [
  // 1. 电子产品 (10个)
  {
    name: 'iPhone 16 Pro 256GB',
    description: 'A18 Pro芯片，钛金属设计，全天候显示屏，ProMotion自适应刷新率技术，4800万像素主摄，支持5G网络。',
    price: 7999,
    original_price: 8999,
    stock: 50,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1696446702094-ad6a16acbb78?w=800', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
  },
  {
    name: '小米14 Ultra 16GB+512GB',
    description: '骁龙8 Gen3处理器，徕卡专业光学镜头，2K AMOLED屏幕，120W快充，5000mAh大电池。',
    price: 6499,
    original_price: 6999,
    stock: 80,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
  },
  {
    name: '华为MatePad Pro 13.2英寸',
    description: '麒麟9000s芯片，13.2英寸柔性OLED屏幕，支持M-Pencil手写笔，HarmonyOS 4.0系统。',
    price: 5999,
    original_price: 6999,
    stock: 60,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
  },
  {
    name: 'MacBook Air M3 13英寸',
    description: 'M3芯片，8核CPU和10核GPU，8GB统一内存，512GB固态硬盘，18小时续航。',
    price: 9999,
    original_price: 10999,
    stock: 40,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
  },
  {
    name: '索尼Alpha 7 IV 全画幅微单',
    description: '3300万像素传感器，5轴防抖，4K 60p视频录制，693个相位检测对焦点，双卡槽设计。',
    price: 16999,
    original_price: 18999,
    stock: 25,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1606980619724-96b9d35a6611?w=800'],
  },
  {
    name: 'AirPods Pro 第二代',
    description: 'H2芯片，主动降噪，自适应通透模式，空间音频，最长6小时单次电池续航。',
    price: 1899,
    original_price: 1999,
    stock: 100,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800'],
  },
  {
    name: '戴尔XPS 15 笔记本电脑',
    description: '英特尔酷睿i7-13700H，16GB DDR5内存，512GB NVMe固态硬盘，15.6英寸4K OLED触控屏。',
    price: 11999,
    original_price: 13999,
    stock: 35,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
  },
  {
    name: '大疆Mini 4 Pro 无人机',
    description: '4K/60fps视频拍摄，全向避障系统，34分钟续航，智能跟随3.0，支持夜景模式。',
    price: 4788,
    original_price: 5299,
    stock: 45,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'],
  },
  {
    name: 'Nintendo Switch OLED版',
    description: '7英寸OLED屏幕，64GB存储，可连接电视，支持Joy-Con手柄，包含健身环大冒险游戏。',
    price: 2499,
    original_price: 2699,
    stock: 70,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800'],
  },
  {
    name: '小米手环8 Pro',
    description: '1.74英寸AMOLED屏幕，14天续航，150+运动模式，全天候血氧监测，5ATM防水。',
    price: 399,
    original_price: 499,
    stock: 150,
    category_id: CATEGORIES.electronics,
    images: ['https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800'],
  },

  // 2. 服装鞋包 (10个)
  {
    name: '优衣库 AIRism棉质T恤',
    description: '100%纯棉面料，AIRism科技吸湿排汗，多种纯色可选，四季百搭基础款，修身剪裁。',
    price: 99,
    original_price: 129,
    stock: 200,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
  },
  {
    name: 'ZARA 花卉印花连衣裙',
    description: '2025春夏新款，雪纺面料，V领设计，波西米亚风格，适合度假和日常穿搭。',
    price: 399,
    original_price: 599,
    stock: 80,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'],
  },
  {
    name: 'Nike Air Max 270 运动鞋',
    description: 'Max Air气垫，透气网眼鞋面，缓震中底，耐磨橡胶外底，多种配色可选。',
    price: 1199,
    original_price: 1399,
    stock: 60,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
  },
  {
    name: 'Adidas三叶草 运动套装',
    description: '经典三条纹设计，100%聚酯纤维，透气排汗，包含连帽卫衣和运动裤。',
    price: 699,
    original_price: 999,
    stock: 90,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
  },
  {
    name: 'COACH经典款单肩包',
    description: '进口牛皮材质，金属COACH标志，多隔层设计，可调节肩带，附防尘袋。',
    price: 2999,
    original_price: 3999,
    stock: 40,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
  },
  {
    name: 'Levi\'s 511修身牛仔裤',
    description: '经典五袋款，弹力丹宁面料，中腰修身设计，耐磨耐洗，多种洗水效果。',
    price: 599,
    original_price: 799,
    stock: 100,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1542272454315-7bfabf0c0e59?w=800'],
  },
  {
    name: 'H&M 白色衬衫',
    description: '100%棉质，商务休闲两用，经典版型，防皱处理，适合办公室和约会场合。',
    price: 249,
    original_price: 349,
    stock: 120,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800'],
  },
  {
    name: 'Under Armour运动内衣',
    description: 'HeatGear面料，高强度支撑，透气速干，防震设计，适合健身和跑步。',
    price: 299,
    original_price: 399,
    stock: 75,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
  },
  {
    name: 'Converse经典帆布鞋',
    description: '经典Chuck Taylor款式，帆布鞋面，橡胶鞋底，百搭休闲，多种颜色可选。',
    price: 329,
    original_price: 429,
    stock: 150,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'],
  },
  {
    name: 'Columbia哥伦比亚冲锋衣',
    description: 'Omni-Tech防水透气，可脱卸内胆，防风保暖，多个口袋设计，适合户外运动。',
    price: 1299,
    original_price: 1699,
    stock: 55,
    category_id: CATEGORIES.fashion,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
  },

  // 3. 家居生活 (10个)
  {
    name: 'MUJI无印良品 懒人沙发',
    description: '高密度海绵填充，可拆洗外套，人体工学设计，多种颜色可选，适合卧室和客厅。',
    price: 1299,
    original_price: 1699,
    stock: 50,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
  },
  {
    name: 'IKEA宜家 MALM抽屉柜',
    description: '北欧简约风格，优质刨花板，四层抽屉设计，承重强，多种颜色可选。',
    price: 799,
    original_price: 999,
    stock: 60,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'],
  },
  {
    name: '水星家纺 60支长绒棉四件套',
    description: '埃及长绒棉，60支高支高密，活性印染，包含被套、床单、2个枕套。',
    price: 899,
    original_price: 1299,
    stock: 80,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
  },
  {
    name: '双立人Twin Chef刀具套装',
    description: '德国进口，5件套含主厨刀、面包刀、砍骨刀、削皮刀、剪刀，附赠刀座。',
    price: 1599,
    original_price: 2199,
    stock: 40,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800'],
  },
  {
    name: '九阳破壁料理机',
    description: '2200W大功率，8叶精钢刀头，智能降噪，预约定时，支持豆浆、果汁、米糊等多种功能。',
    price: 799,
    original_price: 1099,
    stock: 70,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800'],
  },
  {
    name: '飞利浦空气炸锅',
    description: '4.1L大容量，智能触控面板，360°热空气循环，少油健康，可烤可煎可烘焙。',
    price: 699,
    original_price: 999,
    stock: 90,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1585659722604-1a8d2cf79b87?w=800'],
  },
  {
    name: '美的智能扫地机器人',
    description: 'LDS激光导航，3000Pa吸力，自动回充，智能规划路线，支持APP远程控制。',
    price: 1499,
    original_price: 1999,
    stock: 55,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'],
  },
  {
    name: '网易严选纯棉毛巾6条装',
    description: '新疆长绒棉，A类婴儿级，柔软吸水，抑菌除螨，多种颜色组合。',
    price: 129,
    original_price: 199,
    stock: 200,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1600456899121-68eda5705257?w=800'],
  },
  {
    name: '松下吹风机负离子护发',
    description: '纳米水离子技术，快速干发，3档风速调节，冷热风切换，低噪音设计。',
    price: 599,
    original_price: 799,
    stock: 85,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'],
  },
  {
    name: '小米台灯Pro',
    description: '无蓝光伤害，Ra95高显色，四轴调节，支持米家APP控制，阅读和电脑模式。',
    price: 199,
    original_price: 299,
    stock: 120,
    category_id: CATEGORIES.home,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
  },

  // 4. 图书音像 (10个)
  {
    name: '《三体》全集（纪念版）',
    description: '刘慈欣科幻巨作，雨果奖获奖作品，精装典藏版，包含三体、黑暗森林、死神永生。',
    price: 129,
    original_price: 168,
    stock: 100,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
  },
  {
    name: '《百年孤独》马尔克斯',
    description: '诺贝尔文学奖作品，魔幻现实主义代表作，新译本，精装收藏版。',
    price: 59,
    original_price: 79,
    stock: 150,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'],
  },
  {
    name: '《人类简史》尤瓦尔·赫拉利',
    description: '从动物到上帝的人类进化史，畅销全球，启迪思维的历史读物。',
    price: 68,
    original_price: 88,
    stock: 120,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800'],
  },
  {
    name: '《活着》余华',
    description: '当代文学经典，感人至深的生命力作品，茅盾文学奖获奖作品。',
    price: 39,
    original_price: 52,
    stock: 180,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=800'],
  },
  {
    name: 'Kindle Paperwhite电子书阅读器',
    description: '6.8英寸无眩光屏幕，IPX8防水，20周续航，支持Audible有声书，16GB存储。',
    price: 998,
    original_price: 1198,
    stock: 60,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'],
  },
  {
    name: '泰勒·斯威夫特《Midnights》黑胶唱片',
    description: '2025年格莱美获奖专辑，180克重黑胶，附赠精美歌词本和海报。',
    price: 299,
    original_price: 399,
    stock: 50,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800'],
  },
  {
    name: '《原则》瑞·达利欧',
    description: '全球畅销书，桥水基金创始人的人生和工作原则，精装中文版。',
    price: 89,
    original_price: 119,
    stock: 90,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1553729784-e91953dec042?w=800'],
  },
  {
    name: '《哈利·波特》全集（新版）',
    description: 'J.K.罗琳魔法世界经典，7本全集珍藏版，精美插图，适合收藏和阅读。',
    price: 399,
    original_price: 560,
    stock: 70,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=800'],
  },
  {
    name: '《经济学原理》曼昆（第8版）',
    description: '全球最畅销的经济学教材，微观经济学和宏观经济学双册，附赠在线学习资源。',
    price: 168,
    original_price: 228,
    stock: 55,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800'],
  },
  {
    name: 'BBC纪录片《地球脉动III》蓝光碟',
    description: '4K超高清画质，5.1环绕声，中英双语字幕，收录8集完整内容和幕后花絮。',
    price: 199,
    original_price: 299,
    stock: 65,
    category_id: CATEGORIES.books,
    images: ['https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800'],
  },

  // 5. 运动户外 (10个)
  {
    name: 'Lululemon瑜伽垫',
    description: '5mm厚度，天然橡胶材质，双面防滑，轻量便携，附赠收纳袋。',
    price: 498,
    original_price: 698,
    stock: 80,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
  },
  {
    name: '迪卡侬专业跑步鞋',
    description: 'Kalenji系列，轻量透气，缓震中底，耐磨外底，适合日常训练和马拉松。',
    price: 399,
    original_price: 599,
    stock: 100,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
  },
  {
    name: 'Keep智能动感单车',
    description: '磁控静音，可调节座椅和把手，配合Keep APP使用，实时数据监测，承重150kg。',
    price: 1999,
    original_price: 2699,
    stock: 45,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800'],
  },
  {
    name: '李宁羽毛球拍对拍套装',
    description: '全碳素材质，攻守兼备，附赠2个羽毛球和球包，适合初中级选手。',
    price: 499,
    original_price: 799,
    stock: 70,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'],
  },
  {
    name: 'The North Face双肩登山包50L',
    description: '防水尼龙面料，多隔层设计，透气背负系统，登山杖固定，适合3-5天徒步。',
    price: 1299,
    original_price: 1799,
    stock: 50,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800'],
  },
  {
    name: '迪卡侬自动充气帐篷',
    description: '3-4人家庭帐篷，一键自动搭建，防雨防晒，双层通风，附赠地钉和防潮垫。',
    price: 899,
    original_price: 1299,
    stock: 40,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'],
  },
  {
    name: '威尔胜篮球NBA官方用球',
    description: '7号标准篮球，PU材质，耐磨防滑，室内外两用，NBA官方认证。',
    price: 299,
    original_price: 399,
    stock: 120,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
  },
  {
    name: 'YETI保温水壶1L',
    description: '双层真空不锈钢，24小时保冷/12小时保热，防漏设计，适合户外运动。',
    price: 399,
    original_price: 599,
    stock: 90,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'],
  },
  {
    name: '骆驼户外冲锋衣',
    description: '三合一可拆卸设计，防风防水，抓绒内胆，多个口袋，适合登山和徒步。',
    price: 699,
    original_price: 999,
    stock: 65,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
  },
  {
    name: '海德网球拍单拍',
    description: '碳纤维拍框，中等平衡点，适合进阶选手，附赠网球包和避震器。',
    price: 899,
    original_price: 1299,
    stock: 55,
    category_id: CATEGORIES.sports,
    images: ['https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'],
  },
]

async function addProducts() {
  console.log('🔐 使用商家账户登录...\n')

  // 1. 使用商家账户登录
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'why@gmail.com',
    password: '123456',
  })

  if (authError) {
    console.error('❌ 登录失败:', authError.message)
    return
  }

  console.log('✅ 登录成功！用户:', authData.user.email)

  // 2. 获取用户profile信息
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, email')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    console.error('❌ 获取用户信息失败')
    return
  }

  console.log(`✅ 用户角色: ${profile.role}`)

  if (profile.role !== 'seller') {
    console.error('❌ 该账户不是商家账户，无法添加产品')
    return
  }

  console.log(`\n🚀 开始添加50个产品...\n`)

  const seller_id = profile.id
  let successCount = 0
  let failCount = 0

  for (const product of products) {
    try {
      const { error } = await supabase.from('products').insert({
        ...product,
        seller_id,
        status: 'active',
      })

      if (error) {
        console.error(`❌ 添加失败: ${product.name}`)
        console.error(`   错误: ${error.message}`)
        failCount++
      } else {
        console.log(`✅ ${product.name}`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ 添加失败: ${product.name}`, err)
      failCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 添加完成！`)
  console.log(`   成功: ${successCount} 个`)
  console.log(`   失败: ${failCount} 个`)
  console.log('='.repeat(60))

  // 3. 登出
  await supabase.auth.signOut()
  console.log('\n✅ 已登出')
}

addProducts()
