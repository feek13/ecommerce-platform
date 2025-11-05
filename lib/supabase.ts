import { createClient } from '@supabase/supabase-js'

// Browser client for client-side components
// This will automatically handle localStorage session persistence
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Alias for backwards compatibility
export const supabaseAuth = supabase
