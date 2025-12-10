/**
 * Stats Card Component
 *
 * Reusable statistics card for dashboard pages.
 * Eliminates duplicate card styling across admin and seller dashboards.
 */

import Link from 'next/link'

type ColorScheme = 'default' | 'yellow' | 'blue' | 'purple' | 'green' | 'gray' | 'orange' | 'red'

interface StatsCardProps {
  value: number | string
  label: string
  icon?: React.ReactNode | string
  color?: ColorScheme
  href?: string
  badge?: number
  className?: string
}

const colorStyles: Record<ColorScheme, { border: string; bg: string; text: string }> = {
  default: {
    border: 'border-gray-100',
    bg: 'bg-white',
    text: 'text-gray-900',
  },
  yellow: {
    border: 'border-yellow-200',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
  },
  blue: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  purple: {
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
  },
  green: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    text: 'text-green-700',
  },
  gray: {
    border: 'border-gray-200',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
  },
  orange: {
    border: 'border-orange-200',
    bg: 'bg-gradient-to-br from-orange-50 to-red-50',
    text: 'text-orange-700',
  },
  red: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-700',
  },
}

export default function StatsCard({
  value,
  label,
  icon,
  color = 'default',
  href,
  badge,
  className = '',
}: StatsCardProps) {
  const styles = colorStyles[color]

  const content = (
    <>
      {/* Icon and Badge Row */}
      {(icon || badge !== undefined) && (
        <div className="flex items-center justify-between mb-3 md:mb-4">
          {icon && (
            <div className={`w-10 h-10 md:w-12 md:h-12 ${styles.bg} rounded-lg md:rounded-xl flex items-center justify-center`}>
              {typeof icon === 'string' ? (
                <span className="text-xl md:text-2xl">{icon}</span>
              ) : (
                icon
              )}
            </div>
          )}
          {badge !== undefined && badge > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Value */}
      <p className={`text-xl md:text-2xl font-bold ${styles.text}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      {/* Label */}
      <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">{label}</p>
    </>
  )

  const baseClassName = `bg-white rounded-lg shadow-sm p-3 md:p-4 border ${styles.border} ${styles.bg} ${className}`

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClassName} block hover:shadow-md transition-shadow cursor-pointer`}
      >
        {content}
      </Link>
    )
  }

  return <div className={baseClassName}>{content}</div>
}

/**
 * Revenue Card - Special gradient card for revenue display
 */
interface RevenueCardProps {
  value: number
  label: string
  icon?: string
  className?: string
}

export function RevenueCard({ value, label, icon = '💰', className = '' }: RevenueCardProps) {
  return (
    <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm p-4 md:p-6 text-white ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm opacity-90 mb-1">{label}</p>
          <p className="text-2xl md:text-3xl font-bold">¥{value.toFixed(2)}</p>
        </div>
        <div className="text-3xl md:text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  )
}
