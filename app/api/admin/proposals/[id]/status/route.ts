import { NextRequest, NextResponse } from 'next/server'
import { updateProposalStatus } from '@/lib/actions/proposals'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await req.json()

    if (!['draft', 'sent', 'signed'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
    }

    await updateProposalStatus(id, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/proposals/status]', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
