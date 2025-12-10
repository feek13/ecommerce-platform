/**
 * Supabase Client - Backward Compatibility Exports
 *
 * This file re-exports the main site Supabase client for backward compatibility.
 * For multi-session support, import from './supabase-multi' instead.
 */

// Re-export main site client for backward compatibility
export { supabaseMain as supabase, supabaseMain as supabaseAuth } from './supabase-multi'

// Also export multi-session utilities for convenience
export { getStorageKey, getUserToken, clearToken } from './supabase-multi'
export type { SessionType } from './supabase-multi'
