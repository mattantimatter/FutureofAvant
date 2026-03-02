import { NextRequest, NextResponse } from 'next/server'
import { submitSignature } from '@/lib/actions/sign'

/**
 * API route that wraps the submitSignature server action.
 * Called by the client-side sign flow to avoid full-page form submission.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Capture server-side IP if client didn't provide one
    if (!formData.get('ipAddress')) {
      const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        req.headers.get('x-real-ip') ??
        null
      if (ip) formData.set('ipAddress', ip)
    }

    const result = await submitSignature(formData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[/api/sign/finalize] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
