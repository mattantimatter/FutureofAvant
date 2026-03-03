import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { defaultProposalJSON } from '@/lib/seed'
import { revalidatePath } from 'next/cache'

/**
 * POST /api/admin/proposals/[id]/reseed
 * Overwrites proposal_json with the latest defaultProposalJSON from seed.ts.
 * Preserves all other proposal fields (status, signers, PDFs, etc.)
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { error } = await supabase
      .from('proposals')
      .update({
        proposal_json: defaultProposalJSON as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    revalidatePath(`/admin/proposals/${id}`)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[reseed]', e)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
