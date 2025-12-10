/**
 * Hooks Index
 *
 * Centralized exports for all custom hooks.
 */

// Auth hooks (re-export from existing files for backwards compatibility)
export { useAuth } from './useAuth'
export { useCart } from './useCart'
export { useChat } from './useChat'

// New hooks
export { useToast } from './useToast'
export type { ToastType, ToastState } from './useToast'

export { useConfirmDialog } from './useConfirmDialog'
export type { ConfirmDialogType, ConfirmDialogState, ShowConfirmOptions } from './useConfirmDialog'

// Auth factory (for advanced usage)
export {
  createAuthLogic,
  useMainAuthLogic,
  useAdminAuthLogic,
  useSellerAuthLogic,
} from './useAuthFactory'
export type { AuthState, BaseAuthActions, ExtendedAuthActions, AuthConfig } from './useAuthFactory'
