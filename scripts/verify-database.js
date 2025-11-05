// 验证数据库表是否存在的脚本
// 运行: node scripts/verify-database.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 加载环境变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量: NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyDatabase() {
  console.log('🔍 开始验证数据库...\n')

  try {
    // 检查 orders 表
    console.log('1️⃣ 检查 orders 表...')
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('count')
      .limit(1)

    if (ordersError) {
      console.error('❌ orders 表不存在或无法访问')
      console.error('错误详情:', ordersError.message)
      console.log('\n💡 请在 Supabase SQL Editor 中执行 database-schema-orders.sql 文件')
    } else {
      console.log('✅ orders 表存在')
    }

    // 检查 order_items 表
    console.log('\n2️⃣ 检查 order_items 表...')
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('count')
      .limit(1)

    if (itemsError) {
      console.error('❌ order_items 表不存在或无法访问')
      console.error('错误详情:', itemsError.message)
      console.log('\n💡 请在 Supabase SQL Editor 中执行 database-schema-orders.sql 文件')
    } else {
      console.log('✅ order_items 表存在')
    }

    // 检查 cart_items 表
    console.log('\n3️⃣ 检查 cart_items 表...')
    const { data: cartData, error: cartError } = await supabase
      .from('cart_items')
      .select('count')
      .limit(1)

    if (cartError) {
      console.error('❌ cart_items 表不存在或无法访问')
      console.error('错误详情:', cartError.message)
    } else {
      console.log('✅ cart_items 表存在')
    }

    // 检查 products 表
    console.log('\n4️⃣ 检查 products 表...')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .limit(3)

    if (productsError) {
      console.error('❌ products 表访问失败')
      console.error('错误详情:', productsError.message)
    } else {
      console.log(`✅ products 表存在，包含 ${productsData.length} 条记录（显示前3条）`)
      if (productsData.length > 0) {
        productsData.forEach(p => console.log(`   - ${p.name} (ID: ${p.id})`))
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📋 验证完成！')
    console.log('='.repeat(60))

    if (ordersError || itemsError) {
      console.log('\n⚠️ 发现问题：')
      console.log('请执行以下步骤修复：')
      console.log('1. 登录 Supabase Dashboard: https://supabase.com/dashboard')
      console.log('2. 进入你的项目')
      console.log('3. 点击左侧 "SQL Editor"')
      console.log('4. 创建新查询并粘贴 database-schema-orders.sql 的内容')
      console.log('5. 点击 "Run" 执行 SQL')
      console.log('6. 再次运行此脚本验证')
    } else {
      console.log('\n✅ 所有必需的表都已正确设置！')
    }

  } catch (error) {
    console.error('❌ 验证过程出错:', error)
  }
}

verifyDatabase()
