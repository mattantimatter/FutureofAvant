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

  if (!signToken) {
    redirect(`/p/${token}`)
  }

  const supabase = createServerClient()

  // Load signature request with signer and proposal
  const { data: sigReq, error } = await supabase
    .from('signature_requests')
    .select('*, signers!inner(*), proposals!inner(*)')
    .eq('sign_token', signToken)
    .single()

  if (error || !sigReq) {
    notFound()
  }

  // Validate the token belongs to this proposal
  const proposal = sigReq.proposals as unknown as { public_token: string; proposal_json: ProposalJSON } & typeof sigReq.proposals
  if (proposal.public_token !== token) {
    notFound()
  }

  // Redirect if already signed
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
      proposal={sigReq.proposals as Parameters<typeof SignFlowClient>[0]['proposal']}
      proposalJson={proposal.proposal_json}
      signer={signer}
      fieldPositions={fieldPositions}
    />
  )
}
