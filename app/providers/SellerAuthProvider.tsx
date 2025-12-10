'use client'

/**
 * Seller Auth Provider
 *
 * Provides authentication context for the seller dashboard.
 * Uses factory pattern to share logic with Main and Admin providers.
 *
 * Key features:
 * - Includes signIn method for seller login page
 * - No session timeout (seller must be authenticated)
 * - Isolated session from main/admin sections
 */

import { createContext, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { useSellerAuthLogic } from '@/hooks/useAuthFactory'
import type { Profile } from '@/types/database'

type SellerAuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const SellerAuthContext = createContext<SellerAuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function SellerAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useSellerAuthLogic()

  return (
    <SellerAuthContext.Provider value={auth}>
      {children}
    </SellerAuthContext.Provider>
  )
}

export function useSellerAuth() {
  const context = useContext(SellerAuthContext)
  if (context === undefined) {
    throw new Error('useSellerAuth must be used within a SellerAuthProvider')
  }
  return context
}
