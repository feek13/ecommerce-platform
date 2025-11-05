'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProductById, getProductReviews, getProductReviewStats } from '@/lib/supabase-fetch'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ReviewFilters from '@/components/review/ReviewFilters'
import ReviewCard from '@/components/review/ReviewCard'
import type { Product } from '@/types/database'
import Image from 'next/image'
import Link from 'next/link'
import Toast from '@/components/ui/Toast'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    average: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  // Auto-rotation effect
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return
    if (!isAutoPlaying || isHovering) return

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    }, 4000) // Rotate every 4 seconds

    return () => clearInterval(interval)
  }, [product, isAutoPlaying, isHovering])

  const fetchProduct = async () => {
    try {
      console.log('🔄 Fetching product with direct fetch...')
      const data = await getProductById(params.id as string)

      if (!data) {
        console.warn('⚠️ Product not found:', params.id)
        setProduct(null)
      } else {
        console.log('✅ Product loaded:', data.name)
        setProduct(data)
        // Fetch reviews after product is loaded
        fetchReviews(params.id as string)
      }
    } catch (error) {
      console.error('❌ Error fetching product:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true)
      // Fetch all reviews for statistics
      const statsData = await getProductReviewStats(productId)

      // Calculate statistics
      if (statsData && statsData.length > 0) {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        let totalRating = 0

        statsData.forEach((review: any) => {
          const rating = review.rating
          distribution[rating as keyof typeof distribution]++
          totalRating += rating
        })

        setReviewStats({
          total: statsData.length,
          average: totalRating / statsData.length,
          distribution
        })
      }

      // Fetch reviews to display
      const reviewsData = await getProductReviews(productId, 20)
      setReviews(reviewsData || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!product) return

    try {
      setAdding(true)
      await addItem(product.id, quantity)
      setShowAddedMessage(true)
      setTimeout(() => setShowAddedMessage(false), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setToast({ message: '添加失败，请重试', type: 'error' })
    } finally {
      setAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    await handleAddToCart()
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAEDED]">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#EAEDED]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">商品不存在</h1>
          <Link href="/products" className="text-[#007185] hover:underline">
            返回商品列表
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

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

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-sm">
            <Link href="/" className="text-[#007185] hover:underline">首页</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/products" className="text-[#007185] hover:underline">商品</Link>
            {product.category && (
              <>
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-[#007185] hover:underline"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded p-4 sticky top-4">
              {/* Main Image */}
              <div
                className="aspect-square bg-white rounded border border-gray-200 mb-4 flex items-center justify-center overflow-hidden relative group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {product.images && product.images.length > 0 ? (
                  <>
                    {/* Image with fade transition */}
                    <img
                      key={selectedImage}
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-contain transition-opacity duration-500"
                      style={{ animation: 'fadeIn 0.5s ease-in' }}
                    />

                    {/* Play/Pause Button - Only show for multiple images */}
                    {product.images.length > 1 && (
                      <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        title={isAutoPlaying ? '暂停自动播放' : '开始自动播放'}
                      >
                        {isAutoPlaying ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Navigation Dots - Only show for multiple images */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {product.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedImage(index)
                              setIsAutoPlaying(false)
                            }}
                            className="group relative"
                          >
                            <div className={`w-2 h-2 rounded-full transition-all ${
                              selectedImage === index
                                ? 'bg-[#FF9900] scale-125'
                                : 'bg-white/60 hover:bg-white/80'
                            }`} />
                            {/* Progress ring for active dot */}
                            {selectedImage === index && isAutoPlaying && !isHovering && (
                              <svg className="absolute -inset-1 w-4 h-4 -rotate-90">
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="7"
                                  stroke="#FF9900"
                                  strokeWidth="2"
                                  fill="none"
                                  strokeDasharray="44"
                                  strokeDashoffset="0"
                                  className="animate-progress"
                                  style={{
                                    animation: 'progress 4s linear forwards'
                                  }}
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400 text-6xl">📦</div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(index)
                        setIsAutoPlaying(false)
                      }}
                      className={`aspect-square border-2 rounded overflow-hidden hover:border-[#FF9900] transition-all ${
                        selectedImage === index ? 'border-[#FF9900] ring-2 ring-[#FF9900]/30' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Product Info */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded p-4 md:p-6">
              {/* Product Title */}
              <h1 className="text-lg md:text-2xl font-normal text-gray-900 mb-4">{product.name}</h1>

              {/* Seller Warning */}
              {product.seller && product.seller.role !== 'seller' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  <span className="text-sm text-yellow-800">商家被审查中，购买需谨慎</span>
                </div>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                <div className="flex items-center">
                  <div className="flex text-[#FF9900]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.round(reviewStats.average) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-[#007185] hover:underline cursor-pointer">
                    {reviewStats.total > 0 ? `${reviewStats.total} 条评价` : '暂无评价'}
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">已售 {product.sales_count || 0}</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 md:gap-3 mb-2">
                  <span className="text-xs md:text-sm text-gray-600">价格：</span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl md:text-3xl text-[#B12704] font-normal">
                      ¥{product.price.toFixed(2)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ¥{product.original_price.toFixed(2)}
                        </span>
                        <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded">
                          省 {discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {product.original_price && product.original_price > product.price && (
                  <div className="text-sm text-green-700">
                    您节省：¥{(product.original_price - product.price).toFixed(2)} ({discount}%)
                  </div>
                )}
              </div>

              {/* Stock */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">库存：</span>
                  {product.stock > 0 ? (
                    <span className="text-green-700 font-medium">有货 ({product.stock} 件)</span>
                  ) : (
                    <span className="text-red-600 font-medium">缺货</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-bold text-gray-900 mb-2">商品描述</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>

              {/* Seller Info */}
              {product.seller && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-bold text-gray-900 mb-2">商家信息</h3>
                  <div className="text-sm text-gray-700">
                    <p>卖家：{product.seller.full_name || product.seller.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      状态：
                      <span className={product.seller.role === 'seller' ? 'text-green-600' : 'text-yellow-600'}>
                        {product.seller.role === 'seller' ? '认证商家' : '审核中'}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Free Shipping Notice */}
              <div className="bg-gray-50 rounded p-3 mb-6">
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">免费配送</span>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-700">7天无理由退货</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Buy Box */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded p-4 border border-gray-200 sticky top-4">
              <div className="mb-4">
                <div className="text-2xl text-[#B12704] font-normal mb-1">
                  ¥{product.price.toFixed(2)}
                </div>
                {product.stock > 0 && (
                  <div className="text-sm text-green-700 font-medium">有货</div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">数量：</label>
                <div className="flex items-center border border-gray-300 rounded w-24">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 transition"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-full text-center border-0 focus:outline-none focus:ring-0"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100 transition"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium py-2 rounded-lg shadow-sm transition mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? '添加中...' : '加入购物车'}
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || adding}
                className="w-full bg-[#FFA41C] hover:bg-[#FF8F00] text-gray-900 font-medium py-2 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                立即购买
              </button>

              {/* Added to Cart Message */}
              {showAddedMessage && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800 text-center">
                  ✓ 已添加到购物车
                </div>
              )}

              {/* Secure Transaction */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  安全交易
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">商品评价</h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Filters */}
            <div className="lg:col-span-1">
              <ReviewFilters
                stats={reviewStats}
                selectedRating={selectedRating}
                onFilterChange={setSelectedRating}
              />
            </div>

            {/* Right: Reviews List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                {reviewsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredReviews.length > 0 ? (
                  <div className="divide-y">
                    {filteredReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm md:text-base">
                      {selectedRating ? '暂无该评分的评价' : '暂无评价'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30 safe-area-inset-bottom">
        <div className="flex items-center gap-2 p-3">
          {/* Price & Stock Info */}
          <div className="flex-shrink-0">
            <div className="text-xl font-bold text-[#B12704]">
              ¥{product.price.toFixed(2)}
            </div>
            {product.stock > 0 ? (
              <div className="text-xs text-green-700">有货</div>
            ) : (
              <div className="text-xs text-red-600">缺货</div>
            )}
          </div>

          {/* Quantity Selector (Compact) */}
          <div className="flex items-center border border-gray-300 rounded flex-shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1.5 hover:bg-gray-100 transition text-lg"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-2 py-1.5 hover:bg-gray-100 transition text-lg"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex-1 flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F7CA00] text-gray-900 font-medium py-2.5 px-3 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
              {adding ? '添加中...' : '加入购物车'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0 || adding}
              className="flex-1 bg-[#FFA41C] hover:bg-[#FF8F00] active:bg-[#FF8F00] text-gray-900 font-medium py-2.5 px-3 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
              立即购买
            </button>
          </div>
        </div>

        {/* Added to Cart Message */}
        {showAddedMessage && (
          <div className="absolute bottom-full left-0 right-0 mb-2 mx-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 text-center shadow-lg animate-slideUp">
              ✓ 已添加到购物车
            </div>
          </div>
        )}
      </div>

      {/* Add padding at bottom to prevent content being hidden by sticky bar on mobile */}
      <div className="h-20 lg:hidden" />

      <Footer />
    </div>
  )
}
