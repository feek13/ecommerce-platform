'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  getCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCartItems
} from '@/lib/supabase-fetch'
import type { CartItem, Product } from '@/types/database'

type CartContextType = {
  items: CartItem[]
  itemCount: number
  total: number
  loading: boolean
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

export const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  total: 0,
  loading: true,
  addItem: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      console.log('🛒 Fetching cart with direct fetch...')
      const data = await getCartItems(user.id)
      console.log('✅ Cart loaded:', data?.length || 0, 'items')
      setItems(data || [])
    } catch (error) {
      console.error('❌ Error fetching cart:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  const addItem = async (productId: string, quantity = 1) => {
    if (!user) {
      console.error('User must be logged in to add items to cart')
      return
    }

    try {
      // Check if item already exists in cart
      const existingItem = items.find((item) => item.product_id === productId)

      if (existingItem) {
        // Update quantity
        console.log('📦 Updating existing cart item quantity...')
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        // Add new item
        console.log('➕ Adding new item to cart...')
        await addCartItem(user.id, productId, quantity)
        console.log('✅ Item added to cart')
        await fetchCart()
      }
    } catch (error) {
      console.error('❌ Error adding item to cart:', error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      console.log('🔄 Updating cart item quantity...')
      await updateCartItem(itemId, quantity)
      console.log('✅ Cart item quantity updated')

      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      )
    } catch (error) {
      console.error('❌ Error updating cart item:', error)
      throw error
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      console.log('🗑️ Removing item from cart...')
      await removeCartItem(itemId)
      console.log('✅ Item removed from cart')

      setItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error('❌ Error removing cart item:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      console.log('🧹 Clearing cart...')
      await clearCartItems(user.id)
      console.log('✅ Cart cleared')

      setItems([])
    } catch (error) {
      console.error('❌ Error clearing cart:', error)
      throw error
    }
  }

  const refreshCart = async () => {
    await fetchCart()
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => {
    const product = item.product as Product
    return sum + (product?.price || 0) * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
