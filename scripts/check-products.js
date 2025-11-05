// 检查数据库中的商品数量
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取 .env.local
const envPath = join(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.+)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('🔍 检查数据库状态...\n')

  // 检查商品
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, status, seller_id')
    .limit(10)

  if (productsError) {
    console.error('❌ 查询商品失败:', productsError.message)
  } else {
    console.log(`📦 商品总数: ${products?.length || 0}`)
    if (products && products.length > 0) {
      console.log('\n前 10 个商品:')
      products.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name} (status: ${p.status})`)
      })
    }
  }

  // 检查活跃商品
  const { data: activeProducts } = await supabase
    .from('products')
    .select('id')
    .eq('status', 'active')

  console.log(`\n✅ 活跃商品数: ${activeProducts?.length || 0}`)

  // 检查分类
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('display_order')

  console.log(`\n📂 分类数: ${categories?.length || 0}`)
  if (categories && categories.length > 0) {
    console.log('\n分类列表:')
    categories.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name} (${c.slug}) - ID: ${c.id}`)
    })
  }

  // 检查卖家
  const { data: sellers } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('role', 'seller')

  console.log(`\n👤 卖家数: ${sellers?.length || 0}`)
  if (sellers && sellers.length > 0) {
    console.log('\n卖家列表:')
    sellers.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.email} - ID: ${s.id}`)
    })
  }

  // 如果没有商品，生成 SQL 脚本
  if (!products || products.length === 0) {
    console.log('\n\n⚠️  数据库中没有商品！')
    console.log('\n请执行以下步骤添加商品：')
    console.log('1. 打开 Supabase Dashboard → SQL Editor')
    console.log('2. 复制以下 SQL 并执行:\n')

    if (sellers && sellers.length > 0 && categories && categories.length > 0) {
      const sellerId = sellers[0].id
      const categoryMap = {}
      categories.forEach(c => {
        categoryMap[c.slug] = c.id
      })

      console.log(`-- 使用卖家: ${sellers[0].email}`)
      console.log(`-- seller_id: ${sellerId}\n`)

      if (categoryMap['electronics']) {
        console.log(`-- 电子产品 (category_id: ${categoryMap['electronics']})`)
        console.log(`INSERT INTO products (seller_id, name, description, price, original_price, stock, category_id, images, status, sales_count) VALUES`)
        console.log(`('${sellerId}', 'MacBook Pro 14英寸 M3 Pro芯片', 'Apple M3 Pro 芯片，18GB统一内存，512GB SSD存储。强大性能，续航持久。', 14999, 16999, 30, '${categoryMap['electronics']}', ARRAY['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp14-spacegray-select-202310'], 'active', 120),`)
        console.log(`('${sellerId}', 'iPad Air 第5代 10.9英寸', 'Apple M1芯片，10.9英寸Liquid Retina显示屏，轻薄便携，性能强劲。', 4399, 4799, 60, '${categoryMap['electronics']}', ARRAY['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/ipad-air-select-wifi-blue-202203'], 'active', 85),`)
        console.log(`('${sellerId}', 'AirPods Pro 第2代', '主动降噪，通透模式，自适应音频。H2芯片带来更强大的降噪体验。', 1899, 1999, 100, '${categoryMap['electronics']}', ARRAY['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MQD83'], 'active', 200);\n`)
      }
    } else {
      console.log('⚠️  请先确保数据库中有：')
      if (!sellers || sellers.length === 0) console.log('  - 至少一个卖家账户 (role = seller)')
      if (!categories || categories.length === 0) console.log('  - 商品分类数据')
    }
  }
}

main()
