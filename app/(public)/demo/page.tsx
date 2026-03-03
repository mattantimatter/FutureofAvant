/**
 * /demo — Customer-facing demo route.
 * Renders the full interactive proposal from static seed data.
 * No database required. Safe to share with prospects.
 */
import { ProposalLayout } from '@/components/proposal/ProposalLayout'
import { defaultProposalJSON } from '@/lib/seed'
import type { Proposal } from '@/lib/supabase/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avant × Antimatter — ATOM Deployment Proposal',
  description:
    'Deploy governed enterprise AI across voice, search, and workflows — in your infrastructure. Full IP ownership, zero model training, deploy anywhere.',
  openGraph: {
    title: 'Avant × Antimatter — ATOM Deployment Proposal',
    description:
      'An interactive enterprise AI deployment proposal from Antimatter AI for Avant Technology Partners.',
    siteName: 'Antimatter AI',
  },
}

// Static demo proposal — matches the Proposal DB shape but uses seed content
const demoProposal: Proposal = {
  id: 'demo',
  title: 'Avant × Antimatter — ATOM Deployment Proposal',
  client_name: 'Avant',
  status: 'sent', // displays as "For Review" to customer
  public_token: 'demo',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proposal_json: defaultProposalJSON as any,
  pricing_json: null,
  source_pdf_path: null,
  signed_pdf_path: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export default function DemoPage() {
  return (
    <ProposalLayout
      proposal={demoProposal}
      proposalJson={defaultProposalJSON}
      signToken={undefined}
    />
  )
}
