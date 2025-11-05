import { useContext } from 'react'
import { CartContext } from '@/app/providers/CartProvider'

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Export CartContext for direct use if needed
export { CartContext }
