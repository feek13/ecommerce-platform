'use client'

import { useState } from 'react'
import StarRating from './StarRating'

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    content?: string
    images?: string[]
    created_at: string
    seller_reply?: string
    seller_replied_at?: string
    user?: {
      id: string
      full_name?: string
      email?: string
      avatar_url?: string
    }
  }
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const shouldTruncate = review.content && review.content.length > 200

  return (
    <div className="border-b last:border-b-0 py-4 md:py-6">
      {/* User Info & Rating */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm md:text-base flex-shrink-0">
            {review.user?.full_name?.[0] || review.user?.email?.[0] || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm md:text-base">
              {review.user?.full_name || review.user?.email?.split('@')[0] || '匿名用户'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating value={review.rating} onChange={() => {}} readonly size="sm" />
              <span className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      {review.content && (
        <div className="mb-3">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            {shouldTruncate && !expanded
              ? review.content.slice(0, 200) + '...'
              : review.content}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-purple-600 text-xs md:text-sm mt-1 hover:underline"
            >
              {expanded ? '收起' : '展开全部'}
            </button>
          )}
        </div>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`评价图片 ${idx + 1}`}
              onClick={() => setLightboxImage(img)}
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-75 transition flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Seller Reply */}
      {review.seller_reply && (
        <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-700 font-medium text-xs md:text-sm">
              卖家回复：
            </span>
            {review.seller_replied_at && (
              <span className="text-xs text-gray-500">
                {new Date(review.seller_replied_at).toLocaleDateString('zh-CN')}
              </span>
            )}
          </div>
          <p className="text-sm md:text-base text-gray-700">{review.seller_reply}</p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        >
          <img
            src={lightboxImage}
            alt="预览"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white text-3xl md:text-4xl hover:text-gray-300 w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
