'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Toast from '@/components/ui/Toast'
import { supabase } from '@/lib/supabase'

export default function ApplySellerPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    contact_phone: '',
    contact_address: '',
    business_license: '',
    id_card: '',
  })

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (profile?.role !== 'user') {
        router.push('/profile')
      }
    }
  }, [user, profile, loading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证表单
    if (
      !formData.business_name ||
      !formData.business_description ||
      !formData.contact_phone
    ) {
      setToast({ message: '请填写所有必填项', type: 'warning' })
      return
    }

    try {
      setSubmitting(true)

      // 检查是否已有待审核的申请
      const { data: existingApplication } = await supabase
        .from('seller_applications')
        .select('id, status')
        .eq('user_id', user?.id)
        .eq('status', 'pending')
        .maybeSingle()

      if (existingApplication) {
        setToast({ message: '你已有正在审核中的申请，请耐心等待', type: 'warning' })
        setTimeout(() => router.push('/profile'), 2000)
        return
      }

      // 提交申请
      const { error } = await supabase.from('seller_applications').insert({
        user_id: user?.id,
        business_name: formData.business_name,
        business_description: formData.business_description,
        contact_phone: formData.contact_phone,
        contact_address: formData.contact_address || null,
        business_license: formData.business_license || null,
        id_card: formData.id_card || null,
        status: 'pending',
      })

      if (error) throw error

      setToast({ message: '申请已提交！我们会尽快审核你的申请 ✓', type: 'success' })
      setTimeout(() => router.push('/profile'), 2000)
    } catch (error: any) {
      console.error('Error submitting application:', error)
      setToast({ message: error.message || '提交失败，请重试', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || profile?.role !== 'user') {
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/profile')}
            className="text-purple-600 hover:text-purple-700 flex items-center gap-2 mb-4"
          >
            ← 返回个人中心
          </button>
          <h1 className="text-3xl font-bold text-gray-900">申请成为商家</h1>
          <p className="text-gray-600 mt-2">
            填写以下信息，我们将在 1-3 个工作日内审核你的申请
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📢 申请须知</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 成为商家后，你可以发布和管理自己的商品</li>
            <li>• 所有商品需遵守平台规范，违规商品将被下架</li>
            <li>• 请确保填写的信息真实有效，虚假信息将被拒绝</li>
            <li>• 审核结果将通过邮件通知</li>
          </ul>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                店铺名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入店铺名称"
              />
              <p className="text-xs text-gray-500 mt-1">
                店铺名称将显示在你的商品页面
              </p>
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                店铺简介 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="business_description"
                value={formData.business_description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="介绍一下你的店铺经营范围、特色等"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入联系电话"
              />
            </div>

            {/* Contact Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系地址
              </label>
              <input
                type="text"
                name="contact_address"
                value={formData.contact_address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入联系地址（选填）"
              />
            </div>

            {/* Business License */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                营业执照编号
              </label>
              <input
                type="text"
                name="business_license"
                value={formData.business_license}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入营业执照编号（选填）"
              />
              <p className="text-xs text-gray-500 mt-1">
                如有营业执照，请填写编号以加快审核
              </p>
            </div>

            {/* ID Card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                身份证号
              </label>
              <input
                type="text"
                name="id_card"
                value={formData.id_card}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入身份证号（选填）"
              />
              <p className="text-xs text-gray-500 mt-1">
                仅用于身份验证，我们会严格保护你的隐私
              </p>
            </div>

            {/* Agreement */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">
                  我已阅读并同意
                  <a href="#" className="text-purple-600 hover:underline mx-1">
                    《商家入驻协议》
                  </a>
                  和
                  <a href="#" className="text-purple-600 hover:underline mx-1">
                    《平台管理规范》
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {submitting ? '提交中...' : '提交申请'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                取消
              </button>
            </div>
          </div>
        </form>

        {/* FAQ */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">常见问题</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Q: 审核需要多长时间？
              </h4>
              <p className="text-sm text-gray-600">
                A: 通常在 1-3 个工作日内完成审核，审核结果会通过邮件通知。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Q: 申请被拒绝怎么办？
              </h4>
              <p className="text-sm text-gray-600">
                A: 如果申请被拒绝，可以联系客服了解原因，修改后重新申请。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Q: 成为商家需要费用吗？
              </h4>
              <p className="text-sm text-gray-600">
                A: 申请成为商家完全免费，我们不收取任何入驻费用。
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
