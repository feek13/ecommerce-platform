'use client'

import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
}

export default function StarRating({
  value,
  onChange,
  size = 'md',
  readonly = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${sizeClasses[size]} transition-all ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${
            star <= (hoverRating || value)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
