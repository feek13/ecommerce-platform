'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseMain, getStorageKey } from '@/lib/supabase-multi'
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
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      console.log('[AuthProvider] Fetching profile for user:', userId)

      // Use direct fetch instead of SDK to avoid hanging
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      // Get user token from localStorage (using main session key)
      let userToken = null
      try {
        const authData = localStorage.getItem(getStorageKey('main'))
        if (authData) {
          const parsed = JSON.parse(authData)
          userToken = parsed?.access_token || null
        }
      } catch (e) {
        console.warn('Failed to get user token:', e)
      }

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
        console.warn('Profile fetch error:', response.status, errorText)
        setProfile(null)
        return
      }

      const data = await response.json()

      if (!data || data.length === 0) {
        console.warn('No profile found for user:', userId)
        setProfile(null)
        return
      }

      console.log('[AuthProvider] Profile loaded:', { role: data[0].role, email: data[0].email })
      setProfile(data[0])
    } catch (error) {
      console.warn('Error fetching profile:', error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      console.log('[AuthProvider] Getting session...')
      try {
        // Add a short timeout since Supabase SDK is not working properly in browser
        // Guests don't need auth, so fail fast and continue
        const sessionPromise = supabaseMain.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session timeout - continuing as guest')), 3000)
        )

        const {
          data: { session },
        } = await Promise.race([sessionPromise, timeoutPromise]) as any

        console.log('[AuthProvider] Session received:', { hasSession: !!session, userId: session?.user?.id })

        setUser(session?.user ?? null)

        if (session?.user) {
          console.log('[AuthProvider] Fetching profile for user:', session.user.id)
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        // Silently fail for guests - they don't need auth
        console.log('[AuthProvider] No session found, continuing as guest')
        setUser(null)
        setProfile(null)
      } finally {
        console.log('[AuthProvider] Auth initialized')
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabaseMain.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await supabaseMain.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, refreshProfile }}
    >
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
