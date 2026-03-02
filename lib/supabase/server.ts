import { createClient, SupabaseClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = SupabaseClient<any, any, any>

/**
 * Server-side Supabase client using the service role key.
 * Bypasses RLS — only use in server actions, API routes, and server components.
 * Never expose this to the client.
 */
export function createServerClient(): AnyClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn(
      '[Supabase] Missing environment variables. ' +
      'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
    return createClient(url ?? 'https://placeholder.supabase.co', key ?? 'placeholder', {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
