'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseSeller, getStorageKey } from '@/lib/supabase-multi'
import type { Profile } from '@/types/database'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      console.log('[SellerAuthProvider] Fetching profile for seller:', userId)

      // Get seller token from localStorage
      let userToken = null
      try {
        const authData = localStorage.getItem(getStorageKey('seller'))
        if (authData) {
          const parsed = JSON.parse(authData)
          userToken = parsed?.access_token || null
        }
      } catch (e) {
        console.warn('Failed to get seller token:', e)
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
        console.warn('Seller profile fetch error:', response.status, errorText)
        setProfile(null)
        return
      }

      const data = await response.json()

      if (!data || data.length === 0) {
        console.warn('No seller profile found for user:', userId)
        setProfile(null)
        return
      }

      console.log('[SellerAuthProvider] Profile loaded:', { role: data[0].role, email: data[0].email })
      setProfile(data[0])
    } catch (error) {
      console.warn('Error fetching seller profile:', error)
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseSeller.auth.signInWithPassword({
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
  }

  const signOut = async () => {
    try {
      await supabaseSeller.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out seller:', error)
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
      console.log('[SellerAuthProvider] Getting seller session...')
      try {
        const { data: { session } } = await supabaseSeller.auth.getSession()

        console.log('[SellerAuthProvider] Session received:', { hasSession: !!session, userId: session?.user?.id })

        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.log('[SellerAuthProvider] No seller session found')
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabaseSeller.auth.onAuthStateChange(
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
  }, [])

  return (
    <SellerAuthContext.Provider
      value={{ user, profile, loading, signIn, signOut, refreshProfile }}
    >
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
