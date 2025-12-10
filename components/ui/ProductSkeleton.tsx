'use client'

/**
 * Product Skeleton Loading Component
 *
 * Elegant shimmer effect skeleton for product grid loading states.
 * Uses a flowing gradient animation that mimics light reflection.
 */

interface ProductSkeletonProps {
  count?: number
}

// Single product card skeleton
function SkeletonCard() {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image skeleton with shimmer */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        {/* Decorative placeholder icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm16 3.586L12 16.5 4 8.586V17h16V8.586zM4.878 7h14.244L12 13.929 4.878 7z"/>
          </svg>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-3 md:p-4 space-y-3">
        {/* Title skeleton - two lines */}
        <div className="space-y-2">
          <div className="relative h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="relative h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>

        {/* Price skeleton */}
        <div className="flex items-baseline gap-2">
          <div className="relative h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="relative h-4 w-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="relative w-3.5 h-3.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-sm overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 50}ms` }} />
              </div>
            ))}
          </div>
          <div className="relative h-3 w-8 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>

        {/* Seller info skeleton */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="relative h-3 w-16 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Elegant loading header with animated dots
function LoadingHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Animated shopping bag icon */}
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse-slow">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 blur-lg opacity-40 animate-pulse-slow" />
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          正在加载商品
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce-dot" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce-dot" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce-dot" style={{ animationDelay: '300ms' }} />
          </span>
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">精选好物，即将呈现</p>
      </div>
    </div>
  )
}

export default function ProductSkeleton({ count = 10 }: ProductSkeletonProps) {
  return (
    <div className="animate-fade-in">
      <LoadingHeader />

      {/* Skeleton grid with staggered animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className="opacity-0 animate-fade-in-up"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  )
}

// Export individual skeleton card for reuse
export { SkeletonCard, LoadingHeader }
