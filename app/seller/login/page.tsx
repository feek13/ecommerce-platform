'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSellerAuth } from '@/app/providers/SellerAuthProvider'
import Toast from '@/components/ui/Toast'
import { InfoIcon } from '@/components/icons/Icons'

export default function SellerLoginPage() {
  const router = useRouter()
  const { signIn } = useSellerAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setToast({ message: '请输入邮箱和密码', type: 'warning' })
      return
    }

    setLoading(true)

    try {
      console.log('[Seller Login] Starting login with independent seller session...')

      const { error } = await signIn(email, password)

      if (error) throw error

      console.log('[Seller Login] Login successful, redirecting to /seller')
      router.replace('/seller')
      router.refresh()
    } catch (error: any) {
      console.error('[Seller Login] Login error:', error)
      setToast({
        message: error.message === 'Invalid login credentials'
          ? '邮箱或密码错误'
          : error.message || '登录失败，请重试',
        type: 'error'
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <div className="text-5xl">🛍️</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">商家后台</h1>
          <p className="text-gray-600">请使用商家账号登录</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="seller@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <div className="flex items-start gap-2">
              <InfoIcon className="text-amber-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">提示</p>
                <ul className="space-y-1 text-xs">
                  <li>• 商家登录独立于主站和管理员后台</li>
                  <li>• 登录或登出不会影响其他账户的登录状态</li>
                  <li>• 只有商家账户才能登录此后台</li>
                  <li>• 还没有商家账户？请先在主站申请成为商家</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 flex justify-between text-sm">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-orange-600 transition"
            >
              ← 返回首页
            </button>
            <button
              onClick={() => router.push('/apply-seller')}
              className="text-orange-600 hover:text-orange-700 transition font-medium"
            >
              申请成为商家 →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 电商平台. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
