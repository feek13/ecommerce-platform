'use client'

import { useState } from 'react'

interface ReviewFiltersProps {
  stats: {
    total: number
    average: number
    distribution: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
  selectedRating: number | null
  onFilterChange: (rating: number | null) => void
}

export default function ReviewFilters({
  stats,
  selectedRating,
  onFilterChange
}: ReviewFiltersProps) {
  const getPercentage = (count: number) => {
    if (stats.total === 0) return 0
    return Math.round((count / stats.total) * 100)
  }

  const ratingLabels: { [key: number]: string } = {
    5: '非常满意',
    4: '满意',
    3: '一般',
    2: '不满意',
    1: '非常不满意'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      {/* Summary */}
      <div className="border-b pb-4 mb-4">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            {stats.average.toFixed(1)}
          </span>
          <span className="text-base md:text-lg text-gray-600">/ 5.0</span>
        </div>
        <p className="text-sm md:text-base text-gray-600">
          共 <span className="font-medium text-gray-900">{stats.total}</span> 条评价
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-2">
        {/* All Reviews */}
        <button
          onClick={() => onFilterChange(null)}
          className={`w-full flex items-center justify-between p-2.5 md:p-3 rounded-lg border transition-all ${
            selectedRating === null
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <span className="text-sm md:text-base font-medium">全部评价</span>
          <span className="text-xs md:text-sm text-gray-500">
            {stats.total}
          </span>
        </button>

        {/* Star Rating Filters */}
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.distribution[rating as keyof typeof stats.distribution]
          const percentage = getPercentage(count)

          return (
            <button
              key={rating}
              onClick={() => onFilterChange(rating)}
              className={`w-full p-2.5 md:p-3 rounded-lg border transition-all ${
                selectedRating === rating
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-sm md:text-base">
                    {'★'.repeat(rating)}
                  </span>
                  <span className="text-xs md:text-sm text-gray-600">
                    {ratingLabels[rating]}
                  </span>
                </div>
                <span className="text-xs md:text-sm text-gray-500">
                  {count}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
