'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Toast from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

type Order = {
  id: number
  user_id: string
  total_amount: number
  status: string
  shipping_address: any
  created_at: string
  updated_at: string
  order_items?: Array<{
    id: number
    product_id: number
    quantity: number
    price: number
    product: {
      id: number
      name: string
      images: string[]
    }
  }>
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
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
    } else if (user) {
      fetchOrders()
    }
  }, [user, authLoading, router])

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            product_id,
            quantity,
            price,
            product:products(id, name, images)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      setLoading(true)
      fetchOrders()
    }
  }, [filter])

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: '待付款', color: 'text-yellow-600 bg-yellow-50' },
      paid: { text: '已付款', color: 'text-blue-600 bg-blue-50' },
      shipped: { text: '已发货', color: 'text-purple-600 bg-purple-50' },
      delivered: { text: '已送达', color: 'text-green-600 bg-green-50' },
      cancelled: { text: '已取消', color: 'text-gray-600 bg-gray-50' },
    }
    return statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-50' }
  }

  const getStatusActions = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex gap-1.5 md:gap-2">
            <button className="px-3 md:px-4 py-2.5 md:py-2.5 bg-[#FF9900] text-gray-900 rounded hover:bg-[#F3A847] active:bg-[#F3A847] transition text-xs md:text-sm font-medium whitespace-nowrap min-h-[44px]">
              去支付
            </button>
            <button
              onClick={() => handleCancelOrder(order.id)}
              className="px-3 md:px-4 py-2.5 md:py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 active:bg-gray-50 transition text-xs md:text-sm whitespace-nowrap min-h-[44px]"
            >
              取消订单
            </button>
          </div>
        )
      case 'paid':
        return (
          <button className="px-3 md:px-4 py-2.5 md:py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 active:bg-gray-50 transition text-xs md:text-sm whitespace-nowrap min-h-[44px]">
            查看物流
          </button>
        )
      case 'shipped':
        return (
          <div className="flex gap-1.5 md:gap-2">
            <button className="px-3 md:px-4 py-2.5 md:py-2.5 bg-[#FF9900] text-gray-900 rounded hover:bg-[#F3A847] active:bg-[#F3A847] transition text-xs md:text-sm font-medium whitespace-nowrap min-h-[44px]">
              确认收货
            </button>
            <button className="px-3 md:px-4 py-2.5 md:py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 active:bg-gray-50 transition text-xs md:text-sm whitespace-nowrap min-h-[44px]">
              查看物流
            </button>
          </div>
        )
      case 'delivered':
        return (
          <button className="px-3 md:px-4 py-2.5 md:py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 active:bg-gray-50 transition text-xs md:text-sm whitespace-nowrap min-h-[44px]">
            评价
          </button>
        )
      default:
        return null
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    setConfirmDialog({
      isOpen: true,
      title: '取消订单',
      message: '确定要取消此订单吗？取消后订单无法恢复。',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        try {
          const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('id', orderId)

          if (error) throw error

          setToast({ message: '订单已取消', type: 'success' })
          fetchOrders()
        } catch (error) {
          console.error('Error cancelling order:', error)
          setToast({ message: '取消订单失败，请重试', type: 'error' })
        }
      }
    })
  }

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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <h1 className="text-xl md:text-2xl font-normal text-gray-900 mb-4 md:mb-6">我的订单</h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-t border-b mb-0">
          <div className="flex gap-4 md:gap-6 lg:gap-8 px-3 md:px-6 overflow-x-auto scrollbar-hide">
            {[
              { key: 'all', label: '全部订单' },
              { key: 'pending', label: '待付款' },
              { key: 'paid', label: '待发货' },
              { key: 'shipped', label: '待收货' },
              { key: 'delivered', label: '已完成' },
              { key: 'cancelled', label: '已取消' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-3 md:py-4 border-b-2 transition whitespace-nowrap text-sm md:text-base ${
                  filter === tab.key
                    ? 'border-[#FF9900] text-[#FF9900] font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-b p-6 md:p-12 text-center">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">📦</div>
            <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-1 md:mb-2">暂无订单</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">快去挑选心仪的商品吧！</p>
            <Link
              href="/products"
              className="inline-block px-6 md:px-8 py-2.5 md:py-3 bg-[#FF9900] text-gray-900 font-medium rounded hover:bg-[#F3A847] transition text-sm md:text-base"
            >
              去购物
            </Link>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {orders.map((order) => {
              const status = getStatusText(order.status)
              return (
                <div key={order.id} className="bg-white rounded shadow-sm">
                  {/* Order Header */}
                  <div className="px-3 md:px-6 py-3 md:py-4 bg-gray-50 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6 text-xs md:text-sm w-full sm:w-auto">
                      <div>
                        <span className="text-gray-600">订单号：</span>
                        <span className="font-mono text-gray-900">{order.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">下单时间：</span>
                        <span className="text-gray-900">
                          {new Date(order.created_at).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    </div>
                    <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded text-xs md:text-sm font-medium ${status.color} flex-shrink-0`}>
                      {status.text}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-3 md:p-6">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex gap-2 md:gap-4 py-3 md:py-4 border-b last:border-b-0">
                        <Link
                          href={`/products/${item.product_id}`}
                          className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white border border-gray-200 rounded overflow-hidden hover:opacity-75 transition"
                        >
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl md:text-2xl">
                              📦
                            </div>
                          )}
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product_id}`}
                            className="text-sm md:text-base text-gray-900 hover:text-[#C7511F] line-clamp-2 mb-1 block"
                          >
                            {item.product?.name}
                          </Link>
                          <div className="text-xs md:text-sm text-gray-600">
                            ¥{item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-base md:text-lg font-normal text-gray-900">
                            ¥{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="px-3 md:px-6 py-3 md:py-4 bg-gray-50 border-t">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-3 md:gap-4 lg:gap-6">
                      {/* 收货地址 */}
                      <div className="flex-1">
                        {order.shipping_address && (
                          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-[#FF9900] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium text-gray-900 text-sm md:text-base">收货地址</span>
                            </div>
                            {(() => {
                              const addr = typeof order.shipping_address === 'string'
                                ? JSON.parse(order.shipping_address)
                                : order.shipping_address
                              return (
                                <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                    <span className="text-gray-600">收货人：</span>
                                    <span className="font-medium text-gray-900">{addr.name}</span>
                                    <span className="text-gray-400 hidden sm:inline">|</span>
                                    <span className="text-gray-900">{addr.phone}</span>
                                  </div>
                                  <div className="flex items-start gap-2 md:gap-3">
                                    <span className="text-gray-600 flex-shrink-0">地址：</span>
                                    <span className="text-gray-900">
                                      {[addr.province, addr.city, addr.district].filter(Boolean).join(' ')}
                                      {addr.address && ` ${addr.address}`}
                                      {addr.postalCode && (
                                        <span className="ml-1 md:ml-2 text-gray-500">({addr.postalCode})</span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </div>

                      {/* 订单金额和操作 */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 md:gap-4 flex-shrink-0">
                        <div className="text-left lg:text-right">
                          <div className="text-xs md:text-sm text-gray-600 mb-0.5 md:mb-1">订单金额</div>
                          <div className="text-lg md:text-xl font-normal text-[#B12704]">
                            ¥{order.total_amount.toFixed(2)}
                          </div>
                        </div>
                        {getStatusActions(order)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
