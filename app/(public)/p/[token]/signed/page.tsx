import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle, Download, Home, FileText } from 'lucide-react'

interface PageProps {
  params: Promise<{ token: string }>
  searchParams: Promise<{ st?: string }>
}

export default async function SignedPage({ params, searchParams }: PageProps) {
  const { token } = await params
  const { st: signToken } = await searchParams

  const supabase = createServerClient()

  // Load proposal
  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('public_token', token)
    .single()

  if (!proposal) notFound()

  // Load signature request (optional — used for showing signer details)
  let sigReq = null
  if (signToken) {
    const { data } = await supabase
      .from('signature_requests')
      .select('*, signers(*)')
      .eq('sign_token', signToken)
      .single()
    sigReq = data
  }

  // Generate download URL for signed PDF
  let signedPdfUrl: string | null = null
  if (proposal.signed_pdf_path) {
    const { data: urlData } = await supabase.storage
      .from('proposal_signed_pdfs')
      .createSignedUrl(proposal.signed_pdf_path, 3600)
    signedPdfUrl = urlData?.signedUrl ?? null

    // Log DOWNLOAD event
    if (sigReq) {
      await supabase.from('audit_events').insert({
        proposal_id: proposal.id,
        signer_id: sigReq.signer_id,
        signature_request_id: sigReq.id,
        event_type: 'DOWNLOAD_PDF',
        event_meta: { signedPdfPath: proposal.signed_pdf_path },
      })
    }
  }

  const signer = sigReq?.signers as { name: string; email: string } | null

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020202] p-4">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.08) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Success card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-[rgba(10,10,15,0.9)] p-8 text-center shadow-[0_0_60px_rgba(16,185,129,0.1)] backdrop-blur-xl">
          {/* Checkmark */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/20">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>

          <h1 className="mb-2 text-2xl font-semibold text-foreground">
            Proposal Signed Successfully
          </h1>
          <p className="mb-6 text-slate-400">
            {signer
              ? `Thank you, ${signer.name}. Your signature has been recorded and a signed copy is being generated.`
              : 'The proposal has been signed and the audit trail has been recorded.'}
          </p>

          {/* Details */}
          <div className="mb-6 rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(2,2,2,0.5)] p-4 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Proposal</span>
                <span className="text-slate-200">{proposal.title}</span>
              </div>
              {signer && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Signed by</span>
                    <span className="text-slate-200">{signer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="text-slate-200">{signer.email}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Signed at</span>
                <span className="text-slate-200">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-emerald-400">Executed</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {signedPdfUrl ? (
              <a
                href={signedPdfUrl}
                download="avant-atom-proposal-signed.pdf"
                className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-foreground transition-all hover:bg-secondary shadow-[0_0_20px_rgba(105,106,172,0.3)]"
              >
                <Download size={18} />
                Download Signed PDF
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(105,106,172,0.15)] px-6 py-3 text-sm text-slate-400">
                <FileText size={16} />
                Signed PDF is being generated — check back shortly
              </div>
            )}
            <Link
              href={`/p/${token}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(105,106,172,0.15)] px-6 py-3 text-sm text-slate-300 transition-all hover:border-accent/30 hover:text-white"
            >
              <Home size={16} />
              Return to Proposal
            </Link>
          </div>

          {/* Legal note */}
          <p className="mt-6 text-xs text-slate-600">
            A copy of this signed document will be emailed to all parties.
            The audit trail is permanently recorded and tamper-evident.
          </p>
        </div>

        {/* Powered by */}
        <p className="mt-4 text-center text-xs text-slate-700">
          Secure e-signature powered by <span className="text-accent">Antimatter AI</span>
        </p>
      </div>
    </div>
  )
}
