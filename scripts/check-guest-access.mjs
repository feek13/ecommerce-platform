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

console.log('🔍 Testing guest access to products...\n')

async function checkGuestAccess() {
  try {
    // 1. Check if we can read products
    console.log('1️⃣ Testing product access...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .limit(5)

    if (productsError) {
      console.error('❌ Error reading products:', productsError.message)
      console.log('\n💡 This means RLS policies are blocking guest access!')
      console.log('📝 Solution: Execute this SQL in Supabase SQL Editor:\n')
      console.log(`
-- Allow guest access to products
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (status = 'active');
      `)
    } else {
      console.log(`✅ Products accessible: Found ${products?.length || 0} products`)
      if (products && products.length > 0) {
        console.log('   Sample product:', products[0].name)
      } else {
        console.log('⚠️  No products found in database')
        console.log('💡 Run: node scripts/add-50-products.mjs')
      }
    }

    // 2. Check categories
    console.log('\n2️⃣ Testing category access...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)

    if (categoriesError) {
      console.error('❌ Error reading categories:', categoriesError.message)
      console.log('\n💡 Execute this SQL in Supabase:\n')
      console.log(`
DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);
      `)
    } else {
      console.log(`✅ Categories accessible: Found ${categories?.length || 0} categories`)
    }

    // 3. Check profiles (for seller info)
    console.log('\n3️⃣ Testing profile access...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .limit(5)

    if (profilesError) {
      console.error('❌ Error reading profiles:', profilesError.message)
      console.log('\n💡 Execute this SQL in Supabase:\n')
      console.log(`
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
CREATE POLICY "Public can view profiles"
  ON profiles FOR SELECT
  USING (true);
      `)
    } else {
      console.log(`✅ Profiles accessible: Found ${profiles?.length || 0} profiles`)
    }

    console.log('\n' + '='.repeat(60))
    console.log('Summary:')
    console.log('='.repeat(60))

    const hasProducts = products && products.length > 0
    const canAccessProducts = !productsError
    const canAccessCategories = !categoriesError
    const canAccessProfiles = !profilesError

    if (canAccessProducts && canAccessCategories && canAccessProfiles) {
      if (hasProducts) {
        console.log('✅ Guest access is working correctly!')
        console.log('✅ Products are visible to guests')
      } else {
        console.log('⚠️  Guest access is configured, but no products exist')
        console.log('💡 Add products: node scripts/add-50-products.mjs')
      }
    } else {
      console.log('❌ Guest access is NOT working')
      console.log('\n📝 Execute the SQL statements above in Supabase SQL Editor')
      console.log('   or run: supabase/migrations/003_public_access.sql')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkGuestAccess()
