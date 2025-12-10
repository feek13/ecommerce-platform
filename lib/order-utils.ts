/**
 * Order Utilities
 *
 * Shared utilities for order-related functionality.
 * Eliminates duplicate getStatusText implementations across order pages.
 */

import type { OrderStatus } from '@/types/database'

export interface StatusDisplay {
  text: string
  color: string
}

// Unified status mapping with consistent colors
const ORDER_STATUS_MAP: Record<string, StatusDisplay> = {
  pending: { text: '待付款', color: 'bg-yellow-100 text-yellow-800' },
  paid: { text: '已付款', color: 'bg-blue-100 text-blue-800' },
  processing: { text: '处理中', color: 'bg-indigo-100 text-indigo-800' },
  shipped: { text: '已发货', color: 'bg-purple-100 text-purple-800' },
  delivered: { text: '已送达', color: 'bg-green-100 text-green-800' },
  cancelled: { text: '已取消', color: 'bg-gray-100 text-gray-800' },
  refunded: { text: '已退款', color: 'bg-red-100 text-red-800' },
}

// Status text for confirmations and labels
export const ORDER_STATUS_TEXT: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  processing: '处理中',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消',
  refunded: '已退款',
}

/**
 * Get display text and color class for an order status
 */
export function getOrderStatusDisplay(status: string): StatusDisplay {
  return ORDER_STATUS_MAP[status] || { text: status, color: 'bg-gray-100 text-gray-800' }
}

/**
 * Get Chinese text for an order status
 */
export function getOrderStatusText(status: string): string {
  return ORDER_STATUS_TEXT[status] || status
}

/**
 * Check if order is in a final state (can't be changed)
 */
export function isOrderFinal(status: string): boolean {
  return ['delivered', 'cancelled', 'refunded'].includes(status)
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(status: string): boolean {
  return ['pending', 'paid'].includes(status)
}

/**
 * Get next possible status transitions for an order
 */
export function getNextStatusOptions(status: string): string[] {
  switch (status) {
    case 'pending':
      return ['paid', 'cancelled']
    case 'paid':
      return ['shipped', 'cancelled', 'refunded']
    case 'shipped':
      return ['delivered']
    default:
      return []
  }
}
