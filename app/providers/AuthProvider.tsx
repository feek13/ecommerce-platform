'use client'

/**
 * Main Site Auth Provider
 *
 * Provides authentication context for the main buyer-facing site.
 * Uses factory pattern to share logic with Admin and Seller providers.
 *
 * Key features:
 * - 3-second timeout for guest-friendly experience
 * - No signIn method (uses redirect to /login page)
 * - Isolated session from admin/seller sections
 */

import { createContext, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { useMainAuthLogic } from '@/hooks/useAuthFactory'
import type { Profile } from '@/types/database'

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useMainAuthLogic()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
