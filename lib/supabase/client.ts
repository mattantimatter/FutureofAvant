import { createClient } from '@supabase/supabase-js'

/**
 * Client-side Supabase client using the anon key.
 * Subject to RLS policies. Safe to use in browser.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'
  return createClient(url, key)
}

// Singleton for use in client components
let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!clientInstance) {
    clientInstance = createBrowserClient()
  }
  return clientInstance
}
