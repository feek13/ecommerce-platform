'use client'

import { useEffect, useState } from 'react'
import { useSellerAuth } from '@/app/providers/SellerAuthProvider'
import Link from 'next/link'
import Toast from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { SellerOrder } from '@/types/database'

export default function SellerOrdersPage() {
  const { user, profile } = useSellerAuth()
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [filter, user])

  const fetchOrders = async () => {
    if (!user) return

    try {
      // Use direct fetch to avoid SDK hanging
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      // Get user token from localStorage
      let userToken = null
      try {
        const authData = localStorage.getItem('sb-' + SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token')
        if (authData) {
          const parsed = JSON.parse(authData)
          userToken = parsed?.access_token || null
        }
      } catch (e) {
        console.warn('Failed to get user token:', e)
      }

      // First, get all orders with their items
      // Let PostgREST auto-detect the foreign key relationship
      let url = `${SUPABASE_URL}/rest/v1/orders?select=*,order_items(id,product_id,quantity,price,product:products(id,name,images,seller_id))&order=created_at.desc`

      const response = await fetch(url, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${userToken || SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`)
      }

      const allOrders = await response.json()

      // Filter orders to only include those with products from this seller
      const sellerOrders = allOrders.filter((order: SellerOrder) => {
        return order.order_items?.some(item => item.product?.seller_id === user.id)
      }).map((order: SellerOrder) => {
        // Filter order items to only show this seller's products
        return {
          ...order,
          order_items: order.order_items?.filter(item => item.product?.seller_id === user.id)
        }
      })

      // Apply status filter
      let filteredOrders = sellerOrders
      if (filter !== 'all') {
        filteredOrders = sellerOrders.filter((order: SellerOrder) => order.status === filter)
      }

      setOrders(filteredOrders || [])
    } catch (error: any) {
      console.error('Error fetching orders:', error.message || error)
      setToast({ message: '获取订单失败：' + (error.message || '未知错误'), type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const statusMap: Record<string, string> = {
      pending: '待付款',
      paid: '已付款',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消',
    }

    setConfirmDialog({
      isOpen: true,
      title: '更改订单状态',
      message: `确定要将订单状态改为"${statusMap[newStatus]}"吗？`,
      type: newStatus === 'cancelled' ? 'danger' : 'info',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        try {
          // Use direct fetch to avoid SDK hanging
          const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
          const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

          // Get user token from localStorage
          let userToken = null
          try {
            const authData = localStorage.getItem('sb-' + SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token')
            if (authData) {
              const parsed = JSON.parse(authData)
              userToken = parsed?.access_token || null
            }
          } catch (e) {
            console.warn('Failed to get user token:', e)
          }

          const response = await fetch(
            `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
            {
              method: 'PATCH',
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${userToken || SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({
                status: newStatus,
                updated_at: new Date().toISOString()
              })
            }
          )

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to update order: ${response.status} - ${errorText}`)
          }

          setToast({ message: '订单状态已更新', type: 'success' })
          fetchOrders()
        } catch (error: any) {
          console.error('Error updating order:', error.message || error)
          setToast({ message: '更新失败：' + (error.message || '请重试'), type: 'error' })
        }
      }
    })
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: '待付款', color: 'bg-yellow-100 text-yellow-800' },
      paid: { text: '已付款', color: 'bg-blue-100 text-blue-800' },
      shipped: { text: '已发货', color: 'bg-purple-100 text-purple-800' },
      delivered: { text: '已送达', color: 'bg-green-100 text-green-800' },
      cancelled: { text: '已取消', color: 'bg-gray-100 text-gray-800' },
    }
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' }
  }

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchQuery) ||
    order.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate seller's revenue from orders
  const sellerRevenue = orders
    .filter(order => order.status === 'delivered' || order.status === 'shipped')
    .reduce((sum, order) => {
      const sellerItemsTotal = order.order_items?.reduce((itemSum, item) =>
        itemSum + (item.price * item.quantity), 0) || 0
      return sum + sellerItemsTotal
    }, 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
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
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">订单管理</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">管理包含您商品的订单</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-gray-100">
          <p className="text-xl md:text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-xs md:text-sm text-gray-600">全部订单</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-yellow-200 bg-yellow-50">
          <p className="text-xl md:text-2xl font-bold text-yellow-700">
            {orders.filter(o => o.status === 'pending').length}
          </p>
          <p className="text-xs md:text-sm text-gray-600">待付款</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-blue-200 bg-blue-50">
          <p className="text-xl md:text-2xl font-bold text-blue-700">
            {orders.filter(o => o.status === 'paid').length}
          </p>
          <p className="text-xs md:text-sm text-gray-600">已付款</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-purple-200 bg-purple-50">
          <p className="text-xl md:text-2xl font-bold text-purple-700">
            {orders.filter(o => o.status === 'shipped').length}
          </p>
          <p className="text-xs md:text-sm text-gray-600">已发货</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-green-200 bg-green-50">
          <p className="text-xl md:text-2xl font-bold text-green-700">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
          <p className="text-xs md:text-sm text-gray-600">已送达</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-gray-200">
          <p className="text-xl md:text-2xl font-bold text-gray-600">
            {orders.filter(o => o.status === 'cancelled').length}
          </p>
          <p className="text-xs md:text-sm text-gray-600">已取消</p>
        </div>
      </div>

      {/* Revenue */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm opacity-90 mb-1">我的订单收入</p>
            <p className="text-2xl md:text-3xl font-bold">¥{sellerRevenue.toFixed(2)}</p>
          </div>
          <div className="text-3xl md:text-4xl opacity-80">💰</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索订单号或用户ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">全部状态</option>
            <option value="pending">待付款</option>
            <option value="paid">已付款</option>
            <option value="shipped">已发货</option>
            <option value="delivered">已送达</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 md:p-12 text-center">
          <div className="text-4xl md:text-6xl mb-4">📦</div>
          <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-2">暂无订单</h2>
          <p className="text-sm md:text-base text-gray-600">当前筛选条件下没有找到订单</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredOrders.map((order) => {
            const status = getStatusText(order.status)
            const isExpanded = expandedOrder === order.id
            const sellerItemsTotal = order.order_items?.reduce((sum, item) =>
              sum + (item.price * item.quantity), 0) || 0

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Order Header */}
                <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-xs md:text-sm flex-1">
                    <div>
                      <span className="text-gray-600">订单号：</span>
                      <span className="font-mono font-medium text-gray-900">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">下单时间：</span>
                      <span className="text-gray-900">
                        {new Date(order.created_at).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">用户ID：</span>
                      <span className="text-gray-900 font-mono text-xs">
                        {order.user_id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${status.color}`}>
                      {status.text}
                    </span>
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {isExpanded ? '收起 ▲' : '展开 ▼'}
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="text-xs md:text-sm text-gray-600">
                      我的商品 {order.order_items?.length || 0} 件
                    </div>
                    <div className="text-base md:text-lg font-medium text-gray-900">
                      我的收入：¥{sellerItemsTotal.toFixed(2)}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2">
                    {order.status === 'paid' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'shipped')}
                        className="px-3 md:px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs md:text-sm font-medium min-h-[44px] md:min-h-0"
                      >
                        标记已发货
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        className="px-3 md:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs md:text-sm font-medium min-h-[44px] md:min-h-0"
                      >
                        标记已送达
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {/* Order Items */}
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50">
                      <h3 className="font-medium text-gray-900 mb-3 text-sm md:text-base">我的商品</h3>
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex gap-3 md:gap-4 bg-white p-3 rounded-lg">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              {item.product?.images && item.product.images.length > 0 ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product?.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl md:text-2xl">
                                  📦
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/products/${item.product_id}`}
                                target="_blank"
                                className="text-gray-900 hover:text-purple-600 line-clamp-2 font-medium text-sm md:text-base"
                              >
                                {item.product?.name}
                              </Link>
                              <div className="text-xs md:text-sm text-gray-600 mt-1">
                                单价：¥{item.price.toFixed(2)} × {item.quantity}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-medium text-gray-900 text-sm md:text-base">
                                ¥{(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3 text-sm md:text-base">收货地址</h3>
                        {(() => {
                          const addr = typeof order.shipping_address === 'string'
                            ? JSON.parse(order.shipping_address)
                            : order.shipping_address
                          return (
                            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                              <div className="space-y-2 text-xs md:text-sm">
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                  <span className="text-gray-600">收货人：</span>
                                  <span className="font-medium text-gray-900">{addr.name}</span>
                                  <span className="text-gray-400 hidden md:inline">|</span>
                                  <span className="text-gray-900">{addr.phone}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
                                  <span className="text-gray-600 flex-shrink-0">地址：</span>
                                  <span className="text-gray-900">
                                    {[addr.province, addr.city, addr.district].filter(Boolean).join(' ')}
                                    {addr.address && ` ${addr.address}`}
                                    {addr.postalCode && (
                                      <span className="ml-2 text-gray-500">({addr.postalCode})</span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
