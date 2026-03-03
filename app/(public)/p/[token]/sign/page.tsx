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

  // If no sign token, show a "request your sign link" message instead of redirecting
  if (!signToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
            <svg className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-foreground">Sign Link Required</h1>
          <p className="mb-6 text-sm font-light text-foreground/50">
            To sign this proposal, you need a personal signing link. Please contact Antimatter AI and we&apos;ll send your unique sign link by email.
          </p>
          <a
            href={`mailto:matt@antimatterai.com?subject=Avant%20Proposal%20%E2%80%94%20Signing%20Link&body=Hi%20Matt%2C%0A%0AI%27d%20like%20to%20sign%20the%20Avant%20Pathfinder%20%C3%97%20ATOM%20proposal.%20Please%20send%20my%20signing%20link.%0A%0AThanks`}
            className="mb-3 flex items-center justify-center gap-2 rounded-[40px] py-3 text-sm font-medium text-foreground btn-primary"
          >
            Request My Sign Link
          </a>
          <a href={`/p/${token}`} className="block text-xs text-foreground/35 hover:text-foreground/60 transition-colors">
            ← Back to proposal
          </a>
        </div>
      </div>
    )
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
