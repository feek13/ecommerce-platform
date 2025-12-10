'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseAuth } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import {
  WarningIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ShieldIcon,
  SparklesIcon,
} from '@/components/icons/Icons'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.email || !formData.password) {
      setError('请填写邮箱和密码')
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabaseAuth.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (!user) {
        setError('登录失败，请稍后重试')
        return
      }

      router.replace('/')
      router.refresh()
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.message.includes('Invalid login credentials')) {
        setError('邮箱或密码错误')
      } else {
        setError(err.message || '登录失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex">
      {/* 左侧品牌展示区 - 仅桌面端显示 */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* 发光球装饰 */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-pink-600/25 rounded-full blur-[100px] animate-glow-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 animate-fade-in-down animation-fill-both">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">智选商城</span>
          </Link>

          {/* 品牌信息 */}
          <div className="max-w-md animate-fade-in-up animation-fill-both animation-delay-200">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              发现品质生活
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                尽在智选商城
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              超过 100 万种优质商品，为您提供安全便捷的购物体验
            </p>

            {/* 功能特点 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-300 animate-slide-up-fade animation-fill-both animation-delay-300">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                </div>
                <span>正品保障，7 天无理由退换</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300 animate-slide-up-fade animation-fill-both animation-delay-400">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <ShieldIcon className="w-5 h-5 text-purple-400" />
                </div>
                <span>安全支付，隐私数据加密保护</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300 animate-slide-up-fade animation-fill-both animation-delay-500">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-pink-400" />
                </div>
                <span>专属优惠，会员尊享特权</span>
              </div>
            </div>
          </div>

          {/* 底部版权 */}
          <div className="text-gray-500 text-sm animate-fade-in animation-fill-both animation-delay-600">
            © 2025 智选商城. All rights reserved.
          </div>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="flex-1 flex items-center justify-center bg-slate-900 p-6 md:p-12 relative overflow-hidden">
        {/* 移动端背景发光 */}
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

        <div className="w-full max-w-md relative z-10">
          {/* 移动端 Logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-in-down animation-fill-both">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <ShoppingBagIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">智选商城</span>
            </Link>
          </div>

          {/* 登录卡片 */}
          <div className="relative animate-scale-fade-in animation-fill-both animation-delay-100">
            {/* 卡片发光效果 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2rem] blur-xl opacity-20" />

            {/* 主卡片 */}
            <div className="relative bg-white/[0.08] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
              {/* 内部高光 */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative p-8 md:p-10">
                {/* 标题 */}
                <div className="text-center mb-8 animate-slide-up-fade animation-fill-both animation-delay-200">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    欢迎回来
                  </h1>
                  <p className="text-gray-400">登录以继续您的购物之旅</p>
                </div>

                {/* 错误提示 */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
                    <div className="flex items-center">
                      <WarningIcon className="text-red-400 w-5 h-5 mr-3 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* 登录表单 */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 邮箱输入 */}
                  <div className="animate-slide-up-fade animation-fill-both animation-delay-300">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱地址
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <MailIcon className="w-5 h-5" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* 密码输入 */}
                  <div className="animate-slide-up-fade animation-fill-both animation-delay-400">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        密码
                      </label>
                      <Link href="#" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                        忘记密码？
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <LockIcon className="w-5 h-5" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* 登录按钮 */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg overflow-hidden group animate-slide-up-fade animation-fill-both animation-delay-500"
                  >
                    {/* Shimmer 效果 */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <span className="relative flex items-center justify-center">
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          登录中...
                        </>
                      ) : (
                        '登录'
                      )}
                    </span>
                  </button>
                </form>

                {/* 分隔线 */}
                <div className="relative my-8 animate-slide-up-fade animation-fill-both animation-delay-600">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-gray-500">或者使用</span>
                  </div>
                </div>

                {/* 社交登录按钮 */}
                <div className="grid grid-cols-2 gap-3 animate-slide-up-fade animation-fill-both animation-delay-700">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>

                {/* 条款 */}
                <p className="mt-6 text-center text-xs text-gray-500">
                  登录即表示您同意我们的
                  <Link href="#" className="text-purple-400 hover:text-purple-300 ml-1 transition-colors">使用条款</Link>
                  和
                  <Link href="#" className="text-purple-400 hover:text-purple-300 ml-1 transition-colors">隐私政策</Link>
                </p>
              </div>
            </div>
          </div>

          {/* 注册链接 */}
          <div className="mt-8 text-center animate-fade-in animation-fill-both animation-delay-700">
            <p className="text-gray-400">
              还没有账户？
              <Link href="/signup" className="ml-2 font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
