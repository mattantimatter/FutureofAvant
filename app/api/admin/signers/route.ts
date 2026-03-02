import { NextRequest, NextResponse } from 'next/server'
import { addSigner } from '@/lib/actions/signers'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const result = await addSigner(formData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[admin/signers POST]', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
