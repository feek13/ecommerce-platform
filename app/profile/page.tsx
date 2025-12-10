'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import Toast from '@/components/ui/Toast'
import {
  UserIcon,
  MailIcon,
  PackageIcon,
  EditIcon,
  CameraIcon,
  CartIcon,
  ClockIcon,
  LogOutIcon,
  StoreIcon,
  SettingsIcon,
  ShoppingBagIcon,
  CalendarIcon,
} from '@/components/icons/Icons'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading, signOut, refreshProfile } = useAuth()
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

  // Refresh profile data when page loads to get latest role
  // This ensures we see updated role if admin approved seller application
  useEffect(() => {
    if (user && !loading) {
      refreshProfile()
    }
  }, [user, loading])

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
      // Use refreshProfile instead of full page reload for better performance
      await refreshProfile()
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

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'seller':
        return '商家'
      case 'admin':
        return '管理员'
      default:
        return '普通用户'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '未知'
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen profile-bg flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-gold/10 animate-profile-glow-pulse" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get user initials
  const initials = (profile?.full_name || user.email || 'U')[0].toUpperCase()

  // Quick actions based on role
  const quickActions = [
    {
      id: 'orders',
      icon: <PackageIcon className="w-6 h-6" />,
      title: '我的订单',
      subtitle: '查看订单历史',
      onClick: () => router.push('/orders'),
      color: 'from-amber-500/20 to-orange-500/20',
    },
    {
      id: 'cart',
      icon: <CartIcon className="w-6 h-6" />,
      title: '购物车',
      subtitle: '查看购物车',
      onClick: () => router.push('/cart'),
      color: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      id: 'products',
      icon: <ShoppingBagIcon className="w-6 h-6" />,
      title: '继续购物',
      subtitle: '浏览商品',
      onClick: () => router.push('/products'),
      color: 'from-blue-500/20 to-indigo-500/20',
    },
  ]

  // Role-specific actions
  if (profile?.role === 'seller') {
    quickActions.push({
      id: 'seller',
      icon: <StoreIcon className="w-6 h-6" />,
      title: '商家后台',
      subtitle: '管理商品',
      onClick: () => router.push('/seller'),
      color: 'from-purple-500/20 to-pink-500/20',
    })
  }

  if (profile?.role === 'admin') {
    quickActions.push({
      id: 'admin',
      icon: <SettingsIcon className="w-6 h-6" />,
      title: '管理后台',
      subtitle: '管理平台',
      onClick: () => router.push('/admin'),
      color: 'from-red-500/20 to-rose-500/20',
    })
  }

  // Seller application action for regular users
  if (profile?.role === 'user' && !loadingApplication) {
    const getSellerActionProps = () => {
      if (applicationStatus === 'pending') {
        return {
          title: '商家申请中',
          subtitle: '等待审核',
          icon: <ClockIcon className="w-6 h-6" />,
          color: 'from-yellow-500/20 to-amber-500/20',
          onClick: () => setToast({ message: '你的申请正在审核中，请耐心等待', type: 'warning' }),
        }
      }
      if (applicationStatus === 'rejected') {
        return {
          title: '申请已拒绝',
          subtitle: '联系客服',
          icon: <StoreIcon className="w-6 h-6" />,
          color: 'from-red-500/20 to-rose-500/20',
          onClick: () => setToast({ message: '你的申请已被拒绝。如需帮助，请联系客服', type: 'error' }),
        }
      }
      return {
        title: '成为商家',
        subtitle: '申请开店',
        icon: <StoreIcon className="w-6 h-6" />,
        color: 'from-gold/20 to-amber-500/20',
        onClick: () => router.push('/apply-seller'),
      }
    }

    const sellerAction = getSellerActionProps()
    quickActions.push({
      id: 'seller-apply',
      ...sellerAction,
    })
  }

  return (
    <div className="min-h-screen profile-bg">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Header />

      <main className="relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-px h-96 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-96 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />

        {/* Hero Section */}
        <section className="relative pt-8 pb-12 md:pt-16 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div
                className="relative group mb-6 opacity-0 animate-profile-reveal-scale animation-delay-100 animation-fill-forwards"
              >
                {/* Outer glow ring - only show on hover for performance */}
                <div className="absolute -inset-4 rounded-full bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Spinning decorative ring - only animate on hover for performance */}
                <div className="absolute -inset-2 rounded-full border border-gold/20 group-hover:animate-profile-spin-slow" />

                {/* Avatar container */}
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-charcoal-700 to-charcoal-800 border-2 border-gold/30 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-light text-gold tracking-wide">
                      {initials}
                    </span>
                  </div>
                </div>

                {/* Camera button (placeholder for future upload) */}
                <button className="absolute bottom-1 right-1 w-9 h-9 md:w-10 md:h-10 rounded-full bg-charcoal-700 border border-gold/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-charcoal-600">
                  <CameraIcon size={18} className="text-gold" />
                </button>
              </div>

              {/* User Name */}
              <h1
                className="text-2xl md:text-4xl font-light text-profile-text-primary tracking-wide mb-3 opacity-0 animate-profile-reveal-up animation-delay-200 animation-fill-forwards"
              >
                {profile?.full_name || '未设置姓名'}
              </h1>

              {/* Role Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-4 opacity-0 animate-profile-reveal-up animation-delay-300 animation-fill-forwards"
              >
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-sm text-gold font-medium tracking-wide uppercase">
                  {getRoleLabel(profile?.role)}
                </span>
              </div>

              {/* Email */}
              <p
                className="text-profile-text-muted text-sm mb-2 opacity-0 animate-profile-reveal-up animation-delay-300 animation-fill-forwards"
              >
                {user.email}
              </p>

              {/* Member since */}
              <p
                className="text-profile-text-muted text-xs flex items-center gap-1.5 opacity-0 animate-profile-reveal-up animation-delay-400 animation-fill-forwards"
              >
                <CalendarIcon size={14} />
                会员自 {formatDate(profile?.created_at)}
              </p>

              {/* Edit button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-6 px-6 py-2.5 rounded-full bg-transparent border border-gold/50 text-gold text-sm font-medium hover:bg-gold/10 transition-all duration-300 flex items-center gap-2 opacity-0 animate-profile-reveal-up animation-delay-400 animation-fill-forwards"
              >
                <EditIcon size={16} />
                {isEditing ? '取消编辑' : '编辑资料'}
              </button>
            </div>
          </div>
        </section>

        {/* Edit Section (Inline) */}
        {isEditing && (
          <section className="pb-8 md:pb-12">
            <div className="max-w-md mx-auto px-4 md:px-6">
              <div className="profile-glass-card rounded-2xl p-6 animate-profile-reveal-up">
                <h2 className="text-lg font-medium text-profile-text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <EditIcon size={16} className="text-gold" />
                  </span>
                  编辑个人信息
                </h2>

                {message && (
                  <div
                    className={`mb-4 p-4 rounded-xl text-sm ${
                      message.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-profile-text-muted mb-2">姓名</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="profile-input"
                      placeholder="输入您的姓名"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-profile-text-muted mb-2">邮箱</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-charcoal-800/50 border border-charcoal-600/50">
                      <MailIcon size={18} className="text-profile-text-muted" />
                      <span className="text-profile-text-secondary">{user.email}</span>
                      <span className="ml-auto text-xs text-profile-text-muted bg-charcoal-700 px-2 py-0.5 rounded">
                        不可修改
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="profile-btn-gold flex-1"
                    >
                      {saving ? '保存中...' : '保存更改'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setFullName(profile?.full_name || '')
                        setMessage(null)
                      }}
                      className="profile-btn-ghost flex-1"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Info Cards Section */}
        <section className="pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Personal Info Card */}
              <div
                className="profile-glass-card rounded-2xl p-6 opacity-0 animate-profile-reveal-up md:-translate-x-2 animation-delay-500 animation-fill-forwards"
              >
                <h2 className="text-lg font-medium text-profile-text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <UserIcon size={16} className="text-gold" />
                  </span>
                  个人信息
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-charcoal-600/30">
                    <span className="text-profile-text-muted text-sm">姓名</span>
                    <span className="text-profile-text-primary">{profile?.full_name || '未设置'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-charcoal-600/30">
                    <span className="text-profile-text-muted text-sm">邮箱</span>
                    <span className="text-profile-text-primary text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-profile-text-muted text-sm">注册时间</span>
                    <span className="text-profile-text-secondary text-sm">
                      {formatDate(profile?.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Stats Card */}
              <div
                className="profile-glass-card rounded-2xl p-6 opacity-0 animate-profile-reveal-up md:translate-x-2 md:translate-y-4 animation-delay-600 animation-fill-forwards"
              >
                <h2 className="text-lg font-medium text-profile-text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <ClockIcon size={16} className="text-gold" />
                  </span>
                  账户状态
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-charcoal-600/30">
                    <span className="text-profile-text-muted text-sm">账户类型</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/30">
                      {getRoleLabel(profile?.role)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-charcoal-600/30">
                    <span className="text-profile-text-muted text-sm">账户状态</span>
                    <span className="flex items-center gap-2 text-emerald-400 text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      正常
                    </span>
                  </div>
                  {profile?.role === 'user' && applicationStatus === 'pending' && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-profile-text-muted text-sm">商家申请</span>
                      <span className="flex items-center gap-2 text-yellow-400 text-sm">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                        审核中
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="pb-8 md:pb-16">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-lg font-medium text-profile-text-primary mb-6 px-4 md:px-6 opacity-0 animate-profile-reveal-up animation-delay-700 animation-fill-forwards"
            >
              快捷操作
            </h2>

            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-4">
              {quickActions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`flex-shrink-0 w-36 md:w-auto group opacity-0 animate-profile-reveal-up animation-fill-forwards ${
                    index === 0 ? 'animation-delay-700' :
                    index === 1 ? 'animation-delay-700' :
                    index === 2 ? 'animation-delay-700' : 'animation-delay-700'
                  }`}
                >
                  <div className="relative p-5 md:p-6 rounded-2xl bg-charcoal-700/50 border border-charcoal-600/50 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 h-full">
                    {/* Simplified solid color hover background for performance */}
                    <div className="absolute inset-0 rounded-2xl bg-charcoal-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-charcoal-600/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-profile-text-secondary group-hover:text-gold">
                        {action.icon}
                      </div>

                      {/* Text */}
                      <p className="text-sm font-medium text-profile-text-primary">{action.title}</p>
                      <p className="text-xs text-profile-text-muted mt-1">{action.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Sign Out Section */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <button
              onClick={handleSignOut}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-transparent border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 animate-profile-reveal-up animation-delay-700 animation-fill-forwards"
            >
              <LogOutIcon size={18} />
              退出登录
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
