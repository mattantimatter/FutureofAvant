import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateSignToken } from '@/lib/tokens'
import { z } from 'zod'

const schema = z.object({
  proposalId: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().nullable().optional(),
})

/**
 * POST /api/sign/guest
 * Creates a signer + signature_request on-the-fly for guest (no pre-assigned token) signers.
 * Returns a sign_token the client can use to call /api/sign/finalize.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const { proposalId, name, email, role } = parsed.data
    const supabase = createServerClient()

    // Verify proposal exists
    const { data: proposal } = await supabase
      .from('proposals')
      .select('id, status')
      .eq('id', proposalId)
      .single()

    if (!proposal) {
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 })
    }

    const signToken = generateSignToken()

    // Create signer
    const { data: signer, error: signerErr } = await supabase
      .from('signers')
      .insert({ proposal_id: proposalId, name, email, role: role ?? null })
      .select('id')
      .single()

    if (signerErr || !signer) {
      return NextResponse.json({ success: false, error: signerErr?.message ?? 'Failed to create signer' }, { status: 500 })
    }

    // Create signature request
    const { error: reqErr } = await supabase
      .from('signature_requests')
      .insert({
        proposal_id: proposalId,
        signer_id: signer.id,
        sign_token: signToken,
        status: 'viewed', // they're already in the flow
      })

    if (reqErr) {
      return NextResponse.json({ success: false, error: reqErr.message }, { status: 500 })
    }

    // Log audit event
    await supabase.from('audit_events').insert({
      proposal_id: proposalId,
      signer_id: signer.id,
      event_type: 'START_SIGN',
      event_meta: { source: 'guest_flow', name, email },
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      user_agent: req.headers.get('user-agent') ?? null,
    })

    return NextResponse.json({ success: true, signToken, signerId: signer.id })
  } catch (e) {
    console.error('[sign/guest]', e)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
