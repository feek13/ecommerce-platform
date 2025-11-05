// Temporary workaround: Direct fetch to Supabase REST API
// The Supabase JS SDK is hanging in the browser, so we use fetch directly

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Get user token from localStorage (where Supabase stores it)
function getUserToken(): string | null {
  try {
    const authData = localStorage.getItem('sb-' + SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token')
    if (authData) {
      const parsed = JSON.parse(authData)
      return parsed?.access_token || null
    }
  } catch (error) {
    console.warn('Failed to get user token:', error)
  }
  return null
}

// Clear expired token from localStorage
function clearExpiredToken() {
  try {
    const key = 'sb-' + SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token'
    localStorage.removeItem(key)
    console.log('Cleared expired token from localStorage')
  } catch (error) {
    console.warn('Failed to clear expired token:', error)
  }
}

async function supabaseFetch(endpoint: string, options: RequestInit = {}, retryWithAnonKey = true) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`

  // Use user token if available, otherwise use anon key
  const userToken = getUserToken()
  const authToken = userToken || SUPABASE_ANON_KEY

  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorText = await response.text()

    // Handle JWT expired error
    if (response.status === 401 && errorText.includes('JWT expired') && retryWithAnonKey && userToken) {
      console.warn('JWT token expired, clearing and retrying with anon key')
      clearExpiredToken()
      // Retry with anon key only (pass false to prevent infinite retry)
      return supabaseFetch(endpoint, options, false)
    }

    throw new Error(`Supabase fetch error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function getProducts(limit = 8) {
  return supabaseFetch(`products?status=eq.active&order=sales_count.desc&limit=${limit}`)
}

export async function getAllProducts(limit = 20) {
  return supabaseFetch(
    `products?status=eq.active&select=*,seller:profiles!products_seller_id_fkey(id,role,full_name)&order=created_at.desc&limit=${limit}`
  )
}

export async function getCategories(limit = 8) {
  return supabaseFetch(`categories?order=display_order.asc&limit=${limit}`)
}

export async function getProductById(id: string) {
  const data = await supabaseFetch(
    `products?id=eq.${id}&select=*,seller:profiles!products_seller_id_fkey(id,full_name,email,role),category:categories(id,name,slug)`
  )
  return data[0] || null
}

// Cart operations
export async function getCartItems(userId: string) {
  return supabaseFetch(
    `cart_items?user_id=eq.${userId}&select=*,product:products(id,name,price,images,stock,status)`
  )
}

export async function addCartItem(userId: string, productId: string, quantity: number) {
  return supabaseFetch('cart_items', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      quantity
    })
  })
}

export async function updateCartItem(itemId: string, quantity: number) {
  return supabaseFetch(`cart_items?id=eq.${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity })
  })
}

export async function removeCartItem(itemId: string) {
  return supabaseFetch(`cart_items?id=eq.${itemId}`, {
    method: 'DELETE'
  })
}

export async function clearCartItems(userId: string) {
  return supabaseFetch(`cart_items?user_id=eq.${userId}`, {
    method: 'DELETE'
  })
}
