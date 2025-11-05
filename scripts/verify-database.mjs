// 验证数据库表是否存在的脚本
// 运行: node scripts/verify-database.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 读取 .env.local 文件
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let supabaseUrl, supabaseKey

try {
  const envContent = readFileSync(join(__dirname, '../.env.local'), 'utf8')
  const lines = envContent.split('\n')

  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim()
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim()
    }
  }
} catch (error) {
  console.error('❌ 无法读取 .env.local 文件')
  process.exit(1)
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量: NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyDatabase() {
  console.log('🔍 开始验证数据库...\n')

  const results = {
    orders: false,
    order_items: false,
    cart_items: false,
    products: false,
  }

  try {
    // 检查 orders 表
    console.log('1️⃣ 检查 orders 表...')
    const { error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1)

    if (ordersError) {
      console.error('❌ orders 表不存在或无法访问')
      console.error('   错误:', ordersError.message)
    } else {
      console.log('✅ orders 表存在')
      results.orders = true
    }

    // 检查 order_items 表
    console.log('\n2️⃣ 检查 order_items 表...')
    const { error: itemsError } = await supabase
      .from('order_items')
      .select('id')
      .limit(1)

    if (itemsError) {
      console.error('❌ order_items 表不存在或无法访问')
      console.error('   错误:', itemsError.message)
    } else {
      console.log('✅ order_items 表存在')
      results.order_items = true
    }

    // 检查 cart_items 表
    console.log('\n3️⃣ 检查 cart_items 表...')
    const { error: cartError } = await supabase
      .from('cart_items')
      .select('id')
      .limit(1)

    if (cartError) {
      console.error('❌ cart_items 表不存在或无法访问')
      console.error('   错误:', cartError.message)
    } else {
      console.log('✅ cart_items 表存在')
      results.cart_items = true
    }

    // 检查 products 表
    console.log('\n4️⃣ 检查 products 表...')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .limit(3)

    if (productsError) {
      console.error('❌ products 表访问失败')
      console.error('   错误:', productsError.message)
    } else {
      console.log(`✅ products 表存在 (共 ${productsData.length} 条记录)`)
      results.products = true
    }

    console.log('\n' + '='.repeat(60))
    console.log('📋 验证完成！')
    console.log('='.repeat(60))

    if (!results.orders || !results.order_items) {
      console.log('\n⚠️ 发现问题：订单相关表缺失')
      console.log('\n修复步骤：')
      console.log('1. 登录 Supabase Dashboard: https://supabase.com/dashboard')
      console.log('2. 进入你的项目')
      console.log('3. 点击左侧 "SQL Editor"')
      console.log('4. 复制 database-schema-orders.sql 的内容')
      console.log('5. 粘贴到 SQL Editor 并点击 "Run"')
      console.log('6. 再次运行此脚本验证\n')
    } else {
      console.log('\n✅ 所有必需的表都已正确设置！')
      console.log('   现在可以正常创建订单了。\n')
    }

  } catch (error) {
    console.error('❌ 验证过程出错:', error.message)
  }
}

verifyDatabase()
