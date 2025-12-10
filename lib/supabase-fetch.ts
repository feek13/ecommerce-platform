// Direct fetch to Supabase REST API with multi-session support
// Supports separate sessions for main site, seller, and admin sections

import { SessionType, getValidToken, clearToken } from './supabase-multi'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Fetch with session type support and automatic token refresh
async function supabaseFetch(
  endpoint: string,
  options: RequestInit = {},
  sessionType: SessionType = 'main',
  retryWithAnonKey = true
) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`

  // Get valid token (auto-refreshes if expired)
  const userToken = await getValidToken(sessionType)
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

    // Handle JWT expired error (shouldn't happen often with auto-refresh)
    if (response.status === 401 && errorText.includes('JWT expired') && retryWithAnonKey && userToken) {
      console.warn(`JWT token expired for ${sessionType}, clearing and retrying with anon key`)
      clearToken(sessionType)
      // Retry with anon key only (pass false to prevent infinite retry)
      return supabaseFetch(endpoint, options, sessionType, false)
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

export async function getProductsByCategory(categorySlug: string, limit = 50) {
  // First, get the category ID by slug
  const categories = await supabaseFetch(`categories?slug=eq.${categorySlug}`)
  if (!categories || categories.length === 0) {
    return []
  }

  const categoryId = categories[0].id

  // Then get products by category_id
  return supabaseFetch(
    `products?status=eq.active&category_id=eq.${categoryId}&select=*,seller:profiles!products_seller_id_fkey(id,role,full_name),category:categories(id,name,slug)&order=created_at.desc&limit=${limit}`
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

// Review operations
export async function submitReview(review: {
  product_id: string
  order_id: string
  user_id: string
  rating: number
  content?: string
  images: string[]
}) {
  return supabaseFetch('reviews', {
    method: 'POST',
    body: JSON.stringify(review)
  })
}

export async function getProductReviews(productId: string, limit = 20, offset = 0) {
  return supabaseFetch(
    `reviews?product_id=eq.${productId}&select=*,user:profiles!reviews_user_id_fkey(id,email,full_name,avatar_url)&order=created_at.desc&limit=${limit}&offset=${offset}`
  )
}

export async function getProductReviewStats(productId: string) {
  return supabaseFetch(
    `reviews?product_id=eq.${productId}&select=rating`
  )
}

export async function getUserReviews(userId: string) {
  return supabaseFetch(
    `reviews?user_id=eq.${userId}&select=*,product:products(id,name,images)&order=created_at.desc`
  )
}

export async function hasUserReviewedProduct(userId: string, productId: string, orderId: string) {
  const data = await supabaseFetch(
    `reviews?user_id=eq.${userId}&product_id=eq.${productId}&order_id=eq.${orderId}&select=id`
  )
  return data.length > 0
}

// Chat functions
export async function getChatConversations(userId: string) {
  return supabaseFetch(
    `conversations?or=(buyer_id.eq.${userId},seller_id.eq.${userId})&select=*,buyer:profiles!conversations_buyer_id_fkey(id,email,full_name,avatar_url),seller:profiles!conversations_seller_id_fkey(id,email,full_name,avatar_url),product:products!conversations_product_id_fkey(id,name,images)&order=updated_at.desc`
  )
}

export async function getConversationMessages(conversationId: string, limit = 50) {
  return supabaseFetch(
    `messages?conversation_id=eq.${conversationId}&select=*,sender:profiles!messages_sender_id_fkey(id,email,full_name,avatar_url)&order=created_at.asc&limit=${limit}`
  )
}

export async function sendChatMessage(message: {
  conversation_id: string
  sender_id: string
  content: string
}) {
  return supabaseFetch('messages', {
    method: 'POST',
    body: JSON.stringify(message)
  })
}

export async function createChatConversation(conversation: {
  buyer_id: string
  seller_id: string
  product_id: string
}) {
  return supabaseFetch('conversations', {
    method: 'POST',
    body: JSON.stringify(conversation)
  })
}

export async function markConversationAsRead(conversationId: string, userId: string) {
  // Mark all unread messages in this conversation from other users as read
  return supabaseFetch(`messages?conversation_id=eq.${conversationId}&sender_id=neq.${userId}&is_read=eq.false`, {
    method: 'PATCH',
    body: JSON.stringify({ is_read: true })
  })
}

// Admin: Seller application functions
export async function getSellerApplications(filter?: 'pending' | 'approved' | 'rejected', sessionType: SessionType = 'main') {
  let endpoint = `seller_applications?select=*,profiles!seller_applications_user_id_fkey(email,full_name)&order=created_at.desc`
  if (filter && filter !== 'all') {
    endpoint += `&status=eq.${filter}`
  }
  return supabaseFetch(endpoint, {}, sessionType)
}

export async function updateProfileRole(userId: string, role: string, sessionType: SessionType = 'main') {
  return supabaseFetch(`profiles?id=eq.${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ role })
  }, sessionType)
}

export async function updateSellerApplicationStatus(
  applicationId: string,
  status: 'approved' | 'rejected',
  reviewedAt: string,
  sessionType: SessionType = 'main'
) {
  return supabaseFetch(`seller_applications?id=eq.${applicationId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      reviewed_at: reviewedAt
    })
  }, sessionType)
}

// Seller: Product management functions
export async function getSellerProducts(sellerId: string, filter?: 'all' | 'active' | 'inactive', sessionType: SessionType = 'seller') {
  let endpoint = `products?seller_id=eq.${sellerId}&order=created_at.desc`
  if (filter && filter !== 'all') {
    endpoint += `&status=eq.${filter}`
  }
  return supabaseFetch(endpoint, {}, sessionType)
}

export async function updateProductStatus(productId: string, sellerId: string, status: string, sessionType: SessionType = 'seller') {
  return supabaseFetch(`products?id=eq.${productId}&seller_id=eq.${sellerId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }, sessionType)
}

export async function deleteProduct(productId: string, sellerId: string, sessionType: SessionType = 'seller') {
  return supabaseFetch(`products?id=eq.${productId}&seller_id=eq.${sellerId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'deleted' })
  }, sessionType)
}
