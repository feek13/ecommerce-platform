import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Load environment variables from .env.local
let supabaseUrl, supabaseAnonKey

try {
  const envContent = readFileSync('.env.local', 'utf-8')
  const lines = envContent.split('\n')

  for (const line of lines) {
    const [key, ...valueParts] = line.split('=')
    const value = valueParts.join('=').trim()

    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      supabaseUrl = value
    } else if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      supabaseAnonKey = value
    }
  }
} catch (error) {
  console.error('❌ Error reading .env.local:', error.message)
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Create a client with ANON key (simulating guest access)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Checking product data integrity...\n')

async function checkProductData() {
  try {
    // Fetch products exactly as the homepage does
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('sales_count', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ Error fetching products:', error.message)
      return
    }

    console.log(`✅ Found ${products.length} active products\n`)

    if (products.length === 0) {
      console.log('⚠️  No active products found!')
      console.log('💡 Add products: node scripts/add-50-products.mjs\n')
      return
    }

    // Check each product for required fields
    products.forEach((product, index) => {
      console.log(`\n📦 Product ${index + 1}: ${product.name || 'UNNAMED'}`)
      console.log('   ID:', product.id)
      console.log('   Name:', product.name || '❌ MISSING')
      console.log('   Price:', product.price !== null && product.price !== undefined ? `¥${product.price}` : '❌ MISSING')
      console.log('   Status:', product.status || '❌ MISSING')
      console.log('   Stock:', product.stock !== null && product.stock !== undefined ? product.stock : '❌ MISSING')
      console.log('   Images:', product.images && product.images.length > 0 ? `${product.images.length} images` : '⚠️  No images')
      console.log('   Seller ID:', product.seller_id || '❌ MISSING')
      console.log('   Category ID:', product.category_id || '⚠️  No category')

      // Check for potential issues
      const issues = []
      if (!product.name) issues.push('Missing name')
      if (product.price === null || product.price === undefined) issues.push('Missing price')
      if (!product.status) issues.push('Missing status')
      if (product.stock === null || product.stock === undefined) issues.push('Missing stock')
      if (!product.images || product.images.length === 0) issues.push('No images')
      if (!product.seller_id) issues.push('Missing seller_id')

      if (issues.length > 0) {
        console.log('   ⚠️  Issues:', issues.join(', '))
      } else {
        console.log('   ✅ All required fields present')
      }
    })

    console.log('\n' + '='.repeat(60))
    console.log('Summary:')
    console.log('='.repeat(60))
    console.log(`Total active products: ${products.length}`)

    const hasIssues = products.some(p =>
      !p.name || p.price === null || p.price === undefined || !p.status || p.stock === null || p.stock === undefined
    )

    if (hasIssues) {
      console.log('\n⚠️  Some products have missing required fields')
      console.log('💡 These products may not display correctly on the website')
    } else {
      console.log('\n✅ All products have required fields')
      console.log('✅ Products should display correctly for guests')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkProductData()
