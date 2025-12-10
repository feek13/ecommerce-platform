'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function deleteProductAction(productId: string, sellerId: string) {
  // Verify the product belongs to this seller
  const { data: product, error: fetchError } = await supabaseAdmin
    .from('products')
    .select('id, seller_id')
    .eq('id', productId)
    .single()

  if (fetchError || !product) {
    return { success: false, error: 'Product not found' }
  }

  if (product.seller_id !== sellerId) {
    return { success: false, error: 'Unauthorized: You do not own this product' }
  }

  // Soft delete by setting status to 'deleted'
  const { error } = await supabaseAdmin
    .from('products')
    .update({ status: 'deleted' })
    .eq('id', productId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateProductStatusAction(
  productId: string,
  sellerId: string,
  newStatus: 'active' | 'inactive'
) {
  // Verify the product belongs to this seller
  const { data: product, error: fetchError } = await supabaseAdmin
    .from('products')
    .select('id, seller_id')
    .eq('id', productId)
    .single()

  if (fetchError || !product) {
    return { success: false, error: 'Product not found' }
  }

  if (product.seller_id !== sellerId) {
    return { success: false, error: 'Unauthorized: You do not own this product' }
  }

  const { error } = await supabaseAdmin
    .from('products')
    .update({ status: newStatus })
    .eq('id', productId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
