'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function DebugPage() {
  const { user, profile, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 调试信息</h1>

        {/* Loading State */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">加载状态</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Loading:</span>{' '}
              <span
                className={`px-3 py-1 rounded ${
                  loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {loading ? '⏳ 加载中...' : '✅ 已完成'}
              </span>
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">登录状态</h2>
          {user ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold text-lg">✅ 已登录</p>
              <div className="bg-green-50 p-4 rounded">
                <p className="font-mono text-sm">
                  <span className="font-semibold">用户 ID:</span> {user.id}
                </p>
                <p className="font-mono text-sm">
                  <span className="font-semibold">邮箱:</span> {user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-red-600 font-semibold text-lg">❌ 未登录</p>
              <p className="text-gray-600">请先登录你的账号</p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                前往登录
              </Link>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">用户资料</h2>
          {profile ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold text-lg">✅ 资料已加载</p>
              <div className="bg-green-50 p-4 rounded space-y-2">
                <p className="font-mono text-sm">
                  <span className="font-semibold">姓名:</span>{' '}
                  {profile.full_name || '未设置'}
                </p>
                <p className="font-mono text-sm">
                  <span className="font-semibold">邮箱:</span> {profile.email}
                </p>
                <p className="font-mono text-sm">
                  <span className="font-semibold">角色:</span>{' '}
                  <span
                    className={`px-2 py-1 rounded ${
                      profile.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : profile.role === 'seller'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {profile.role === 'admin'
                      ? '👑 管理员'
                      : profile.role === 'seller'
                      ? '🏪 商家'
                      : '👤 普通用户'}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-yellow-600 font-semibold text-lg">⚠️ 资料未加载</p>
              {user ? (
                <p className="text-gray-600">
                  你已登录，但 profile 数据未加载。可能是数据库问题。
                </p>
              ) : (
                <p className="text-gray-600">请先登录</p>
              )}
            </div>
          )}
        </div>

        {/* Access Check */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">权限检查</h2>
          <div className="space-y-3">
            {/* Admin Access */}
            <div>
              <p className="font-semibold mb-1">管理员后台访问：</p>
              {!loading && user && profile?.role === 'admin' ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">✅ 有权限</span>
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    前往管理员后台
                  </Link>
                </div>
              ) : (
                <p className="text-red-600">❌ 无权限</p>
              )}
            </div>

            {/* Seller Access */}
            <div>
              <p className="font-semibold mb-1">商家后台访问：</p>
              {!loading &&
              user &&
              (profile?.role === 'seller' || profile?.role === 'admin') ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">✅ 有权限</span>
                  <Link
                    href="/seller"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    前往商家后台
                  </Link>
                </div>
              ) : (
                <p className="text-red-600">❌ 无权限</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 提示</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 如果未登录，请先访问 <Link href="/login" className="underline">/login</Link> 登录</li>
            <li>• 如果已登录但 role 不是 admin，请在 Supabase 执行：</li>
          </ul>
          <pre className="mt-2 bg-white p-3 rounded text-xs">
            UPDATE profiles{'\n'}
            SET role = 'admin'{'\n'}
            WHERE email = '{user?.email || 'your-email@example.com'}';
          </pre>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            返回首页
          </Link>
          <Link
            href="/profile"
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            个人中心
          </Link>
        </div>
      </div>
    </div>
  )
}
