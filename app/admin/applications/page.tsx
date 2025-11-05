'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Toast from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import PromptDialog from '@/components/ui/PromptDialog'

type Application = {
  id: string
  user_id: string
  business_name: string
  business_description: string
  contact_phone: string
  contact_address: string | null
  business_license: string | null
  id_card: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at: string | null
  profiles: {
    email: string
    full_name: string | null
  }
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
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
  const [promptDialog, setPromptDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: (value: string) => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    try {
      setLoading(true)

      let query = supabase
        .from('seller_applications')
        .select(
          `
          *,
          profiles!seller_applications_user_id_fkey (
            email,
            full_name
          )
        `
        )
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error

      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (applicationId: string, userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '通过申请',
      message: '确认通过此商家申请？通过后该用户将获得商家权限，可以发布和管理商品。',
      type: 'info',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        try {
          setProcessing(applicationId)

          // 更新用户角色为 seller
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'seller' })
            .eq('id', userId)

          if (profileError) throw profileError

          // 更新申请状态
          const { error: applicationError } = await supabase
            .from('seller_applications')
            .update({
              status: 'approved',
              reviewed_at: new Date().toISOString(),
            })
            .eq('id', applicationId)

          if (applicationError) throw applicationError

          setToast({ message: '申请已通过！', type: 'success' })
          fetchApplications()
        } catch (error: any) {
          console.error('Error approving application:', error)
          setToast({ message: '操作失败：' + error.message, type: 'error' })
        } finally {
          setProcessing(null)
        }
      }
    })
  }

  const handleReject = async (applicationId: string) => {
    setPromptDialog({
      isOpen: true,
      title: '拒绝申请',
      message: '请输入拒绝原因（可选）：',
      onConfirm: async (reason: string) => {
        setPromptDialog({ ...promptDialog, isOpen: false })

        try {
          setProcessing(applicationId)

          const { error } = await supabase
            .from('seller_applications')
            .update({
              status: 'rejected',
              reviewed_at: new Date().toISOString(),
            })
            .eq('id', applicationId)

          if (error) throw error

          setToast({ message: '申请已拒绝', type: 'success' })
          fetchApplications()
        } catch (error: any) {
          console.error('Error rejecting application:', error)
          setToast({ message: '操作失败：' + error.message, type: 'error' })
        } finally {
          setProcessing(null)
        }
      }
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            待审核
          </span>
        )
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            已通过
          </span>
        )
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            已拒绝
          </span>
        )
      default:
        return null
    }
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

      <PromptDialog
        isOpen={promptDialog.isOpen}
        title={promptDialog.title}
        message={promptDialog.message}
        placeholder="请输入拒绝原因..."
        onConfirm={promptDialog.onConfirm}
        onCancel={() => setPromptDialog({ ...promptDialog, isOpen: false })}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">商家申请审批</h1>
        <p className="text-gray-600 mt-2">审核商家入驻申请</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'pending'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          待审核
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'approved'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          已通过
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'rejected'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          已拒绝
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          全部
        </button>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无申请</h3>
          <p className="text-gray-600">没有符合条件的申请记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {app.business_name}
                    </h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    申请人：{app.profiles?.full_name || app.profiles?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    申请时间：{new Date(app.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">店铺简介</p>
                  <p className="text-sm text-gray-900">{app.business_description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">联系方式</p>
                  <p className="text-sm text-gray-900">
                    电话：{app.contact_phone}
                  </p>
                  {app.contact_address && (
                    <p className="text-sm text-gray-900">
                      地址：{app.contact_address}
                    </p>
                  )}
                </div>

                {app.business_license && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      营业执照编号
                    </p>
                    <p className="text-sm text-gray-900">{app.business_license}</p>
                  </div>
                )}

                {app.id_card && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">身份证号</p>
                    <p className="text-sm text-gray-900">{app.id_card}</p>
                  </div>
                )}
              </div>

              {app.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(app.id, app.user_id)}
                    disabled={processing === app.id}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {processing === app.id ? '处理中...' : '✓ 通过'}
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    disabled={processing === app.id}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {processing === app.id ? '处理中...' : '✗ 拒绝'}
                  </button>
                </div>
              )}

              {app.reviewed_at && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    审核时间：{new Date(app.reviewed_at).toLocaleString('zh-CN')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
