'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Toast from '@/components/ui/Toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { items, total, clearCart } = useCart()

  const [processing, setProcessing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    postalCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('alipay')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
    if (!authLoading && user && items.length === 0) {
      router.push('/cart')
    }
  }, [user, authLoading, items, router])

  const shippingFee = total >= 99 ? 0 : 10
  const orderTotal = total + shippingFee

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreed) {
      setToast({ message: '请同意服务条款后继续', type: 'warning' })
      return
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      setToast({ message: '请填写完整的收货信息', type: 'warning' })
      return
    }

    setProcessing(true)

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: orderTotal,
          status: 'pending',
          shipping_address: shippingInfo,
        })
        .select()
        .single()

      if (orderError) {
        console.error('Order creation error:', orderError)
        throw new Error(orderError.message || '创建订单失败')
      }

      if (!order) {
        throw new Error('订单创建失败：未返回订单数据')
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items creation error:', itemsError)
        throw new Error(itemsError.message || '创建订单项失败')
      }

      // Clear cart
      await clearCart()

      // Simulate payment process (in real app, redirect to payment gateway)
      setToast({ message: '订单创建成功！正在跳转到支付页面...', type: 'success' })

      // Redirect to orders page
      setTimeout(() => {
        router.push('/orders')
      }, 1500)
    } catch (error: any) {
      console.error('Error creating order:', error)
      const errorMessage = error?.message || '订单创建失败，请重试'
      setToast({ message: errorMessage, type: 'error' })
      setProcessing(false)
    }
  }

  if (authLoading || !user || items.length === 0) {
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

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <h1 className="text-xl md:text-2xl font-normal text-gray-900 mb-4 md:mb-6">结算</h1>

        {/* Progress Indicator */}
        <div className="bg-white rounded p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF9900] text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span className="ml-1.5 sm:ml-2 font-medium text-gray-900 text-xs sm:text-sm md:text-base">确认订单</span>
            </div>
            <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="ml-1.5 sm:ml-2 text-gray-500 text-xs sm:text-sm md:text-base">支付</span>
            </div>
            <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="ml-1.5 sm:ml-2 text-gray-500 text-xs sm:text-sm md:text-base">完成</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Shipping & Payment */}
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded p-4 md:p-6">
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#FF9900] text-white flex items-center justify-center text-xs md:text-sm mr-1.5 md:mr-2">
                    1
                  </span>
                  收货地址
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-1.5">
                      收货人姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      placeholder="请输入收货人姓名"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-1.5">
                      手机号码 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      placeholder="请输入手机号码"
                      pattern="[0-9]{11}"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-1.5">省份</label>
                    <input
                      type="text"
                      value={shippingInfo.province}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, province: e.target.value })}
                      className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      placeholder="如：广东省"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-1.5">城市</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      placeholder="如：深圳市"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-1.5">区/县</label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                      className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      placeholder="如：南山区"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-1.5">邮政编码</label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      placeholder="如：518000"
                      pattern="[0-9]{6}"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-1.5">
                      详细地址 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      rows={3}
                      placeholder="请输入详细地址，如街道、门牌号等"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded p-4 md:p-6">
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#FF9900] text-white flex items-center justify-center text-xs md:text-sm mr-1.5 md:mr-2">
                    2
                  </span>
                  支付方式
                </h2>

                <div className="space-y-2 md:space-y-3">
                  {[
                    { id: 'alipay', name: '支付宝', icon: '💳' },
                    { id: 'wechat', name: '微信支付', icon: '💚' },
                    { id: 'unionpay', name: '银联支付', icon: '🏦' },
                    { id: 'creditcard', name: '信用卡/借记卡', icon: '💳' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 md:p-4 border-2 rounded cursor-pointer transition active:bg-orange-50 ${
                        paymentMethod === method.id
                          ? 'border-[#FF9900] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900]"
                      />
                      <span className="ml-2 md:ml-3 text-xl md:text-2xl">{method.icon}</span>
                      <span className="ml-1.5 md:ml-2 font-medium text-gray-900 text-sm md:text-base">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Review */}
              <div className="bg-white rounded p-4 md:p-6">
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#FF9900] text-white flex items-center justify-center text-xs md:text-sm mr-1.5 md:mr-2">
                    3
                  </span>
                  订单明细
                </h2>

                <div className="space-y-2 md:space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 md:gap-3 py-2 border-b last:border-b-0">
                      <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white border border-gray-200 rounded overflow-hidden">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product?.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg md:text-xl">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs md:text-sm text-gray-900 line-clamp-2 mb-1">
                          {item.product?.name}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-600">
                          ¥{item.product?.price.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm font-medium text-gray-900 flex-shrink-0">
                        ¥{((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded p-4 md:p-5 lg:p-6 lg:sticky lg:top-4">
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">订单汇总</h2>

                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4 pb-3 md:pb-4 border-b">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">商品小计 ({items.length} 件):</span>
                    <span className="font-medium text-gray-900">¥{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">运费:</span>
                    <span className="font-medium text-gray-900">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">免费</span>
                      ) : (
                        `¥${shippingFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <div className="text-[10px] md:text-xs text-gray-500">
                      还差 ¥{(99 - total).toFixed(2)} 即可免运费
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-base md:text-lg font-bold mb-4 md:mb-6">
                  <span className="text-gray-900">订单总额:</span>
                  <span className="text-[#B12704]">¥{orderTotal.toFixed(2)}</span>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start mb-3 md:mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 md:mt-1 w-4 h-4 text-[#FF9900] rounded focus:ring-[#FF9900] flex-shrink-0"
                  />
                  <span className="ml-2 text-xs md:text-sm text-gray-600">
                    我已阅读并同意
                    <Link href="/terms" className="text-[#007185] hover:underline">
                      服务条款
                    </Link>
                    和
                    <Link href="/privacy" className="text-[#007185] hover:underline">
                      隐私政策
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={processing || !agreed}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F7CA00] text-gray-900 font-bold py-3 md:py-2.5 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {processing ? '处理中...' : '提交订单'}
                </button>

                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                  <div className="flex items-center text-[10px] md:text-xs text-gray-600">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    安全交易保障
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
