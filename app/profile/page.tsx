'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import Toast from '@/components/ui/Toast'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)
  const [loadingApplication, setLoadingApplication] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
    }
  }, [profile])

  useEffect(() => {
    if (user && profile?.role === 'user') {
      checkApplicationStatus()
    } else {
      setLoadingApplication(false)
    }
  }, [user, profile])

  const checkApplicationStatus = async () => {
    try {
      const { data } = await supabase
        .from('seller_applications')
        .select('status')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      setApplicationStatus(data?.status || null)
    } catch (error) {
      console.error('Error checking application:', error)
    } finally {
      setLoadingApplication(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      setMessage(null)

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: '个人资料已更新' })
      setIsEditing(false)
      window.location.reload()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: error.message || '更新失败' })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {/* Page Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">我的账户</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">管理你的个人资料和设置</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <nav className="space-y-2">
              <button className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 bg-purple-50 text-purple-600 font-semibold rounded-lg text-sm md:text-base">
                个人资料
              </button>
              <button
                onClick={() => router.push('/orders')}
                className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition text-sm md:text-base"
              >
                我的订单
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition text-sm md:text-base"
              >
                购物车
              </button>
              {profile?.role === 'seller' && (
                <button
                  onClick={() => router.push('/seller')}
                  className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition text-sm md:text-base"
                >
                  商家后台
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 text-red-600 hover:bg-red-50 rounded-lg transition text-sm md:text-base"
              >
                退出登录
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4 md:space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">个人信息</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  >
                    编辑
                  </button>
                )}
              </div>

              {message && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                    {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">头像</p>
                    <p className="text-sm md:text-base text-gray-900 font-medium">
                      {profile?.full_name || '未设置'}
                    </p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="输入你的姓名"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.full_name || '未设置'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">邮箱地址无法修改</p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    账户类型
                  </label>
                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profile?.role === 'seller'
                          ? 'bg-purple-100 text-purple-800'
                          : profile?.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {profile?.role === 'seller'
                        ? '商家'
                        : profile?.role === 'admin'
                        ? '管理员'
                        : '普通用户'}
                    </span>
                  </div>
                </div>

                {/* Created At */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    注册时间
                  </label>
                  <p className="text-gray-900">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('zh-CN')
                      : '未知'}
                  </p>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                    >
                      {saving ? '保存中...' : '保存'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setFullName(profile?.full_name || '')
                        setMessage(null)
                      }}
                      className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                    >
                      取消
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">快捷操作</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <button
                  onClick={() => router.push('/orders')}
                  className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-left"
                >
                  <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">📦</div>
                  <p className="text-sm md:text-base font-semibold text-gray-900">我的订单</p>
                  <p className="text-xs md:text-sm text-gray-600">查看订单历史</p>
                </button>

                <button
                  onClick={() => router.push('/cart')}
                  className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-left"
                >
                  <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">🛒</div>
                  <p className="text-sm md:text-base font-semibold text-gray-900">购物车</p>
                  <p className="text-xs md:text-sm text-gray-600">查看购物车</p>
                </button>

                <button
                  onClick={() => router.push('/products')}
                  className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-left"
                >
                  <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">🛍️</div>
                  <p className="text-sm md:text-base font-semibold text-gray-900">继续购物</p>
                  <p className="text-xs md:text-sm text-gray-600">浏览商品</p>
                </button>

                {profile?.role === 'seller' && (
                  <button
                    onClick={() => router.push('/seller')}
                    className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-left"
                  >
                    <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">🏪</div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">商家后台</p>
                    <p className="text-xs md:text-sm text-gray-600">管理商品</p>
                  </button>
                )}

                {profile?.role === 'admin' && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50 transition text-left"
                  >
                    <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">⚙️</div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">管理员后台</p>
                    <p className="text-xs md:text-sm text-gray-600">管理平台</p>
                  </button>
                )}

                {profile?.role === 'user' && !loadingApplication && (
                  <button
                    onClick={() => {
                      if (applicationStatus === 'pending') {
                        setToast({ message: '你的申请正在审核中，请耐心等待', type: 'warning' })
                      } else if (applicationStatus === 'rejected') {
                        setToast({ message: '你的申请已被拒绝。如需帮助，请联系客服', type: 'error' })
                      } else {
                        router.push('/apply-seller')
                      }
                    }}
                    className={`p-3 md:p-4 border-2 rounded-lg transition text-left ${
                      applicationStatus === 'pending'
                        ? 'border-yellow-300 bg-yellow-50'
                        : applicationStatus === 'rejected'
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 active:bg-purple-50'
                    }`}
                  >
                    <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">
                      {applicationStatus === 'pending' ? '⏳' : applicationStatus === 'rejected' ? '❌' : '🏪'}
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">
                      {applicationStatus === 'pending'
                        ? '商家申请中'
                        : applicationStatus === 'rejected'
                        ? '申请已拒绝'
                        : '成为商家'}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {applicationStatus === 'pending'
                        ? '等待审核'
                        : applicationStatus === 'rejected'
                        ? '联系客服'
                        : '申请开店'}
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
