'use client'

/**
 * Product Detail Skeleton Loading Component
 *
 * A luxurious, editorial-style skeleton for product detail page.
 * Features: shimmer effect, staggered animations, realistic layout.
 */

// Shimmer line component with customizable width
function ShimmerLine({
  width = 'w-full',
  height = 'h-4',
  className = '',
  delay = 0
}: {
  width?: string
  height?: string
  className?: string
  delay?: number
}) {
  return (
    <div
      className={`relative ${width} ${height} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full overflow-hidden ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent"
        style={{ animationDelay: `${delay}ms` }}
      />
    </div>
  )
}

// Shimmer box component
function ShimmerBox({
  className = '',
  delay = 0,
  children
}: {
  className?: string
  delay?: number
  children?: React.ReactNode
}) {
  return (
    <div
      className={`relative bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{ animationDelay: `${delay}ms` }}
      />
      {children}
    </div>
  )
}

// Image gallery skeleton
function ImageGallerySkeleton() {
  return (
    <div className="bg-white rounded p-4 opacity-0 animate-fade-in-up animation-fill-forwards">
      {/* Main image */}
      <ShimmerBox className="aspect-square rounded-lg mb-4" delay={100}>
        {/* Decorative camera icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-200/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </ShimmerBox>

      {/* Thumbnail images */}
      <div className="grid grid-cols-5 gap-2">
        {[...Array(5)].map((_, i) => (
          <ShimmerBox
            key={i}
            className="aspect-square rounded border-2 border-gray-100"
            delay={200 + i * 50}
          />
        ))}
      </div>
    </div>
  )
}

// Product info skeleton
function ProductInfoSkeleton() {
  return (
    <div className="bg-white rounded p-4 md:p-6 opacity-0 animate-fade-in-up animation-delay-100 animation-fill-forwards">
      {/* Title */}
      <div className="mb-4 space-y-2">
        <ShimmerLine width="w-full" height="h-6" delay={150} />
        <ShimmerLine width="w-3/4" height="h-6" delay={200} />
      </div>

      {/* Rating & reviews */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <ShimmerBox key={i} className="w-5 h-5 rounded" delay={250 + i * 30} />
          ))}
        </div>
        <ShimmerLine width="w-20" height="h-4" delay={350} />
        <ShimmerLine width="w-16" height="h-4" delay={400} />
      </div>

      {/* Price section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <ShimmerLine width="w-12" height="h-4" delay={300} />
          <ShimmerBox className="w-32 h-10 rounded" delay={350} />
          <ShimmerLine width="w-16" height="h-4" delay={400} />
          <ShimmerBox className="w-12 h-6 rounded" delay={450} />
        </div>
        <ShimmerLine width="w-48" height="h-4" delay={500} />
      </div>

      {/* Stock */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <ShimmerLine width="w-12" height="h-4" delay={550} />
          <ShimmerLine width="w-24" height="h-4" delay={600} />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <ShimmerLine width="w-20" height="h-5" className="mb-3" delay={650} />
        <div className="space-y-2">
          <ShimmerLine width="w-full" height="h-4" delay={700} />
          <ShimmerLine width="w-full" height="h-4" delay={750} />
          <ShimmerLine width="w-4/5" height="h-4" delay={800} />
          <ShimmerLine width="w-3/5" height="h-4" delay={850} />
        </div>
      </div>

      {/* Seller info */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <ShimmerLine width="w-20" height="h-5" className="mb-3" delay={900} />
        <div className="space-y-2">
          <ShimmerLine width="w-32" height="h-4" delay={950} />
          <ShimmerLine width="w-24" height="h-3" delay={1000} />
        </div>
      </div>

      {/* Shipping info */}
      <ShimmerBox className="rounded-lg p-4" delay={1050}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShimmerBox className="w-5 h-5 rounded" delay={1100} />
            <ShimmerLine width="w-16" height="h-4" delay={1150} />
          </div>
          <div className="flex items-center gap-2">
            <ShimmerBox className="w-5 h-5 rounded" delay={1200} />
            <ShimmerLine width="w-24" height="h-4" delay={1250} />
          </div>
        </div>
      </ShimmerBox>
    </div>
  )
}

