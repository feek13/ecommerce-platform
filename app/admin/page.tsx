'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingApplications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 获取总用户数
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // 获取商家数
      const { count: totalSellers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'seller')

      // 获取商品数
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // 获取订单数
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // 获取待审核申请数
      const { count: pendingApplications } = await supabase
        .from('seller_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      setStats({
        totalUsers: totalUsers || 0,
        totalSellers: totalSellers || 0,
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        pendingApplications: pendingApplications || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 md:py-20">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">数据概览</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">平台运营数据统计</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">👥</span>
            </div>
          </div>
          <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">总用户数</p>
        </div>

        {/* Total Sellers */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">🏪</span>
            </div>
          </div>
          <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalSellers}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">商家数量</p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">🛍️</span>
            </div>
          </div>
          <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">商品总数</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">📦</span>
            </div>
          </div>
          <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">订单总数</p>
        </div>

        {/* Pending Applications */}
        <Link
          href="/admin/applications"
          className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 border-2 border-orange-200 hover:border-orange-300 active:border-orange-300 transition min-h-[100px]"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">📝</span>
            </div>
            {stats.pendingApplications > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.pendingApplications}
              </span>
            )}
          </div>
          <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            {stats.pendingApplications}
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">待审核申请</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 lg:p-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Link
            href="/admin/applications"
            className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-center min-h-[88px] flex flex-col items-center justify-center"
          >
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">📝</div>
            <p className="font-semibold text-gray-900 text-xs md:text-sm">审批申请</p>
          </Link>

          <Link
            href="/admin/users"
            className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-center min-h-[88px] flex flex-col items-center justify-center"
          >
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">👥</div>
            <p className="font-semibold text-gray-900 text-xs md:text-sm">用户管理</p>
          </Link>

          <Link
            href="/admin/products"
            className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-center min-h-[88px] flex flex-col items-center justify-center"
          >
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">🛍️</div>
            <p className="font-semibold text-gray-900 text-xs md:text-sm">商品管理</p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-center min-h-[88px] flex flex-col items-center justify-center"
          >
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">📦</div>
            <p className="font-semibold text-gray-900 text-xs md:text-sm">订单管理</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
