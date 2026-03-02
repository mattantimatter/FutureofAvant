'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Copy, ExternalLink, Plus, Upload, Download, Eye,
  CheckCircle, Clock, Send, AlertCircle, RefreshCw, Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import type { Proposal, Signer, AuditEvent } from '@/lib/supabase/types'

interface SignerWithRequest extends Signer {
  signature_requests: Array<{
    id: string
    sign_token: string
    status: string
    signed_at: string | null
  }>
}

interface ProposalManageClientProps {
  proposal: Proposal
  signers: SignerWithRequest[]
  auditEvents: AuditEvent[]
  signedPdfUrl: string | null
}

const EVENT_ICONS: Record<string, string> = {
  VIEW_PROPOSAL: '👁',
  START_SIGN: '✍️',
  COMPLETE_FIELD: '✅',
  SUBMIT_SIGNATURE: '🖊',
  FINALIZE_PDF: '📄',
  DOWNLOAD_PDF: '⬇️',
  DECLINE_SIGN: '❌',
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export function ProposalManageClient({
  proposal,
  signers,
  auditEvents,
  signedPdfUrl,
}: ProposalManageClientProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [addSignerOpen, setAddSignerOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareData, setShareData] = useState<{ label: string; url: string }[]>([])
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [addingSignerLoading, setAddingSignerLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const viewerUrl = `${SITE_URL}/p/${proposal.public_token}`

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast(`${label} copied to clipboard!`)
  }

  const openShareModal = (signerSignToken?: string) => {
    const links = [
      { label: 'Viewer Link (Public)', url: viewerUrl },
    ]
    if (signerSignToken) {
      links.push({
        label: 'Sign Link (Signer)',
        url: `${viewerUrl}?st=${signerSignToken}`,
      })
      links.push({
        label: 'Direct Sign Link',
        url: `${SITE_URL}/p/${proposal.public_token}/sign?st=${signerSignToken}`,
      })
    }
    setShareData(links)
    setShareModalOpen(true)
  }

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('proposalId', proposal.id)
      const res = await fetch('/api/admin/upload-pdf', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        toast('PDF uploaded successfully!')
        router.refresh()
      } else {
        toast(data.error ?? 'Upload failed', 'error')
      }
    } catch {
      toast('Upload failed', 'error')
    } finally {
      setUploadingPdf(false)
    }
  }

  const handleAddSigner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAddingSignerLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('proposalId', proposal.id)
    try {
      const res = await fetch('/api/admin/signers', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        toast('Signer added! Sign link generated.')
        setAddSignerOpen(false)
        router.refresh()
      } else {
        toast(data.error ?? 'Failed to add signer', 'error')
      }
    } catch {
      toast('Failed to add signer', 'error')
    } finally {
      setAddingSignerLoading(false)
    }
  }

  const handleMarkSent = async () => {
    await fetch(`/api/admin/proposals/${proposal.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sent' }),
    })
    toast('Proposal marked as sent!')
    router.refresh()
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/admin" className="mt-1 text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-foreground">{proposal.title}</h1>
              <Badge
                variant={proposal.status === 'signed' ? 'green' : proposal.status === 'sent' ? 'amber' : 'accent'}
              >
                {proposal.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-400">{proposal.client_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={viewerUrl}
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(105,106,172,0.15)] px-3 py-2 text-sm text-slate-300 transition-all hover:border-accent/30 hover:text-white"
          >
            <Eye size={14} />
            Preview
          </Link>
          {proposal.status === 'draft' && (
            <button
              onClick={handleMarkSent}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600/20 px-3 py-2 text-sm text-amber-300 transition-all hover:bg-amber-600/30"
            >
              <Send size={14} />
              Mark Sent
            </button>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mb-6 rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(10,10,15,0.5)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Viewer Link</h2>
          <button
            onClick={() => copyToClipboard(viewerUrl, 'Viewer link')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <Copy size={12} />
            Copy
          </button>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg border border-[rgba(105,106,172,0.1)] bg-[rgba(2,2,2,0.5)] px-3 py-2 text-xs text-tertiary">
            {viewerUrl}
          </code>
          <a
            href={viewerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[rgba(105,106,172,0.15)] p-2 text-slate-400 hover:text-white"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          {/* PDF management */}
          <div className="rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(10,10,15,0.5)] p-5">
            <h2 className="mb-4 font-semibold text-foreground">Source PDF</h2>
            {proposal.source_pdf_path ? (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-emerald-300">PDF uploaded</p>
                  <code className="text-xs text-slate-500 truncate block">{proposal.source_pdf_path}</code>
                </div>
              </div>
            ) : (
              <p className="mb-3 text-sm text-slate-400">No source PDF uploaded. The signed PDF will be a generated signature page.</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleUploadPdf}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPdf}
              className="mt-3 flex items-center gap-2 rounded-lg border border-[rgba(105,106,172,0.2)] px-4 py-2 text-sm text-slate-300 transition-all hover:border-accent/30 hover:text-white disabled:opacity-50"
            >
              {uploadingPdf ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploadingPdf ? 'Uploading...' : proposal.source_pdf_path ? 'Replace PDF' : 'Upload PDF'}
            </button>
          </div>

          {/* Signed PDF */}
          {signedPdfUrl && (
            <div className="rounded-xl border border-accent/20 bg-secondary/5 p-5">
              <h2 className="mb-3 font-semibold text-foreground">Signed PDF</h2>
              <a
                href={signedPdfUrl}
                download="signed-proposal.pdf"
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary w-fit"
              >
                <Download size={14} />
                Download Signed PDF
              </a>
            </div>
          )}

          {/* Signers */}
          <div className="rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(10,10,15,0.5)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Signers</h2>
              <button
                onClick={() => setAddSignerOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-accent/15 px-3 py-1.5 text-xs font-semibold text-tertiary transition-all hover:bg-accent/20"
              >
                <Plus size={12} />
                Add Signer
              </button>
            </div>

            {signers.length === 0 ? (
              <p className="text-sm text-slate-500">No signers added yet. Add at least one signer to enable signing.</p>
            ) : (
              <div className="space-y-3">
                {signers.map((signer) => {
                  const req = signer.signature_requests?.[0]
                  return (
                    <div
                      key={signer.id}
                      className="rounded-xl border border-[rgba(105,106,172,0.08)] bg-[rgba(2,2,2,0.4)] p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{signer.name}</p>
                          <p className="text-xs text-slate-400">{signer.email}</p>
                          {signer.role && <p className="text-xs text-slate-500">{signer.role}</p>}
                        </div>
                        {req && (
                          <Badge
                            variant={
                              req.status === 'signed' ? 'green' :
                              req.status === 'viewed' ? 'secondary' :
                              req.status === 'declined' ? 'red' : 'muted'
                            }
                            size="sm"
                          >
                            {req.status}
                          </Badge>
                        )}
                      </div>
                      {req && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => openShareModal(req.sign_token)}
                            className="flex items-center gap-1 text-xs text-secondary hover:text-tertiary transition-colors"
                          >
                            <ExternalLink size={11} />
                            Get sign link
                          </button>
                          <span className="text-slate-700">·</span>
                          <button
                            onClick={() => copyToClipboard(
                              `${SITE_URL}/p/${proposal.public_token}/sign?st=${req.sign_token}`,
                              'Sign link'
                            )}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            <Copy size={11} />
                            Copy
                          </button>
                          {req.signed_at && (
                            <>
                              <span className="text-slate-700">·</span>
                              <span className="text-xs text-emerald-400">
                                Signed {new Date(req.signed_at).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column — Audit events */}
        <div className="rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(10,10,15,0.5)] p-5">
          <h2 className="mb-4 font-semibold text-foreground">
            Audit Trail{' '}
            <span className="ml-1 text-xs font-normal text-slate-500">
              ({auditEvents.length} events)
            </span>
          </h2>

          {auditEvents.length === 0 ? (
            <p className="text-sm text-slate-500">No events recorded yet. Events appear when the proposal is viewed or signed.</p>
          ) : (
            <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1">
              {auditEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border border-[rgba(105,106,172,0.06)] bg-[rgba(2,2,2,0.3)] p-3"
                >
                  <span className="text-base leading-none mt-0.5">
                    {EVENT_ICONS[event.event_type] ?? '●'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs font-mono text-tertiary">{event.event_type}</code>
                      <span className="shrink-0 text-xs text-slate-600">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                    {event.ip_address && (
                      <p className="mt-0.5 text-xs text-slate-600">IP: {event.ip_address}</p>
                    )}
                    {Object.keys(event.event_meta as object).length > 0 && (
                      <pre className="mt-1 text-xs text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                        {JSON.stringify(event.event_meta)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Signer Modal */}
      <Modal
        open={addSignerOpen}
        onClose={() => setAddSignerOpen(false)}
        title="Add Signer"
        description="Add a person who needs to sign this proposal. A unique sign link will be generated."
      >
        <form onSubmit={handleAddSigner} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              required
              placeholder="Jane Smith"
              className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-accent/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="jane@avant.com"
              className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-accent/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Role / Title (optional)
            </label>
            <input
              name="role"
              placeholder="VP Partnerships"
              className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-accent/50"
            />
          </div>
          <Button type="submit" loading={addingSignerLoading} className="w-full">
            Add Signer + Generate Link
          </Button>
        </form>
      </Modal>

      {/* Share Links Modal */}
      <Modal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Links"
        description="Copy and send these links to the appropriate recipients."
        size="lg"
      >
        <div className="space-y-4">
          {shareData.map((link) => (
            <div key={link.label}>
              <p className="mb-1.5 text-xs font-semibold text-slate-400">{link.label}</p>
              <div className="flex gap-2">
                <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-[rgba(105,106,172,0.15)] bg-[rgba(2,2,2,0.5)] px-3 py-2.5 text-xs text-tertiary">
                  {link.url}
                </code>
                <button
                  onClick={() => copyToClipboard(link.url, link.label)}
                  className="flex items-center gap-1.5 rounded-xl border border-[rgba(105,106,172,0.2)] px-3 py-2 text-xs text-slate-300 transition-all hover:border-accent/40 hover:text-white"
                >
                  <Copy size={12} />
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
