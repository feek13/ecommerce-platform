'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseAdmin, getStorageKey } from '@/lib/supabase-multi'
import type { Profile } from '@/types/database'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      console.log('[AdminAuthProvider] Fetching profile for admin:', userId)

      // Get admin token from localStorage
      let userToken = null
      try {
        const authData = localStorage.getItem(getStorageKey('admin'))
        if (authData) {
          const parsed = JSON.parse(authData)
          userToken = parsed?.access_token || null
        }
      } catch (e) {
        console.warn('Failed to get admin token:', e)
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
        console.warn('Admin profile fetch error:', response.status, errorText)
        setProfile(null)
        return
      }

      const data = await response.json()

      if (!data || data.length === 0) {
        console.warn('No admin profile found for user:', userId)
        setProfile(null)
        return
      }

      console.log('[AdminAuthProvider] Profile loaded:', { role: data[0].role, email: data[0].email })
      setProfile(data[0])
    } catch (error) {
      console.warn('Error fetching admin profile:', error)
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
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
      await supabaseAdmin.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out admin:', error)
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
      console.log('[AdminAuthProvider] Getting admin session...')
      try {
        const { data: { session } } = await supabaseAdmin.auth.getSession()

        console.log('[AdminAuthProvider] Session received:', { hasSession: !!session, userId: session?.user?.id })

        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.log('[AdminAuthProvider] No admin session found')
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabaseAdmin.auth.onAuthStateChange(
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
    <AdminAuthContext.Provider
      value={{ user, profile, loading, signIn, signOut, refreshProfile }}
    >
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
