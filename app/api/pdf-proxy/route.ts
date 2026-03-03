import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/pdf-proxy?path=<storage_path>&bucket=<bucket_name>
 * Generates a signed Supabase Storage URL and redirects to it.
 * Used for inline PDF preview in the sign flow.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const path = searchParams.get('path')
  const bucket = searchParams.get('bucket') ?? 'proposal_source_pdfs'

  if (!path) {
    return NextResponse.json({ error: 'path is required' }, { status: 400 })
  }

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600) // 1 hour

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: 'Could not generate PDF URL' }, { status: 404 })
    }

    // Redirect to the signed URL (browser loads PDF directly from Supabase CDN)
    return NextResponse.redirect(data.signedUrl)
  } catch (e) {
    console.error('[pdf-proxy]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
