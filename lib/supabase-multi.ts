/**
 * Multi-Session Supabase Clients
 *
 * This module provides separate Supabase client instances for each section
 * (main, seller, admin) with isolated localStorage keys for session storage.
 * This allows users to be logged in with different accounts simultaneously.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Extract project ID for key naming
const PROJECT_ID = SUPABASE_URL.split('//')[1].split('.')[0]

// Session types for the platform
export type SessionType = 'main' | 'seller' | 'admin'

// Get storage key for a specific session type
export function getStorageKey(sessionType: SessionType): string {
  return `sb-${PROJECT_ID}-auth-token-${sessionType}`
}

// Create a custom storage adapter for each session type
function createCustomStorage(sessionType: SessionType) {
  const storageKey = getStorageKey(sessionType)

  return {
    getItem: (key: string): string | null => {
      if (typeof window === 'undefined') return null
      // Use our custom key instead of the default
      return localStorage.getItem(storageKey)
    },
    setItem: (key: string, value: string): void => {
      if (typeof window === 'undefined') return
      localStorage.setItem(storageKey, value)
    },
    removeItem: (key: string): void => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(storageKey)
    }
  }
}

// Create Supabase client for main site (buyer)
export const supabaseMain: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: createCustomStorage('main'),
    storageKey: getStorageKey('main'),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Only enable for main site
  }
})

// Create Supabase client for seller section
export const supabaseSeller: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: createCustomStorage('seller'),
    storageKey: getStorageKey('seller'),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Prevent URL-based session conflicts
  }
})

// Create Supabase client for admin section
export const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: createCustomStorage('admin'),
    storageKey: getStorageKey('admin'),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Prevent URL-based session conflicts
  }
})

// Helper to get client by session type
export function getSupabaseClient(sessionType: SessionType): SupabaseClient {
  switch (sessionType) {
    case 'seller':
      return supabaseSeller
    case 'admin':
      return supabaseAdmin
    default:
      return supabaseMain
  }
}

// Check if token is expired (with 60 second buffer)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expTime = payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    const buffer = 60 * 1000 // 60 second buffer
    return now >= (expTime - buffer)
  } catch {
    return true // Assume expired if can't parse
  }
}

// Helper to get user token from localStorage for a specific session type
export function getUserToken(sessionType: SessionType = 'main'): string | null {
  if (typeof window === 'undefined') return null

  try {
    const storageKey = getStorageKey(sessionType)
    const authData = localStorage.getItem(storageKey)
    if (authData) {
      const parsed = JSON.parse(authData)
      const token = parsed?.access_token || parsed?.session?.access_token || null
      return token
    }
  } catch (error) {
    console.warn(`Failed to get ${sessionType} token:`, error)
  }
  return null
}

// Get valid token using SDK's getSession (handles refresh automatically)
export async function getValidToken(sessionType: SessionType = 'main'): Promise<string | null> {
  if (typeof window === 'undefined') return null

  const client = getSupabaseClient(sessionType)

  try {
    // Use SDK's getSession which auto-refreshes if needed
    const { data, error } = await client.auth.getSession()

    if (error) {
      console.warn(`[getValidToken] Error getting ${sessionType} session:`, error.message)
      return null
    }

    if (!data.session) {
      console.warn(`[getValidToken] No valid ${sessionType} session found`)
      return null
    }

    // Check if token is about to expire (within 60 seconds)
    if (isTokenExpired(data.session.access_token)) {
      console.log(`[getValidToken] Token about to expire, refreshing ${sessionType} session...`)
      const { data: refreshData, error: refreshError } = await client.auth.refreshSession()

      if (refreshError) {
        console.warn(`[getValidToken] Failed to refresh ${sessionType} session:`, refreshError.message)
        // Still return the current token if available, let the API call handle the error
        return data.session.access_token
      }

      if (refreshData.session?.access_token) {
        console.log(`[getValidToken] Successfully refreshed ${sessionType} session`)
        return refreshData.session.access_token
      }
    }

    return data.session.access_token
  } catch (err) {
    console.error(`[getValidToken] Unexpected error for ${sessionType}:`, err)
    return null
  }
}

// Helper to clear token for a specific session type
export function clearToken(sessionType: SessionType = 'main'): void {
  if (typeof window === 'undefined') return

  try {
    const storageKey = getStorageKey(sessionType)
    localStorage.removeItem(storageKey)
    console.log(`Cleared ${sessionType} session token`)
  } catch (error) {
    console.warn(`Failed to clear ${sessionType} token:`, error)
  }
}
