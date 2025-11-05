import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// 获取用户31的ID作为卖家
async function getSellerId() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('full_name', '31')
    .single()

  return profiles?.id
}

// 获取分类ID
async function getCategoryId(slug) {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  return category?.id
}

async function main() {
  console.log('🚀 开始添加商品...')

  const sellerId = await getSellerId()
  if (!sellerId) {
    console.error('❌ 找不到卖家ID')
    return
  }

  // 获取所有分类ID
  const electronicsId = await getCategoryId('electronics')
  const fashionId = await getCategoryId('fashion')
  const homeId = await getCategoryId('home')
  const booksId = await getCategoryId('books')
  const sportsId = await getCategoryId('sports')

  // 电子产品
  const electronicsProducts = [
    {
      seller_id: sellerId,
      category_id: electronicsId,
      name: 'iPad Pro 12.9英寸 M2芯片',
      description: '配备 M2 芯片的 iPad Pro，性能强劲，支持 Apple Pencil 悬停功能。配备原彩显示 Liquid Retina XDR 显示屏。',
      price: 9299,
      original_price: 10299,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: electronicsId,
      name: '戴尔 XPS 15 笔记本电脑',
      description: 'Intel Core i7-13700H 处理器，NVIDIA GeForce RTX 4050 显卡，16GB内存，512GB固态硬盘。',
      price: 12999,
      original_price: 14999,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: electronicsId,
      name: '罗技 MX Master 3S 无线鼠标',
      description: '静音点击，8K DPI传感器，支持多设备切换，人体工学设计。',
      price: 799,
      original_price: 899,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: electronicsId,
      name: 'GoPro HERO12 Black 运动相机',
      description: '5.3K60视频录制，HyperSmooth 6.0增强防抖，10米防水。',
      price: 3498,
      original_price: 3998,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: electronicsId,
      name: 'DJI Mini 3 Pro 无人机',
      description: '轻巧便携，4K/60fps视频，智能跟随，避障系统，34分钟续航。',
      price: 4788,
      original_price: 5288,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800'],
      status: 'active'
    }
  ]

  // 服装鞋包
  const fashionProducts = [
    {
      seller_id: sellerId,
      category_id: fashionId,
      name: 'The North Face 羽绒服',
      description: '700蓬松度鹅绒填充，防水面料，保暖舒适。',
      price: 1899,
      original_price: 2499,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: fashionId,
      name: 'Ray-Ban 雷朋太阳镜经典款',
      description: '经典飞行员款式，偏光镜片，100%UV防护。',
      price: 1290,
      original_price: 1590,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: fashionId,
      name: 'Timberland 经典黄靴',
      description: '防水牛皮革，橡胶大底，舒适耐磨。',
      price: 1599,
      original_price: 1899,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1542840843-3349799cded6?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: fashionId,
      name: 'Gap 经典卫衣',
      description: '纯棉面料，舒适柔软，经典Logo设计。',
      price: 299,
      original_price: 399,
      stock: 150,
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: fashionId,
      name: 'Michael Kors 女士手提包',
      description: '十字纹牛皮，多功能隔层，时尚百搭。',
      price: 2199,
      original_price: 2899,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
      status: 'active'
    }
  ]

  // 家居生活
  const homeProducts = [
    {
      seller_id: sellerId,
      category_id: homeId,
      name: 'Dyson V15 Detect 吸尘器',
      description: '激光探测技术，HEPA过滤，60分钟续航。',
      price: 4490,
      original_price: 4990,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: homeId,
      name: 'Nespresso 咖啡机',
      description: '19bar压力萃取，一键制作意式浓缩咖啡。',
      price: 1299,
      original_price: 1599,
      stock: 55,
      images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: homeId,
      name: 'MUJI 无印良品 简约床品四件套',
      description: '100%纯棉，亲肤透气，简约设计。',
      price: 599,
      original_price: 799,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: homeId,
      name: 'Le Creuset 铸铁锅 24cm',
      description: '珐琅涂层，均匀受热，适合炖煮烘焙。',
      price: 1890,
      original_price: 2290,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: homeId,
      name: 'Philips 空气炸锅',
      description: '4.1L大容量，Rapid Air技术，少油健康烹饪。',
      price: 899,
      original_price: 1199,
      stock: 70,
      images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'],
      status: 'active'
    }
  ]

  // 图书音像
  const booksProducts = [
    {
      seller_id: sellerId,
      category_id: booksId,
      name: '《深度学习》Goodfellow',
      description: 'Ian Goodfellow等著，深度学习领域的经典教材。',
      price: 168,
      original_price: 198,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: booksId,
      name: '《福尔摩斯探案全集》',
      description: '柯南·道尔经典侦探小说，全新中英双语版。',
      price: 128,
      original_price: 168,
      stock: 120,
      images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: booksId,
      name: '《小王子》精装版',
      description: '圣埃克苏佩里著，精美插图，收藏版。',
      price: 68,
      original_price: 88,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: booksId,
      name: 'Taylor Swift - 1989 (Taylor\'s Version) CD',
      description: '泰勒重录版专辑，收录额外曲目。',
      price: 128,
      original_price: 158,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1619983081563-430f63602796?w=800'],
      status: 'active'
    }
  ]

  // 运动户外
  const sportsProducts = [
    {
      seller_id: sellerId,
      category_id: sportsId,
      name: 'Garmin Fenix 7 运动手表',
      description: 'GPS定位，心率监测，多种运动模式，18天续航。',
      price: 5280,
      original_price: 5980,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: sportsId,
      name: 'Wilson 网球拍专业款',
      description: '碳纤维材质，适合中高级球员，配网球包。',
      price: 1099,
      original_price: 1399,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: sportsId,
      name: 'Spalding NBA官方比赛用球',
      description: '真皮材质，室内外通用，官方认证。',
      price: 399,
      original_price: 499,
      stock: 90,
      images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
      status: 'active'
    },
    {
      seller_id: sellerId,
      category_id: sportsId,
      name: 'Osprey 登山背包 65L',
      description: '防水面料，透气背负系统，多隔层设计。',
      price: 1299,
      original_price: 1599,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1622260614927-1c0ff962c08d?w=800'],
      status: 'active'
    }
  ]

  // 合并所有商品
  const allProducts = [
    ...electronicsProducts,
    ...fashionProducts,
    ...homeProducts,
    ...booksProducts,
    ...sportsProducts
  ]

  console.log(`📦 准备插入 ${allProducts.length} 个商品...`)

  // 批量插入商品
  const { data, error } = await supabase
    .from('products')
    .insert(allProducts)
    .select()

  if (error) {
    console.error('❌ 插入失败:', error)
    return
  }

  console.log(`✅ 成功添加 ${data.length} 个商品！`)

  // 显示每个分类的商品数量
  console.log('\n📊 商品分类统计：')
  console.log(`- 电子产品: ${electronicsProducts.length} 个`)
  console.log(`- 服装鞋包: ${fashionProducts.length} 个`)
  console.log(`- 家居生活: ${homeProducts.length} 个`)
  console.log(`- 图书音像: ${booksProducts.length} 个`)
  console.log(`- 运动户外: ${sportsProducts.length} 个`)
}

main()
