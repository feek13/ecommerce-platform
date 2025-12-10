'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { SellerAuthProvider, useSellerAuth } from '@/app/providers/SellerAuthProvider'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

function SellerLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, loading, signOut } = useSellerAuth()
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
  const isLoginPage = pathname === '/seller/login'

  useEffect(() => {
    console.log('[SellerLayout] Auth state:', {
      loading,
      hasUser: !!user,
      userEmail: user?.email,
      profileRole: profile?.role,
      isLoginPage
    })

    if (!loading && !isLoginPage) {
      if (!user) {
        console.log('[SellerLayout] No seller session, redirecting to seller login')
        router.push('/seller/login')
      } else if (profile?.role !== 'seller' && profile?.role !== 'admin') {
        console.log('[SellerLayout] User role not seller/admin, redirecting to login. Role:', profile?.role)
        router.push('/seller/login')
      } else {
        console.log('[SellerLayout] Access granted. Role:', profile?.role)
      }
    }
  }, [user, profile, loading, router, isLoginPage])

  const handleLogout = async () => {
    setConfirmDialog({
      isOpen: true,
      title: '退出商家登录',
      message: '确定要退出商家后台吗？这不会影响您在主站或管理员后台的登录状态。',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        try {
          setLoggingOut(true)
          await signOut()
          router.push('/seller/login')
          router.refresh()
        } catch (error) {
          console.error('Seller logout error:', error)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user || (profile?.role !== 'seller' && profile?.role !== 'admin')) {
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
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/seller" className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  🛍️ 卖家后台
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                返回前台
              </Link>
              <div className="text-sm text-gray-700">
                {profile?.full_name || profile?.email}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto pb-32">
          <nav className="px-4 py-6 space-y-1">
            <Link
              href="/seller"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              仪表板
            </Link>

            <Link
              href="/seller/products"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              商品管理
            </Link>

            <Link
              href="/seller/orders"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              订单管理
            </Link>

            <Link
              href="/seller/reviews"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              评价管理
            </Link>

            <Link
              href="/seller/settings"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              设置
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.full_name || '商家'}
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

        {/* Page Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

// Wrap with SellerAuthProvider
export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SellerAuthProvider>
      <SellerLayoutContent>{children}</SellerLayoutContent>
    </SellerAuthProvider>
  )
}
