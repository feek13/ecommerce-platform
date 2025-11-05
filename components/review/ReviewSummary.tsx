'use client'

import StarRating from './StarRating'

interface ReviewSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
}

export default function ReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution
}: ReviewSummaryProps) {
  const maxCount = Math.max(...Object.values(ratingDistribution), 1)

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">用户评价</h3>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Left: Average Rating */}
        <div className="text-center md:border-r border-gray-200">
          <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-3">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            <StarRating value={averageRating} onChange={() => {}} readonly size="lg" />
          </div>
          <p className="text-sm md:text-base text-gray-600">
            共 {totalReviews} 条评价
          </p>
        </div>

        {/* Right: Rating Distribution */}
        <div className="space-y-2 md:space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars] || 0
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

            return (
              <div key={stars} className="flex items-center gap-2 md:gap-3">
                <span className="text-xs md:text-sm text-gray-600 w-12 flex-shrink-0">
                  {stars} 星
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 md:h-2.5 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs md:text-sm text-gray-600 w-10 md:w-12 text-right flex-shrink-0">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
