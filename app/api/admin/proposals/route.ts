import { NextRequest, NextResponse } from 'next/server'
import { createProposal } from '@/lib/actions/proposals'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const result = await createProposal(formData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[admin/proposals POST]', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
