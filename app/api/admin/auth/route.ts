import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('[admin/auth] ADMIN_PASSWORD env var not set')
      return NextResponse.json({ success: false, error: 'Admin not configured' }, { status: 500 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
