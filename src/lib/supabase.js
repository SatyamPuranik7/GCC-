import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('[GCC Atlas] Supabase URL or Anon Key is missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

/** Safely unwrap a supabase result, logging errors and returning an empty array. */
export function unwrap(result) {
  if (result.error) {
    console.warn('[Supabase]', result.error.message)
    return []
  }
  return result.data ?? []
}
