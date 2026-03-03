import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Trim both sides to guard against newline artifacts in env vars or user input
    const password = String(body.password ?? '').trim()
    const adminPassword = String(process.env.ADMIN_PASSWORD ?? '').trim()

    if (!adminPassword) {
      console.error('[admin/auth] ADMIN_PASSWORD env var not set')
      return NextResponse.json({ success: false, error: 'Admin not configured' }, { status: 500 })
    }

    console.log('[admin/auth] attempting login, password length:', password.length, 'expected length:', adminPassword.length)

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('admin_session')
  return res
}
