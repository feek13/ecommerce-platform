'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import StarRating from './StarRating'
import ImageUpload from './ImageUpload'
import Toast from '../ui/Toast'
import { submitReview } from '@/lib/supabase-fetch'
import { uploadReviewImages } from '@/lib/storage'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  productId: string
  productName: string
  productImage?: string
  onSuccess?: () => void
}

export default function ReviewModal({
  isOpen,
  onClose,
  orderId,
  productId,
  productName,
  productImage,
  onSuccess
}: ReviewModalProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(
    null
  )

  const getRatingText = (rating: number) => {
    const texts = ['', '非常不满意', '不满意', '一般', '满意', '非常满意']
    return texts[rating] || ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setToast({ message: '请选择评分', type: 'warning' })
      return
    }

    if (!user) {
      setToast({ message: '请先登录', type: 'error' })
      return
    }

    try {
      setSubmitting(true)

      // Upload images first
      let imageUrls: string[] = []
      if (images.length > 0) {
        try {
          imageUrls = await uploadReviewImages(images, user.id)
        } catch (error) {
          console.error('Image upload error:', error)
          setToast({ message: '图片上传失败，请重试', type: 'error' })
          setSubmitting(false)
          return
        }
      }

      // Submit review
      await submitReview({
        product_id: productId,
        order_id: orderId,
        user_id: user.id,
        rating,
        content: content.trim() || undefined,
        images: imageUrls
      })

      setToast({ message: '评价提交成功', type: 'success' })
      setTimeout(() => {
        onClose()
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.reload()
        }
      }, 1500)
    } catch (error: any) {
      console.error('Submit review error:', error)
      setToast({
        message: '提交失败：' + (error.message || '请重试'),
        type: 'error'
      })
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-lg md:text-xl font-bold">评价商品</h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Product Info */}
        <div className="px-4 md:px-6 py-4 bg-gray-50 flex gap-3 md:gap-4 border-b">
          {productImage && (
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm md:text-base line-clamp-2">
              {productName}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              订单号: {orderId}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 md:space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
              商品评分 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start gap-2">
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating > 0 && (
                <p className="text-xs md:text-sm text-gray-600">{getRatingText(rating)}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              评价内容 <span className="text-gray-400 text-xs">(选填)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的使用体验，帮助其他买家更好地了解商品..."
              className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">{content.length} 字</p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              晒图 <span className="text-gray-400 text-xs">(选填)</span>
            </label>
            <ImageUpload images={images} onChange={setImages} />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base min-h-[44px] md:min-h-0"
            >
              {submitting ? '提交中...' : '提交评价'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="md:flex-initial px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base min-h-[44px] md:min-h-0"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
