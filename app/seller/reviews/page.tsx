'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import Toast from '@/components/ui/Toast'
import type { Review } from '@/types/database'

export default function SellerReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  useEffect(() => {
    if (user) {
      fetchReviews()
    }
  }, [user])

  const fetchReviews = async () => {
    if (!user) return

    try {
      // Use direct fetch to avoid SDK hanging
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      // Get user token from localStorage
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

      // Get reviews for products belonging to this seller
      const url = `${SUPABASE_URL}/rest/v1/reviews?select=*,user:profiles!reviews_user_id_fkey(id,email,full_name,avatar_url),product:products(id,name,images,seller_id)&order=created_at.desc`

      const response = await fetch(url, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${userToken || SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch reviews: ${response.status} - ${errorText}`)
      }

      const allReviews = await response.json()

      // Filter to only show reviews for this seller's products
      const sellerReviews = allReviews.filter((review: any) =>
        review.product?.seller_id === user.id
      )

      setReviews(sellerReviews || [])
    } catch (error: any) {
      console.error('Error fetching reviews:', error.message || error)
      setToast({ message: '获取评价失败：' + (error.message || '未知错误'), type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) {
      setToast({ message: '请输入回复内容', type: 'warning' })
      return
    }

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
        `${SUPABASE_URL}/rest/v1/reviews?id=eq.${reviewId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${userToken || SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            seller_reply: replyText.trim(),
            seller_replied_at: new Date().toISOString()
          })
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to reply: ${response.status} - ${errorText}`)
      }

      setToast({ message: '回复成功', type: 'success' })
      setReplyingTo(null)
      setReplyText('')
      fetchReviews()
    } catch (error: any) {
      console.error('Error replying to review:', error.message || error)
      setToast({ message: '回复失败：' + (error.message || '请重试'), type: 'error' })
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (filter === 'unreplied') return !review.seller_reply
    if (filter === 'replied') return !!review.seller_reply
    return true
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-base md:text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  const stats = {
    total: reviews.length,
    unreplied: reviews.filter(r => !r.seller_reply).length,
    replied: reviews.filter(r => !!r.seller_reply).length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">评价管理</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">查看和回复商品评价</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-gray-100">
          <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs md:text-sm text-gray-600">全部评价</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-orange-200 bg-orange-50">
          <p className="text-xl md:text-2xl font-bold text-orange-700">{stats.unreplied}</p>
          <p className="text-xs md:text-sm text-gray-600">待回复</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-green-200 bg-green-50">
          <p className="text-xl md:text-2xl font-bold text-green-700">{stats.replied}</p>
          <p className="text-xs md:text-sm text-gray-600">已回复</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl">⭐</span>
            <p className="text-xl md:text-2xl font-bold text-yellow-700">{stats.avgRating}</p>
          </div>
          <p className="text-xs md:text-sm text-gray-600">平均评分</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] md:min-h-0 ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部评价 ({stats.total})
          </button>
          <button
            onClick={() => setFilter('unreplied')}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] md:min-h-0 ${
              filter === 'unreplied'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            待回复 ({stats.unreplied})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] md:min-h-0 ${
              filter === 'replied'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            已回复 ({stats.replied})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-lg p-8 md:p-12 text-center">
          <div className="text-4xl md:text-6xl mb-4">💬</div>
          <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-2">暂无评价</h2>
          <p className="text-sm md:text-base text-gray-600">
            {filter === 'unreplied' && '所有评价都已回复'}
            {filter === 'replied' && '还没有已回复的评价'}
            {filter === 'all' && '商品还没有收到评价'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredReviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              {/* Product Info */}
              <div className="flex gap-3 md:gap-4 mb-4 pb-4 border-b">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {review.product?.images && review.product.images.length > 0 ? (
                    <img
                      src={review.product.images[0]}
                      alt={review.product?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl md:text-2xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${review.product_id}`}
                    target="_blank"
                    className="text-sm md:text-base text-gray-900 hover:text-purple-600 line-clamp-2 font-medium"
                  >
                    {review.product?.name}
                  </Link>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                {/* User and Rating */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm md:text-base">
                      {review.user?.full_name?.[0] || review.user?.email?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-medium text-gray-900">
                        {review.user?.full_name || review.user?.email}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {/* Review Text */}
                {review.content && (
                  <p className="text-sm md:text-base text-gray-700 mb-3">{review.content}</p>
                )}

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3">
                    {review.images.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`评价图片 ${idx + 1}`}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Seller Reply */}
              {review.seller_reply ? (
                <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-purple-700 font-medium text-sm md:text-base">卖家回复：</span>
                    <span className="text-xs md:text-sm text-gray-500">
                      {new Date(review.seller_replied_at).toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-700">{review.seller_reply}</p>
                </div>
              ) : replyingTo === review.id ? (
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="输入您的回复..."
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(review.id)}
                      className="px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm md:text-base font-medium transition-colors min-h-[44px] md:min-h-0"
                    >
                      发送回复
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyText('')
                      }}
                      className="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm md:text-base transition-colors min-h-[44px] md:min-h-0"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(review.id)}
                  className="px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm md:text-base font-medium transition-colors min-h-[44px] md:min-h-0"
                >
                  回复评价
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
