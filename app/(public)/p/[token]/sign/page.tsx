import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { SignFlowClient } from './SignFlowClient'
import type { ProposalJSON } from '@/lib/seed'

interface PageProps {
  params: Promise<{ token: string }>
  searchParams: Promise<{ st?: string }>
}

export default async function SignPage({ params, searchParams }: PageProps) {
  const { token } = await params
  const { st: signToken } = await searchParams

  const supabase = createServerClient()

  // Load proposal
  const { data: proposal, error: propError } = await supabase
    .from('proposals')
    .select('*')
    .eq('public_token', token)
    .single()

  if (propError || !proposal) notFound()

  const proposalJson = (proposal as { proposal_json: ProposalJSON }).proposal_json

  // ── With sign token: load the specific signer's request ──────────
  if (signToken) {
    const { data: sigReq, error } = await supabase
      .from('signature_requests')
      .select('*, signers!inner(*), proposals!inner(*)')
      .eq('sign_token', signToken)
      .single()

    if (error || !sigReq) notFound()

    // Validate token belongs to this proposal
    const reqProposal = sigReq.proposals as unknown as { public_token: string }
    if (reqProposal.public_token !== token) notFound()

    if (sigReq.status === 'signed') {
      redirect(`/p/${token}/signed?st=${signToken}`)
    }

    const signer = sigReq.signers as unknown as { id: string; name: string; email: string; role: string | null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldPositions = (sigReq as any).field_positions ?? []

    return (
      <SignFlowClient
        signToken={signToken}
        proposalToken={token}
        proposal={{ id: proposal.id, title: proposal.title, client_name: proposal.client_name, source_pdf_path: proposal.source_pdf_path, public_token: proposal.public_token }}
        proposalJson={proposalJson}
        signer={signer}
        fieldPositions={fieldPositions}
      />
    )
  }

  // ── Without sign token: guest / self-initiated sign flow ─────────
  // The signer will fill in their own name/email in StepIdentify.
  // A new signer + signature_request is created when they submit.
  return (
    <SignFlowClient
      signToken={undefined}
      proposalToken={token}
      proposal={{ id: proposal.id, title: proposal.title, client_name: proposal.client_name, source_pdf_path: proposal.source_pdf_path, public_token: proposal.public_token }}
      proposalJson={proposalJson}
      signer={{ id: '', name: '', email: '', role: null }}
      fieldPositions={[]}
      isGuest
    />
  )
}
