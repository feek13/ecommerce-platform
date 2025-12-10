'use client'

/**
 * Auth Provider Factory
 *
 * This factory creates auth hooks for different session types (main, seller, admin)
 * to eliminate code duplication across AuthProvider, AdminAuthProvider, and SellerAuthProvider.
 *
 * Key differences between session types:
 * - main: Has session timeout (3s) for guest-friendly experience, no signIn method
 * - seller/admin: No timeout, has signIn method for login page
 */

import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import {
  SessionType,
  getStorageKey,
  getSupabaseClient,
  getUserToken
} from '@/lib/supabase-multi'
import type { Profile } from '@/types/database'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Auth state shared by all providers
export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

// Base auth actions (without signIn)
export interface BaseAuthActions {
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// Extended auth actions (with signIn for admin/seller)
export interface ExtendedAuthActions extends BaseAuthActions {
  signIn: (email: string, password: string) => Promise<{ error: any }>
}

// Config for creating auth logic
export interface AuthConfig {
  sessionType: SessionType
  includeSignIn: boolean
  sessionTimeout?: number  // Only for main session (guest-friendly)
  debugLabel?: string      // For console logs
}

/**
 * Creates auth logic hook for a specific session type
 * Returns a custom hook that provides auth state and actions
 */
export function createAuthLogic<T extends boolean = false>(
  config: AuthConfig
): () => AuthState & (T extends true ? ExtendedAuthActions : BaseAuthActions) {
  const {
    sessionType,
    includeSignIn,
    sessionTimeout,
    debugLabel = sessionType.toUpperCase()
  } = config

  const client = getSupabaseClient(sessionType)

  return function useAuthLogic() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch profile using direct fetch (SDK has browser hanging issues)
    const fetchProfile = useCallback(async (userId: string) => {
      try {
        console.log(`[${debugLabel}AuthProvider] Fetching profile for user:`, userId)

        // Get token from localStorage for this session type
        const userToken = getUserToken(sessionType)

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${userToken || SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.warn(`[${debugLabel}] Profile fetch error:`, response.status, errorText)
          setProfile(null)
          return
        }

        const data = await response.json()

        if (!data || data.length === 0) {
          console.warn(`[${debugLabel}] No profile found for user:`, userId)
          setProfile(null)
          return
        }

        console.log(`[${debugLabel}AuthProvider] Profile loaded:`, {
          role: data[0].role,
          email: data[0].email
        })
        setProfile(data[0])
      } catch (error) {
        console.warn(`[${debugLabel}] Error fetching profile:`, error)
        setProfile(null)
      }
    }, [])

    // Sign out - available for all session types
    const signOut = useCallback(async () => {
      try {
        await client.auth.signOut()
        setUser(null)
        setProfile(null)
      } catch (error) {
        console.error(`[${debugLabel}] Error signing out:`, error)
      }
    }, [])

    // Refresh profile - available for all session types
    const refreshProfile = useCallback(async () => {
      if (user) {
        await fetchProfile(user.id)
      }
    }, [user, fetchProfile])

    // Sign in - only for admin/seller
    const signIn = useCallback(async (email: string, password: string) => {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          return { error }
        }

        if (data.user) {
          setUser(data.user)
          await fetchProfile(data.user.id)
        }

        return { error: null }
      } catch (error) {
        return { error }
      }
    }, [fetchProfile])

    // Initialize session on mount
    useEffect(() => {
      const getSession = async () => {
        console.log(`[${debugLabel}AuthProvider] Getting session...`)
        try {
          let sessionPromise = client.auth.getSession()

          // Apply timeout only for main session (guest-friendly)
          if (sessionTimeout) {
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Session timeout - continuing as guest')), sessionTimeout)
            )
            sessionPromise = Promise.race([sessionPromise, timeoutPromise]) as any
          }

          const { data: { session } } = await sessionPromise

          console.log(`[${debugLabel}AuthProvider] Session received:`, {
            hasSession: !!session,
            userId: session?.user?.id
          })

          setUser(session?.user ?? null)

          if (session?.user) {
            await fetchProfile(session.user.id)
          }
        } catch (error) {
          // For main session with timeout, silently fail for guests
          if (sessionTimeout) {
            console.log(`[${debugLabel}AuthProvider] No session found, continuing as guest`)
          } else {
            console.log(`[${debugLabel}AuthProvider] No session found`)
          }
          setUser(null)
          setProfile(null)
        } finally {
          console.log(`[${debugLabel}AuthProvider] Auth initialized`)
          setLoading(false)
        }
      }

      getSession()

      // Listen for auth state changes
      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (_event, session) => {
          setUser(session?.user ?? null)

          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }

          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }, [fetchProfile])

    // Return state and actions based on config
    const baseResult = {
      user,
      profile,
      loading,
      signOut,
      refreshProfile,
    }

    if (includeSignIn) {
      return {
        ...baseResult,
        signIn,
      } as any
    }

    return baseResult as any
  }
}

// Pre-configured hooks for each session type
export const useMainAuthLogic = createAuthLogic({
  sessionType: 'main',
  includeSignIn: false,
  sessionTimeout: 3000,
  debugLabel: 'Auth'
})

export const useAdminAuthLogic = createAuthLogic<true>({
  sessionType: 'admin',
  includeSignIn: true,
  debugLabel: 'AdminAuth'
})

export const useSellerAuthLogic = createAuthLogic<true>({
  sessionType: 'seller',
  includeSignIn: true,
  debugLabel: 'SellerAuth'
})
