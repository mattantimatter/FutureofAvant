import { NextRequest, NextResponse } from 'next/server'

/**
 * Simple endpoint that returns the client's IP address.
 * Used by the sign flow to capture IP for audit trail.
 */
export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  return NextResponse.json({ ip })
}