// Buy box skeleton
function BuyBoxSkeleton() {
  return (
    <div className="bg-white rounded p-4 border border-gray-200 opacity-0 animate-fade-in-up animation-delay-200 animation-fill-forwards">
      {/* Price */}
      <div className="mb-4">
        <ShimmerBox className="w-24 h-8 rounded mb-2" delay={200} />
        <ShimmerLine width="w-12" height="h-4" delay={250} />
      </div>

      {/* Quantity */}
      <div className="mb-4">
        <ShimmerLine width="w-12" height="h-4" className="mb-2" delay={300} />
        <ShimmerBox className="w-24 h-10 rounded" delay={350} />
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <ShimmerBox className="w-full h-10 rounded-lg" delay={400}>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-yellow-100/50" />
        </ShimmerBox>
        <ShimmerBox className="w-full h-10 rounded-lg" delay={450}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-amber-100/50" />
        </ShimmerBox>
      </div>

      {/* Secure transaction */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <ShimmerBox className="w-4 h-4 rounded" delay={500} />
          <ShimmerLine width="w-16" height="h-3" delay={550} />
        </div>
      </div>
    </div>
  )
}

// Loading header with animated text
function LoadingHeader() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Animated package icon */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse-slow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 blur-lg opacity-40 animate-pulse-slow" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              正在加载商品详情
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce-dot" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce-dot" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce-dot" style={{ animationDelay: '300ms' }} />
              </span>
            </h2>
            <p className="text-sm text-gray-500">精选好物，为您呈现</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Reviews section skeleton
function ReviewsSkeleton() {
  return (
    <div className="mt-6 opacity-0 animate-fade-in-up animation-delay-300 animation-fill-forwards">
      <ShimmerLine width="w-32" height="h-7" className="mb-6" delay={600} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <ShimmerLine width="w-20" height="h-5" className="mb-4" delay={650} />
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star, i) => (
                <div key={star} className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <ShimmerBox
                        key={j}
                        className="w-4 h-4 rounded"
                        delay={700 + i * 50 + j * 10}
                      />
                    ))}
                  </div>
                  <ShimmerBox className="flex-1 h-2 rounded-full" delay={750 + i * 50} />
                  <ShimmerLine width="w-8" height="h-3" delay={800 + i * 50} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews list skeleton */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="pb-6 border-b border-gray-100 last:border-0">
                  {/* Avatar & name */}
                  <div className="flex items-center gap-3 mb-3">
                    <ShimmerBox className="w-10 h-10 rounded-full" delay={900 + i * 100} />
                    <div>
                      <ShimmerLine width="w-24" height="h-4" delay={950 + i * 100} />
                      <ShimmerLine width="w-16" height="h-3" className="mt-1" delay={1000 + i * 100} />
                    </div>
                  </div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <ShimmerBox key={j} className="w-4 h-4 rounded" delay={1050 + i * 100 + j * 20} />
                    ))}
                  </div>
                  {/* Content */}
                  <div className="space-y-2">
                    <ShimmerLine width="w-full" height="h-4" delay={1100 + i * 100} />
                    <ShimmerLine width="w-3/4" height="h-4" delay={1150 + i * 100} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailSkeleton() {
  return (
    <div className="animate-fade-in">
      <LoadingHeader />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left - Images */}
          <div className="lg:col-span-5">
            <ImageGallerySkeleton />
          </div>

          {/* Middle - Product Info */}
          <div className="lg:col-span-5">
            <ProductInfoSkeleton />
          </div>

          {/* Right - Buy Box */}
          <div className="lg:col-span-2">
            <BuyBoxSkeleton />
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSkeleton />
      </div>
    </div>
  )
}

export { ImageGallerySkeleton, ProductInfoSkeleton, BuyBoxSkeleton, ReviewsSkeleton }
