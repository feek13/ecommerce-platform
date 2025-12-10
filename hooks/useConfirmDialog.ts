'use client'

/**
 * Confirm Dialog Hook
 *
 * Provides confirmation dialog state management.
 * Replaces repeated confirmDialog state definitions across 15+ page components.
 *
 * Usage:
 * const { dialog, showConfirm, hideConfirm } = useConfirmDialog()
 *
 * // Show dialog
 * showConfirm({
 *   title: '确认删除',
 *   message: '确定要删除此项目吗？',
 *   type: 'danger',
 *   onConfirm: async () => {
 *     await deleteItem()
 *   }
 * })
 *
 * // In JSX
 * <ConfirmDialog
 *   isOpen={dialog.isOpen}
 *   title={dialog.title}
 *   message={dialog.message}
 *   type={dialog.type}
 *   onConfirm={dialog.onConfirm}
 *   onCancel={hideConfirm}
 * />
 */

import { useState, useCallback } from 'react'

export type ConfirmDialogType = 'danger' | 'warning' | 'info'

export interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  type: ConfirmDialogType
  onConfirm: () => void | Promise<void>
}

export interface ShowConfirmOptions {
  title: string
  message: string
  type?: ConfirmDialogType
  onConfirm: () => void | Promise<void>
}

const initialState: ConfirmDialogState = {
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  onConfirm: () => {},
}

export function useConfirmDialog() {
  const [dialog, setDialog] = useState<ConfirmDialogState>(initialState)

  const showConfirm = useCallback((options: ShowConfirmOptions) => {
    setDialog({
      isOpen: true,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      onConfirm: async () => {
        await options.onConfirm()
        setDialog(initialState)
      },
    })
  }, [])

  const hideConfirm = useCallback(() => {
    setDialog(initialState)
  }, [])

  // Convenience method that wraps the callback with auto-close
  const confirm = useCallback(async () => {
    await dialog.onConfirm()
  }, [dialog.onConfirm])

  return {
    dialog,
    showConfirm,
    hideConfirm,
    confirm,
  }
}
