'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function CartPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { items, itemCount, total, loading, removeItem, updateQuantity } = useCart()
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#EAEDED]">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <h1 className="text-xl md:text-2xl font-normal text-gray-900 mb-4 md:mb-6">购物车</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded p-8 md:p-12 text-center">
            <div className="text-5xl md:text-6xl mb-3 md:mb-4">🛒</div>
            <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-2">您的购物车是空的</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">快去挑选心仪的商品吧！</p>
            <Link
              href="/products"
              className="inline-block px-6 md:px-8 py-2.5 md:py-3 bg-[#FF9900] text-gray-900 font-medium rounded hover:bg-[#F3A847] transition text-sm md:text-base"
            >
              去购物
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded">
                {/* Cart Header */}
                <div className="p-3 md:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm sm:text-base text-green-700 font-medium">免费配送</span>
                    <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">- 您的订单符合免费配送条件</span>
                  </div>
                  <Link href="/products" className="text-xs sm:text-sm text-[#007185] hover:underline">
                    继续购物
                  </Link>
                </div>

                {/* Cart Items List */}
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="p-3 md:p-4 hover:bg-gray-50 transition">
                      <div className="flex gap-3 md:gap-4">
                        {/* Product Image */}
                        <Link
                          href={`/products/${item.product_id}`}
                          className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white border border-gray-200 rounded overflow-hidden hover:opacity-75 transition"
                        >
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl md:text-4xl">
                              📦
                            </div>
                          )}
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product_id}`}
                            className="text-sm md:text-base text-gray-900 hover:text-[#C7511F] line-clamp-2 mb-1.5 md:mb-2 block"
                          >
                            {item.product?.name}
                          </Link>

                          {/* Stock Status */}
                          {item.product && (
                            <div className="text-sm mb-2">
                              {item.product.stock > 0 ? (
                                <span className="text-green-700 font-medium">有货</span>
                              ) : (
                                <span className="text-red-600 font-medium">缺货</span>
                              )}
                            </div>
                          )}

                          {/* Seller Warning */}
                          {item.product?.seller && item.product.seller.role !== 'seller' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2 inline-flex items-center gap-1 text-xs">
                              <span className="text-yellow-600">⚠️</span>
                              <span className="text-yellow-800">商家被审查中</span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="text-lg md:text-xl font-normal text-[#B12704] mb-2 md:mb-3">
                            ¥{item.product?.price.toFixed(2)}
                          </div>

                          {/* Quantity & Actions */}
                          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 sm:px-3 py-1 hover:bg-gray-100 transition text-sm"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQty = parseInt(e.target.value) || 1
                                  updateQuantity(item.id, Math.max(1, Math.min(item.product?.stock || 999, newQty)))
                                }}
                                className="w-12 sm:w-16 text-center border-0 text-sm focus:outline-none focus:ring-0"
                                min="1"
                                max={item.product?.stock}
                              />
                              <button
                                onClick={() => updateQuantity(item.id, Math.min(item.product?.stock || 999, item.quantity + 1))}
                                className="px-2 sm:px-3 py-1 hover:bg-gray-100 transition text-sm"
                                disabled={item.quantity >= (item.product?.stock || 0)}
                              >
                                +
                              </button>
                            </div>

                            <span className="text-gray-400 hidden sm:inline">|</span>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: '移除商品',
                                  message: '确定要从购物车中移除此商品吗？',
                                  onConfirm: () => {
                                    setConfirmDialog({ ...confirmDialog, isOpen: false })
                                    removeItem(item.id)
                                  }
                                })
                              }}
                              className="text-xs sm:text-sm text-[#007185] hover:underline"
                            >
                              删除
                            </button>
                          </div>
                        </div>

                        {/* Item Subtotal - Hidden on mobile, shown on desktop */}
                        <div className="text-right flex-shrink-0 hidden md:block">
                          <div className="text-xl font-normal text-gray-900">
                            ¥{((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-gray-600 mt-1">
                              {item.quantity} × ¥{item.product?.price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded p-3 md:p-4 sticky top-4">
                <div className="mb-3 md:mb-4">
                  <div className="flex justify-between text-base md:text-lg mb-2">
                    <span className="text-gray-700">小计 ({itemCount} 件商品):</span>
                    <span className="font-normal text-gray-900">¥{total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-green-700 mb-2 md:mb-3">
                    <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    免费配送
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F7CA00] text-gray-900 text-center font-medium py-2.5 md:py-2 rounded-lg shadow-sm transition mb-3 text-sm md:text-base"
                >
                  去结算
                </Link>

                <div className="pt-2 md:pt-3 border-t border-gray-200">
                  <div className="flex items-start text-xs text-gray-600">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-1 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <div className="font-medium mb-0.5 md:mb-1">安全交易</div>
                      <div className="text-[10px] md:text-xs">支持多种支付方式</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
