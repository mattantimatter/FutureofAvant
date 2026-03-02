import { notFound } from 'next/navigation'
import { getProposalById } from '@/lib/actions/proposals'
import { getSignersByProposal } from '@/lib/actions/signers'
import { createServerClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProposalManageClient } from './ProposalManageClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ManageProposalPage({ params }: PageProps) {
  const { id } = await params

  const proposal = await getProposalById(id)
  if (!proposal) notFound()

  const signers = await getSignersByProposal(id)

  // Get audit events
  const supabase = createServerClient()
  const { data: auditEvents } = await supabase
    .from('audit_events')
    .select('*')
    .eq('proposal_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Generate signed PDF download URL if exists
  let signedPdfUrl: string | null = null
  if (proposal.signed_pdf_path) {
    const { data } = await supabase.storage
      .from('proposal_signed_pdfs')
      .createSignedUrl(proposal.signed_pdf_path, 3600)
    signedPdfUrl = data?.signedUrl ?? null
  }

  return (
    <AdminLayout>
      <ProposalManageClient
        proposal={proposal}
        signers={signers as unknown as Parameters<typeof ProposalManageClient>[0]['signers']}
        auditEvents={auditEvents ?? []}
        signedPdfUrl={signedPdfUrl}
      />
    </AdminLayout>
  )
}
