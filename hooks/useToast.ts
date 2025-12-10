'use client'

/**
 * Toast Hook
 *
 * Provides toast notification state management.
 * Replaces repeated toast state definitions across 18+ page components.
 *
 * Usage:
 * const { toast, showToast, success, error, warning, hideToast } = useToast()
 *
 * // Show toast
 * success('操作成功')
 * error('操作失败')
 * warning('请注意')
 * showToast('自定义消息', 'info')
 *
 * // In JSX
 * {toast && <Toast {...toast} onClose={hideToast} />}
 */

import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastState {
  message: string
  type: ToastType
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  // Convenience methods
  const success = useCallback((message: string) => {
    showToast(message, 'success')
  }, [showToast])

  const error = useCallback((message: string) => {
    showToast(message, 'error')
  }, [showToast])

  const warning = useCallback((message: string) => {
    showToast(message, 'warning')
  }, [showToast])

  const info = useCallback((message: string) => {
    showToast(message, 'info')
  }, [showToast])

  return {
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  }
}
