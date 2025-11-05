'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      // Fetch product stats
      const { data: products } = await supabase
        .from('products')
        .select('status, price')
        .eq('seller_id', user?.id)

      const totalProducts = products?.length || 0
      const activeProducts = products?.filter((p) => p.status === 'active').length || 0

      // Fetch order stats
      const { data: orders } = await supabase
        .from('order_items')
        .select('orders!inner(status, total_amount), quantity, price')
        .eq('orders.seller_id', user?.id)

      const totalOrders = orders?.length || 0
      const pendingOrders = orders?.filter((o: any) => o.orders?.status === 'pending' || o.orders?.status === 'processing').length || 0

      // Calculate revenue
      const totalRevenue = orders?.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) || 0

      setStats({
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 md:py-20">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">仪表板</h1>
        <p className="text-sm md:text-base text-gray-600">欢迎回来！这是您的店铺概览</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="bg-purple-100 rounded-lg md:rounded-xl p-2 md:p-2.5 lg:p-3">
              <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-0.5 md:mb-1">总商品数</p>
          <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-xs md:text-sm text-green-600 mt-1 md:mt-2">{stats.activeProducts} 个在售</p>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="bg-blue-100 rounded-lg md:rounded-xl p-2 md:p-2.5 lg:p-3">
              <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-0.5 md:mb-1">总订单数</p>
          <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-xs md:text-sm text-orange-600 mt-1 md:mt-2">{stats.pendingOrders} 个待处理</p>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="bg-green-100 rounded-lg md:rounded-xl p-2 md:p-2.5 lg:p-3">
              <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-0.5 md:mb-1">总收入</p>
          <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900">¥{stats.totalRevenue.toFixed(2)}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">累计销售额</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 text-white">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="bg-white/20 rounded-lg md:rounded-xl p-2 md:p-2.5 lg:p-3">
              <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <p className="text-white/90 text-xs md:text-sm mb-0.5 md:mb-1">快速操作</p>
          <Link
            href="/seller/products/new"
            className="inline-flex items-center mt-1 md:mt-2 text-white font-semibold hover:underline text-sm md:text-base"
          >
            添加新商品 →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-100 mb-4 md:mb-6 lg:mb-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Link
            href="/seller/products/new"
            className="flex items-center p-3 md:p-4 bg-purple-50 rounded-lg md:rounded-xl hover:bg-purple-100 active:bg-purple-100 transition-colors group min-h-[64px]"
          >
            <div className="bg-purple-600 rounded-lg p-2 md:p-2.5 lg:p-3 mr-3 md:mr-4 flex-shrink-0">
              <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-sm md:text-base">添加商品</p>
              <p className="text-xs md:text-sm text-gray-600">发布新商品到店铺</p>
            </div>
          </Link>

          <Link
            href="/seller/products"
            className="flex items-center p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl hover:bg-blue-100 active:bg-blue-100 transition-colors group min-h-[64px]"
          >
            <div className="bg-blue-600 rounded-lg p-2 md:p-2.5 lg:p-3 mr-3 md:mr-4 flex-shrink-0">
              <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm md:text-base">管理商品</p>
              <p className="text-xs md:text-sm text-gray-600">编辑或下架商品</p>
            </div>
          </Link>

          <Link
            href="/seller/orders"
            className="flex items-center p-3 md:p-4 bg-green-50 rounded-lg md:rounded-xl hover:bg-green-100 active:bg-green-100 transition-colors group min-h-[64px]"
          >
            <div className="bg-green-600 rounded-lg p-2 md:p-2.5 lg:p-3 mr-3 md:mr-4 flex-shrink-0">
              <svg className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors text-sm md:text-base">处理订单</p>
              <p className="text-xs md:text-sm text-gray-600">查看和处理订单</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-purple-100">
        <div className="flex items-start">
          <div className="bg-purple-600 rounded-full p-1.5 md:p-2 mr-3 md:mr-4 flex-shrink-0">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1.5 md:mb-2">💡 店铺提示</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-700">
              <li>• 定期更新商品信息和图片可以提高销量</li>
              <li>• 及时回复买家评价可以建立良好的店铺信誉</li>
              <li>• 快速处理订单可以提升客户满意度</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
