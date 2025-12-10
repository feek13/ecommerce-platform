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

// Refresh token if expired and return new token
export async function getValidToken(sessionType: SessionType = 'main'): Promise<string | null> {
  if (typeof window === 'undefined') return null

  const currentToken = getUserToken(sessionType)

  // If no token, return null
  if (!currentToken) {
    console.log(`[getValidToken] No token for ${sessionType}`)
    return null
  }

  // Check token expiration details
  try {
    const payload = JSON.parse(atob(currentToken.split('.')[1]))
    const expTime = new Date(payload.exp * 1000)
    const now = new Date()
    console.log(`[getValidToken] Token exp: ${expTime.toISOString()}, now: ${now.toISOString()}, expired: ${isTokenExpired(currentToken)}`)
  } catch (e) {
    console.log(`[getValidToken] Could not decode token`)
  }

  // Check if token is expired
  if (isTokenExpired(currentToken)) {
    console.log(`[getValidToken] Token expired for ${sessionType}, refreshing...`)

    // Use SDK to refresh the token
    const client = getSupabaseClient(sessionType)
    const { data, error } = await client.auth.refreshSession()

    if (error) {
      console.warn(`[getValidToken] Failed to refresh ${sessionType} token:`, error.message)
      return null
    }

    if (data.session?.access_token) {
      console.log(`[getValidToken] Token refreshed for ${sessionType}`)
      return data.session.access_token
    }

    return null
  }

  return currentToken
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
