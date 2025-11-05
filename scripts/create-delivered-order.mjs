import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Read .env.local
const envContent = readFileSync('.env.local', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    env[key.trim()] = value.trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY  // Use service role key to bypass RLS

const supabase = createClient(supabaseUrl, supabaseKey)

async function createDeliveredOrder() {
  try {
    // Get user with email why@gmail.com
    const { data: profiles, error: profileError} = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'why@gmail.com')
      .single()

    if (profileError) throw profileError
    
    const userId = profiles.id
    console.log('User ID:', userId)

    // Get a product to create order for
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name, price, images')
      .eq('status', 'active')
      .limit(1)
      .single()

    if (productError) throw productError
    
    console.log('Product:', products.name, '- Price:', products.price)

    // Create order with delivered status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: products.price,
        status: 'delivered',
        shipping_address: {
          name: 'Test User',
          phone: '13800138000',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '测试地址123号',
          postalCode: '518000'
        }
      })
      .select()
      .single()

    if (orderError) throw orderError

    console.log('Order created:', order.id)

    // Create order item
    const { data: orderItem, error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: products.id,
        quantity: 1,
        price: products.price
      })
      .select()

    if (itemError) throw itemError

    console.log('✅ Order item created successfully!')
    console.log('Order ID:', order.id, '| Status:', order.status)
    console.log('You can now test the review feature with this delivered order!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createDeliveredOrder()
