export type UserRole = 'user' | 'seller' | 'admin'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type ProductStatus = 'active' | 'inactive' | 'deleted'

export type SellerApplicationStatus = 'pending' | 'approved' | 'rejected'

export type MessageType = 'text' | 'image' | 'order_info'

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  role: UserRole
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  created_at: string
  updated_at: string
}

export interface SellerApplication {
  id: string
  user_id: string
  business_name: string
  business_type: string
  business_license?: string
  contact_person: string
  contact_phone: string
  status: SellerApplicationStatus
  reject_reason?: string
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  image_url?: string
  display_order: number
  created_at: string
}

export interface Product {
  id: string
  seller_id: string
  category_id?: string
  name: string
  description?: string
  price: number
  original_price?: number
  stock: number
  status: ProductStatus
  images: string[]
  views_count: number
  sales_count: number
  favorites_count: number
  rating_avg: number
  rating_count: number
  created_at: string
  updated_at: string
  seller?: Profile
  category?: Category
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price: number
  stock: number
  attributes: Record<string, any>
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id?: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
  variant?: ProductVariant
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  subtotal: number
  shipping_fee: number
  tax: number
  total: number
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_state?: string
  shipping_postal_code: string
  shipping_country: string
  payment_method?: string
  payment_status: PaymentStatus
  paid_at?: string
  tracking_number?: string
  shipped_at?: string
  delivered_at?: string
  cancelled_at?: string
  cancel_reason?: string
  refunded_at?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  seller_id: string
  product_id: string
  variant_id?: string
  product_name: string
  product_image?: string
  variant_name?: string
  price: number
  quantity: number
  subtotal: number
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  product_id: string
  order_id: string
  user_id: string
  rating: number
  content?: string
  images: string[]
  seller_reply?: string
  seller_replied_at?: string
  created_at: string
  updated_at: string
  user?: Profile
}

export interface Conversation {
  id: string
  buyer_id: string
  seller_id: string
  order_id?: string
  last_message?: string
  last_message_at?: string
  buyer_unread: number
  seller_unread: number
  created_at: string
  updated_at: string
  buyer?: Profile
  seller?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  type: MessageType
  is_read: boolean
  read_at?: string
  created_at: string
  sender?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  content: string
  related_id?: string
  is_read: boolean
  read_at?: string
  created_at: string
}
