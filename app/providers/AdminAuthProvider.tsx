'use client'

/**
 * Admin Auth Provider
 *
 * Provides authentication context for the admin dashboard.
 * Uses factory pattern to share logic with Main and Seller providers.
 *
 * Key features:
 * - Includes signIn method for admin login page
 * - No session timeout (admin must be authenticated)
 * - Isolated session from main/seller sections
 */

import { createContext, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { useAdminAuthLogic } from '@/hooks/useAuthFactory'
import type { Profile } from '@/types/database'

type AdminAuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAdminAuthLogic()

  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
