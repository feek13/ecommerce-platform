'use client'

import { useEffect, useState } from 'react'
import { useSellerAuth } from '@/app/providers/SellerAuthProvider'
import Toast from '@/components/ui/Toast'

export default function SellerSettingsPage() {
  const { user, profile, refreshProfile } = useSellerAuth()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  // Profile form
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Address form
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('中国')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setAvatarUrl(profile.avatar_url || '')
      setAddressLine1(profile.address_line1 || '')
      setAddressLine2(profile.address_line2 || '')
      setCity(profile.city || '')
      setState(profile.state || '')
      setPostalCode(profile.postal_code || '')
      setCountry(profile.country || '中国')
    }
  }, [profile])

  const handleUpdateProfile = async () => {
    if (!user) return

    if (!fullName.trim()) {
      setToast({ message: '请输入姓名', type: 'warning' })
      return
    }

    setLoading(true)

    try {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      let userToken = null
      try {
        const authData = localStorage.getItem('sb-' + SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token')
        if (authData) {
          const parsed = JSON.parse(authData)
          userToken = parsed?.access_token || null
        }
      } catch (e) {
        console.warn('Failed to get user token:', e)
      }

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${userToken || SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            full_name: fullName.trim(),
            phone: phone.trim(),
            avatar_url: avatarUrl.trim(),
            address_line1: addressLine1.trim(),
            address_line2: addressLine2.trim(),
            city: city.trim(),
            state: state.trim(),
            postal_code: postalCode.trim(),
            country: country.trim(),
            updated_at: new Date().toISOString()
          })
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update profile: ${response.status} - ${errorText}`)
      }

      setToast({ message: '保存成功', type: 'success' })
      await refreshProfile()
    } catch (error: any) {
      console.error('Error updating profile:', error.message || error)
      setToast({ message: '保存失败：' + (error.message || '请重试'), type: 'error' })
    } finally {
      setLoading(false)
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

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">设置</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">管理您的个人资料和店铺信息</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">基本信息</h2>

            <div className="space-y-4">
              {/* Avatar */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  头像
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl md:text-2xl font-bold overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="头像" className="w-full h-full object-cover" />
                    ) : (
                      fullName?.[0] || profile?.email?.[0] || '?'
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="头像图片URL"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs md:text-sm text-gray-500 mt-1">输入头像图片的URL地址</p>
                  </div>
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs md:text-sm text-gray-500 mt-1">邮箱地址无法修改</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入您的姓名"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  联系电话
                </label>
                <input
                  type="tel"
                  placeholder="请输入手机号码"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">地址信息</h2>

            <div className="space-y-4">
              {/* Country */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  国家/地区
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* State and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                    省/州
                  </label>
                  <input
                    type="text"
                    placeholder="例如：广东省"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                    城市
                  </label>
                  <input
                    type="text"
                    placeholder="例如：深圳市"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Address Lines */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  详细地址
                </label>
                <input
                  type="text"
                  placeholder="街道地址、门牌号等"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <input
                  type="text"
                  placeholder="公寓、单元等（可选）"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  邮政编码
                </label>
                <input
                  type="text"
                  placeholder="例如：518000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="px-4 md:px-6 py-2 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base font-medium transition-colors min-h-[44px] md:min-h-0"
            >
              {loading ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">账户信息</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs md:text-sm text-gray-600">角色</p>
                <p className="text-sm md:text-base font-medium text-gray-900">
                  {profile?.role === 'seller' && '卖家'}
                  {profile?.role === 'admin' && '管理员'}
                  {profile?.role === 'user' && '用户'}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">注册时间</p>
                <p className="text-sm md:text-base font-medium text-gray-900">
                  {profile?.created_at && new Date(profile.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">快速链接</h3>
            <div className="space-y-2">
              <a
                href="/seller"
                className="block px-3 md:px-4 py-2 text-sm md:text-base text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                返回仪表板
              </a>
              <a
                href="/seller/products"
                className="block px-3 md:px-4 py-2 text-sm md:text-base text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                管理商品
              </a>
              <a
                href="/seller/orders"
                className="block px-3 md:px-4 py-2 text-sm md:text-base text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                查看订单
              </a>
            </div>
          </div>

          {/* Help */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-sm p-4 md:p-6 text-white">
            <h3 className="text-base md:text-lg font-semibold mb-2">💡 提示</h3>
            <p className="text-xs md:text-sm opacity-90">
              完善您的个人资料可以让买家更信任您的店铺，提高成交率。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
