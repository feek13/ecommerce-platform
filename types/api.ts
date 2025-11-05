import type { Product, Order, CartItem, Review } from './database'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}

export interface ProductListResponse extends PaginatedResponse<Product> {}

export interface ProductSearchFilters {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'created_at' | 'price_asc' | 'price_desc' | 'rating' | 'sales'
  page?: number
  perPage?: number
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string
    variantId?: string
    quantity: number
    price: number
    name: string
    image?: string
    sellerId: string
  }>
  shippingInfo: {
    name: string
    phone: string
    address: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  paymentMethod: 'alipay' | 'wechat' | 'credit_card'
}

export interface CreateReviewRequest {
  orderId: string
  productId: string
  rating: number
  content?: string
  images?: string[]
}

export interface UpdateOrderStatusRequest {
  status: Order['status']
  trackingNumber?: string
}
