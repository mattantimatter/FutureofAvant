import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ProposalLayout } from '@/components/proposal/ProposalLayout'
import type { ProposalJSON } from '@/lib/seed'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

interface PageProps {
  params: Promise<{ token: string }>
  searchParams: Promise<{ st?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params
  const supabase = createServerClient()
  const { data: proposal } = await supabase
    .from('proposals')
    .select('title, client_name')
    .eq('public_token', token)
    .single()

  if (!proposal) {
    return { title: 'Proposal Not Found' }
  }

  return {
    title: `${proposal.title} — ${proposal.client_name} Proposal`,
    description: 'Interactive enterprise AI deployment proposal powered by ATOM.',
  }
}

export default async function ProposalViewerPage({ params, searchParams }: PageProps) {
  const { token } = await params
  const { st: signToken } = await searchParams

  const supabase = createServerClient()

  // Load proposal by public token
  const { data: proposal, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('public_token', token)
    .single()

  if (error || !proposal) {
    notFound()
  }

  // Log VIEW_PROPOSAL audit event (fire-and-forget)
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? null
  const userAgent = headersList.get('user-agent') ?? null

  // Find sign token if present and mark as viewed
  if (signToken) {
    const { data: sigReq } = await supabase
      .from('signature_requests')
      .select('id, signer_id, status')
      .eq('sign_token', signToken)
      .eq('proposal_id', proposal.id)
      .single()

    if (sigReq && sigReq.status === 'pending') {
      await supabase
        .from('signature_requests')
        .update({ status: 'viewed', updated_at: new Date().toISOString() })
        .eq('id', sigReq.id)
    }

    if (sigReq) {
      await supabase.from('audit_events').insert({
        proposal_id: proposal.id,
        signer_id: sigReq.signer_id,
        signature_request_id: sigReq.id,
        event_type: 'VIEW_PROPOSAL',
        event_meta: { source: 'sign_link', signToken },
        ip_address: ip,
        user_agent: userAgent,
      })
    }
  } else {
    await supabase.from('audit_events').insert({
      proposal_id: proposal.id,
      event_type: 'VIEW_PROPOSAL',
      event_meta: { source: 'public_link' },
      ip_address: ip,
      user_agent: userAgent,
    })
  }

  const proposalJson = proposal.proposal_json as unknown as ProposalJSON

  // Generate a 1-hour signed download URL for the source PDF (for the Download button)
  let sourcePdfDownloadUrl: string | null = null
  const pdfPath = proposal.signed_pdf_path ?? proposal.source_pdf_path
  if (pdfPath) {
    const bucket = proposal.signed_pdf_path ? 'proposal_signed_pdfs' : 'proposal_source_pdfs'
    const { data: urlData } = await supabase.storage.from(bucket).createSignedUrl(pdfPath, 3600)
    sourcePdfDownloadUrl = urlData?.signedUrl ?? null
  }

  return (
    <ProposalLayout
      proposal={proposal}
      proposalJson={proposalJson}
      signToken={signToken}
      sourcePdfDownloadUrl={sourcePdfDownloadUrl}
    />
  )
}
