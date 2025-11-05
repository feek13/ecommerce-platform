'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Toast from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'seller' | 'admin'
  created_at: string
}

export default function AdminUsersPage() {
  const { user, profile } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers()
    }
  }, [profile])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setToast({ message: '获取用户列表失败', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (userId: string, currentRole: string, newRole: 'user' | 'seller') => {
    const title = newRole === 'seller' ? '升级为商家' : '降级为普通用户'
    const message = newRole === 'seller'
      ? '确认将此用户升级为商家？升级后该用户将可以发布和管理商品。'
      : '确认将此商家降级为普通用户？该商家的所有商品将标记为"商家审查中"状态。'

    setConfirmDialog({
      isOpen: true,
      title,
      message,
      type: newRole === 'seller' ? 'info' : 'warning',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        try {
          setProcessing(userId)

          const { error } = await supabase
            .from('profiles')
            .update({ role: newRole, updated_at: new Date().toISOString() })
            .eq('id', userId)

          if (error) throw error

          setToast({
            message: newRole === 'seller' ? '用户已升级为商家' : '商家已降级为普通用户',
            type: 'success'
          })
          fetchUsers()
        } catch (error: any) {
          console.error('Error changing role:', error)
          setToast({ message: '操作失败：' + error.message, type: 'error' })
        } finally {
          setProcessing(null)
        }
      }
    })
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      seller: 'bg-blue-100 text-blue-800 border-blue-200',
      user: 'bg-gray-100 text-gray-800 border-gray-200',
    }

    const labels = {
      admin: '管理员',
      seller: '商家',
      user: '普通用户',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <div className="mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">用户管理</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">管理所有用户的角色和权限</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">总用户数</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5 md:mt-1">{users.length}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl md:text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">商家数量</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5 md:mt-1">
                {users.filter(u => u.role === 'seller').length}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl md:text-2xl">🏪</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-5 lg:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">普通用户</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5 md:mt-1">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xl md:text-2xl">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <>
        {/* Mobile Card Layout */}
        <div className="space-y-3 md:hidden">
          {users.map((userItem) => (
            <div key={userItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {/* User Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {userItem.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {userItem.full_name || '未设置'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {userItem.email}
                  </div>
                </div>
                {getRoleBadge(userItem.role)}
              </div>

              {/* User Info */}
              <div className="text-xs text-gray-500 mb-3">
                注册时间: {new Date(userItem.created_at).toLocaleDateString('zh-CN')}
              </div>

              {/* Actions */}
              {userItem.role === 'admin' ? (
                <div className="text-sm text-gray-400 text-center py-2">管理员不可操作</div>
              ) : userItem.id === user?.id ? (
                <div className="text-sm text-gray-400 text-center py-2">当前账户</div>
              ) : (
                <div className="flex gap-2">
                  {userItem.role === 'seller' && (
                    <button
                      onClick={() => handleChangeRole(userItem.id, userItem.role, 'user')}
                      disabled={processing === userItem.id}
                      className="flex-1 px-3 py-2.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 active:bg-yellow-100 transition disabled:opacity-50 text-sm font-medium min-h-[44px]"
                    >
                      {processing === userItem.id ? '处理中...' : '降级为用户'}
                    </button>
                  )}
                  {userItem.role === 'user' && (
                    <button
                      onClick={() => handleChangeRole(userItem.id, userItem.role, 'seller')}
                      disabled={processing === userItem.id}
                      className="flex-1 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 active:bg-blue-100 transition disabled:opacity-50 text-sm font-medium min-h-[44px]"
                    >
                      {processing === userItem.id ? '处理中...' : '升级为商家'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {users.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
              <span className="text-4xl mb-4 block">👥</span>
              <p className="text-gray-500">暂无用户数据</p>
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    邮箱
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
                          {userItem.email?.[0].toUpperCase()}
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-xs lg:text-sm font-medium text-gray-900">
                            {userItem.full_name || '未设置'}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {userItem.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-gray-900">{userItem.email}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      {getRoleBadge(userItem.role)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500">
                      {new Date(userItem.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm">
                      {userItem.role === 'admin' ? (
                        <span className="text-gray-400">管理员不可操作</span>
                      ) : userItem.id === user?.id ? (
                        <span className="text-gray-400">当前账户</span>
                      ) : (
                        <div className="flex gap-1.5 lg:gap-2">
                          {userItem.role === 'seller' && (
                            <button
                              onClick={() => handleChangeRole(userItem.id, userItem.role, 'user')}
                              disabled={processing === userItem.id}
                              className="px-2 lg:px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 active:bg-yellow-100 transition disabled:opacity-50 text-xs font-medium"
                            >
                              {processing === userItem.id ? '处理中...' : '降级为用户'}
                            </button>
                          )}
                          {userItem.role === 'user' && (
                            <button
                              onClick={() => handleChangeRole(userItem.id, userItem.role, 'seller')}
                              disabled={processing === userItem.id}
                              className="px-2 lg:px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 active:bg-blue-100 transition disabled:opacity-50 text-xs font-medium"
                            >
                              {processing === userItem.id ? '处理中...' : '升级为商家'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">👥</span>
              <p className="text-gray-500">暂无用户数据</p>
            </div>
          )}
        </div>
      </>
    </div>
  )
}
