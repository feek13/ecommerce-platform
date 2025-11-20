'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseAuth } from '@/lib/supabase'
import Toast from '@/components/ui/Toast'
import { InfoIcon } from '@/components/icons/Icons'

export default function AdminLoginPage() {
  const router = useRouter()
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
      console.log('[Admin Login] Starting login...')

      const {
        data: { user },
        error: authError,
      } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      })

      console.log('[Admin Login] Auth response:', { userExists: !!user, error: authError })

      if (authError) throw authError
      if (!user) throw new Error('登录失败，请稍后重试')

      console.log('[Admin Login] Login successful, redirecting to /admin')
      router.replace('/admin')
      router.refresh()
    } catch (error: any) {
      console.error('[Admin Login] Login error:', error)
      setToast({
        message: error.message === 'Invalid login credentials'
          ? '邮箱或密码错误'
          : error.message || '登录失败，请重试',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
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
            <div className="text-5xl">⚙️</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理员后台</h1>
          <p className="text-gray-600">请使用管理员账号登录</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="admin@example.com"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <InfoIcon className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">提示</p>
                <ul className="space-y-1 text-xs">
                  <li>• 只有管理员账户才能登录此后台</li>
                  <li>• 如果账户没有管理员权限，请联系超级管理员</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-purple-600 transition"
            >
              ← 返回首页
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
