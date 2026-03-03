import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    // Delete the proposal — cascade will remove signers, signature_requests, audit_events
    const { error } = await supabase.from('proposals').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    revalidatePath('/admin')
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[DELETE /admin/proposals/[id]]', e)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
