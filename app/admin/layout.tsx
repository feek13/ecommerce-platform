'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabaseAuth } from '@/lib/supabase'
import Link from 'next/link'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, loading } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
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

  // 如果是登录页面，不做权限检查
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user) {
        console.log('Admin: No user, redirecting to admin login')
        router.push('/admin/login')
      } else if (profile?.role !== 'admin') {
        console.log('Admin: User role is', profile?.role, 'not admin, redirecting to login')
        // 非管理员账户，直接跳转到登录页（不登出，保持主网站的登录状态）
        router.push('/admin/login')
      } else {
        console.log('Admin: Access granted for', user.email)
      }
    }
  }, [user, profile, loading, router, isLoginPage])

  const handleLogout = async () => {
    setConfirmDialog({
      isOpen: true,
      title: '退出登录',
      message: '确定要退出管理后台吗？退出后需要重新登录才能访问管理功能。',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        try {
          setLoggingOut(true)
          await supabaseAuth.auth.signOut()
          router.push('/admin/login')
          router.refresh()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          setLoggingOut(false)
        }
      }
    })
  }

  // 登录页面直接渲染，不显示侧边栏
  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ⚙️ 管理员后台
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              返回首页
            </Link>
            <Link
              href="/profile"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              个人中心
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto pb-32">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
            >
              <span className="text-xl">📊</span>
              <span className="font-medium">数据概览</span>
            </Link>

            <Link
              href="/admin/applications"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
            >
              <span className="text-xl">📝</span>
              <span className="font-medium">商家申请审批</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
            >
              <span className="text-xl">👥</span>
              <span className="font-medium">用户管理</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
            >
              <span className="text-xl">🛍️</span>
              <span className="font-medium">商品管理</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
            >
              <span className="text-xl">📦</span>
              <span className="font-medium">订单管理</span>
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.full_name || '管理员'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition text-sm font-medium disabled:opacity-50"
            >
              {loggingOut ? '退出中...' : '🚪 切换账户'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </div>
  )
}
