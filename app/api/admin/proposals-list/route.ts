import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('proposals')
      .select('id, title, client_name, status, public_token, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ proposals: data ?? [] })
  } catch (error) {
    console.error('[proposals-list]', error)
    return NextResponse.json({ proposals: [] })
  }
}
