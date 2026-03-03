'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Copy, ExternalLink, Plus, Upload, Download,
  Eye, CheckCircle, Clock, Send, RefreshCw, Mail, ChevronDown,
  ChevronUp, Layers, Trash2, RotateCcw,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { PDFFieldPlacer } from '@/components/admin/PDFFieldPlacer'
import type { Proposal, Signer, AuditEvent } from '@/lib/supabase/types'
import type { FieldPosition } from '@/components/admin/PDFFieldPlacer'

interface SignerWithRequest extends Signer {
  signature_requests: Array<{
    id: string
    sign_token: string
    status: string
    signed_at: string | null
    field_positions?: FieldPosition[]
  }>
}

interface ProposalManageClientProps {
  proposal: Proposal
  signers: SignerWithRequest[]
  auditEvents: AuditEvent[]
  signedPdfUrl: string | null
  sourcePdfSignedUrl?: string | null
}

const STATUS_CONFIG: Record<string, { color: 'green' | 'accent' | 'secondary' | 'red' | 'muted'; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }> = {
  signed: { color: 'green', icon: CheckCircle, label: 'Signed' },
  viewed: { color: 'secondary', icon: Eye, label: 'Viewed' },
  pending: { color: 'muted', icon: Clock, label: 'Pending' },
  declined: { color: 'red', icon: RefreshCw, label: 'Declined' },
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://futureofavant.com'

export function ProposalManageClient({
  proposal,
  signers,
  auditEvents,
  signedPdfUrl,
  sourcePdfSignedUrl,
}: ProposalManageClientProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [addSignerOpen, setAddSignerOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareData, setShareData] = useState<{ label: string; url: string }[]>([])
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [addingSignerLoading, setAddingSignerLoading] = useState(false)
  const [fieldPlacerSigner, setFieldPlacerSigner] = useState<SignerWithRequest | null>(null)
  const [auditExpanded, setAuditExpanded] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reseeding, setReseeding] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const viewerUrl = `${SITE_URL}/p/${proposal.public_token}`

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast(`${label} copied!`)
  }

  const openShareModal = (signerSignToken?: string) => {
    const links = [{ label: 'Viewer Link (Public)', url: viewerUrl }]
    if (signerSignToken) {
      links.push({ label: 'Sign Link (with proposal view)', url: `${viewerUrl}?st=${signerSignToken}` })
      links.push({ label: 'Direct Sign Link', url: `${SITE_URL}/p/${proposal.public_token}/sign?st=${signerSignToken}` })
    }
    setShareData(links)
    setShareModalOpen(true)
  }

  const sendViaEmail = (signer: SignerWithRequest) => {
    const req = signer.signature_requests?.[0]
    if (!req) return
    const signUrl = `${SITE_URL}/p/${proposal.public_token}/sign?st=${req.sign_token}`
    const subject = encodeURIComponent(`Please sign: ${proposal.title}`)
    const body = encodeURIComponent(
      `Hi ${signer.name},\n\nPlease review and sign the following proposal:\n\n${proposal.title}\n\nSign here: ${signUrl}\n\nBest,\nAntimatter AI`
    )
    window.open(`mailto:${signer.email}?subject=${subject}&body=${body}`)
  }

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('proposalId', proposal.id)
    try {
      const res = await fetch('/api/admin/upload-pdf', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) { toast('PDF uploaded!'); router.refresh() }
      else toast(data.error ?? 'Upload failed', 'error')
    } catch { toast('Upload failed', 'error') }
    finally { setUploadingPdf(false) }
  }

  const handleAddSigner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAddingSignerLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('proposalId', proposal.id)
    try {
      const res = await fetch('/api/admin/signers', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) { toast('Signer added! Sign link generated.'); setAddSignerOpen(false); router.refresh() }
      else toast(data.error ?? 'Failed', 'error')
    } catch { toast('Failed to add signer', 'error') }
    finally { setAddingSignerLoading(false) }
  }

  const handleReseed = async () => {
    setReseeding(true)
    try {
      const res = await fetch(`/api/admin/proposals/${proposal.id}/reseed`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        toast('Proposal content updated with latest seed!')
        router.refresh()
      } else {
        toast(data.error ?? 'Reseed failed', 'error')
      }
    } catch { toast('Reseed failed', 'error') }
    finally { setReseeding(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/proposals/${proposal.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast('Proposal deleted')
        router.push('/admin')
      } else {
        toast(data.error ?? 'Delete failed', 'error')
      }
    } catch { toast('Delete failed', 'error') }
    finally { setDeleting(false) }
  }

  const handleMarkSent = async () => {
    await fetch(`/api/admin/proposals/${proposal.id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sent' }),
    })
    toast('Marked as sent!')
    router.refresh()
  }

  const handleSaveFields = async (signerId: string, reqId: string, fields: FieldPosition[]) => {
    const res = await fetch(`/api/admin/signers/${signerId}/fields`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signatureRequestId: reqId, fields }),
    })
    const data = await res.json()
    if (data.success) {
      toast(`${data.fieldCount} signature field${data.fieldCount !== 1 ? 's' : ''} saved!`)
      setFieldPlacerSigner(null)
      router.refresh()
    } else {
      toast(data.error ?? 'Failed to save fields', 'error')
    }
  }

  // Get viewed timestamp from audit events
  const getViewedAt = (signerId: string) => {
    const event = auditEvents.find(
      (e) => e.event_type === 'VIEW_PROPOSAL' && e.signer_id === signerId
    )
    return event?.created_at ?? null
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/admin" className="mt-1 text-foreground/30 hover:text-foreground/70 transition-colors">
            <ArrowLeft size={17} />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-foreground">{proposal.title}</h1>
              <Badge variant={proposal.status === 'signed' ? 'green' : proposal.status === 'sent' ? 'amber' : 'accent'}>
                {proposal.status}
              </Badge>
            </div>
            <p className="text-sm font-light text-foreground/40">{proposal.client_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={viewerUrl} target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.08] px-3 py-2 text-xs text-foreground/40 transition-all hover:border-foreground/20 hover:text-foreground">
            <Eye size={13} />Preview
          </Link>
          {proposal.status !== 'sent' && (
            <button onClick={handleMarkSent}
              className="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400 transition-all hover:bg-yellow-500/20">
              <Send size={13} />Mark Sent
            </button>
          )}
          <button
            onClick={handleReseed}
            disabled={reseeding}
            title="Refresh proposal content from latest seed (contacts, sections, pricing)"
            className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.08] px-3 py-2 text-xs text-foreground/40 transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-40"
          >
            <RotateCcw size={13} className={reseeding ? 'animate-spin' : ''} />
            {reseeding ? 'Refreshing...' : 'Refresh Content'}
          </button>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/15 px-3 py-2 text-xs text-red-400/60 transition-all hover:border-red-500/30 hover:text-red-400">
              <Trash2 size={13} />Delete
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2">
              <span className="text-xs text-red-400">Sure?</span>
              <button onClick={handleDelete} disabled={deleting}
                className="text-xs font-semibold text-red-400 hover:text-red-300">
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button onClick={() => setDeleteConfirm(false)} className="text-xs text-foreground/30 hover:text-foreground">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Viewer Link */}
      <div className="mb-5 rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/35">Viewer Link</span>
          <button onClick={() => copy(viewerUrl, 'Viewer link')}
            className="flex items-center gap-1 text-xs text-foreground/30 hover:text-foreground transition-colors">
            <Copy size={11} />Copy
          </button>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg border border-foreground/[0.06] bg-foreground/[0.02] px-3 py-2 text-xs text-secondary">
            {viewerUrl}
          </code>
          <a href={viewerUrl} target="_blank" rel="noopener noreferrer"
            className="rounded-lg border border-foreground/[0.08] p-2 text-foreground/30 hover:text-foreground transition-colors">
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Source PDF */}
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
            <h2 className="mb-3 font-semibold text-foreground">Source PDF</h2>
            {proposal.source_pdf_path ? (
              <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                <CheckCircle size={15} className="text-green-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-green-400">PDF uploaded</p>
                  <code className="block truncate text-xs text-foreground/30">{proposal.source_pdf_path}</code>
                </div>
              </div>
            ) : (
              <p className="mb-3 text-sm font-light text-foreground/40">No source PDF. A signature page will be generated automatically.</p>
            )}
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleUploadPdf} />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploadingPdf}
              className="flex items-center gap-2 rounded-lg border border-foreground/[0.08] px-4 py-2 text-xs text-foreground/50 transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-40">
              {uploadingPdf ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploadingPdf ? 'Uploading...' : proposal.source_pdf_path ? 'Replace PDF' : 'Upload PDF'}
            </button>
          </div>

          {/* Signed PDF download */}
          {signedPdfUrl && (
            <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-5">
              <h2 className="mb-3 font-semibold text-foreground">Signed PDF Ready</h2>
              <a href={signedPdfUrl} download="signed-proposal.pdf"
                className="flex items-center gap-2 rounded-[40px] px-4 py-2 text-sm font-medium text-foreground btn-primary w-fit">
                <Download size={14} />Download Signed PDF
              </a>
            </div>
          )}

          {/* Signers */}
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Signers</h2>
              <button onClick={() => setAddSignerOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-secondary transition-all hover:bg-accent/20">
                <Plus size={12} />Add Signer
              </button>
            </div>

            {signers.length === 0 ? (
              <p className="text-sm font-light text-foreground/35">No signers yet. Add a signer to generate a sign link.</p>
            ) : (
              <div className="space-y-4">
                {signers.map((signer) => {
                  const req = signer.signature_requests?.[0]
                  const statusInfo = STATUS_CONFIG[req?.status ?? 'pending']
                  const StatusIcon = statusInfo.icon
                  const viewedAt = getViewedAt(signer.id)
                  const hasFields = (req?.field_positions?.length ?? 0) > 0

                  return (
                    <div key={signer.id} className="rounded-xl border border-foreground/[0.07] bg-foreground/[0.02] overflow-hidden">
                      {/* Signer header */}
                      <div className="flex items-start justify-between gap-3 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-secondary">
                            {signer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{signer.name}</p>
                            <p className="text-xs text-foreground/40">{signer.email}</p>
                            {signer.role && <p className="text-xs text-foreground/30">{signer.role}</p>}
                          </div>
                        </div>
                        {req && (
                          <Badge variant={statusInfo.color} size="sm">
                            <StatusIcon size={10} className="mr-1" />
                            {statusInfo.label}
                          </Badge>
                        )}
                      </div>

                      {/* Status timeline */}
                      {req && (
                        <div className="border-t border-foreground/[0.05] px-4 pb-3 pt-3">
                          <div className="flex gap-4 text-xs">
                            {/* Created */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-foreground/20" />
                              <span className="text-foreground/25">Created</span>
                              <span className="text-foreground/30">{new Date(req.sign_token ? signer.created_at : '').toLocaleDateString()}</span>
                            </div>
                            <div className="flex flex-1 items-center">
                              <div className="h-px flex-1 bg-foreground/[0.06]" />
                            </div>
                            {/* Viewed */}
                            <div className="flex flex-col items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${viewedAt ? 'bg-secondary' : 'bg-foreground/[0.08]'}`} />
                              <span className={viewedAt ? 'text-secondary' : 'text-foreground/25'}>Viewed</span>
                              <span className="text-foreground/30">
                                {viewedAt ? new Date(viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                              </span>
                            </div>
                            <div className="flex flex-1 items-center">
                              <div className="h-px flex-1 bg-foreground/[0.06]" />
                            </div>
                            {/* Signed */}
                            <div className="flex flex-col items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${req.signed_at ? 'bg-green-400' : 'bg-foreground/[0.08]'}`} />
                              <span className={req.signed_at ? 'text-green-400' : 'text-foreground/25'}>Signed</span>
                              <span className="text-foreground/30">
                                {req.signed_at ? new Date(req.signed_at).toLocaleDateString() : '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions row */}
                      {req && (
                        <div className="flex flex-wrap items-center gap-2 border-t border-foreground/[0.05] px-4 py-3">
                          {/* Sign URL display */}
                          <div className="w-full mb-1.5">
                            <div className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.06] bg-foreground/[0.02] px-2.5 py-1.5">
                              <span className="text-[10px] text-foreground/25 uppercase tracking-wider shrink-0">Sign link</span>
                              <code className="flex-1 truncate text-xs text-secondary">
                                {SITE_URL}/p/{proposal.public_token}/sign?st={req.sign_token}
                              </code>
                              <button onClick={() => copy(`${SITE_URL}/p/${proposal.public_token}/sign?st=${req.sign_token}`, 'Sign link')}
                                className="shrink-0 text-foreground/25 hover:text-foreground transition-colors"><Copy size={11} /></button>
                              <a href={`${SITE_URL}/p/${proposal.public_token}/sign?st=${req.sign_token}`} target="_blank" rel="noopener noreferrer"
                                className="shrink-0 text-foreground/25 hover:text-foreground transition-colors"><ExternalLink size={11} /></a>
                            </div>
                          </div>
                          <button
                            onClick={() => sendViaEmail(signer)}
                            className="flex items-center gap-1 text-xs text-secondary hover:text-foreground transition-colors">
                            <Mail size={11} />Send email
                          </button>
                          {(proposal.source_pdf_path) && (
                            <>
                              <span className="text-foreground/15">·</span>
                              <button
                                onClick={() => setFieldPlacerSigner(signer)}
                                className={`flex items-center gap-1 text-xs transition-colors ${hasFields ? 'text-green-400 hover:text-green-300' : 'text-foreground/35 hover:text-accent'}`}
                              >
                                <Layers size={11} />
                                {hasFields ? `${req.field_positions?.length} field${(req.field_positions?.length ?? 0) !== 1 ? 's' : ''} placed` : 'Place signature fields'}
                              </button>
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

        {/* RIGHT COLUMN — Audit trail */}
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
          <button
            onClick={() => setAuditExpanded(!auditExpanded)}
            className="flex w-full items-center justify-between"
          >
            <h2 className="font-semibold text-foreground">
              Audit Trail
              <span className="ml-2 text-xs font-normal text-foreground/30">({auditEvents.length} events)</span>
            </h2>
            {auditExpanded ? <ChevronUp size={15} className="text-foreground/30" /> : <ChevronDown size={15} className="text-foreground/30" />}
          </button>

          {auditEvents.length === 0 ? (
            <p className="mt-3 text-sm font-light text-foreground/35">No events yet. Events appear when the proposal is viewed or signed.</p>
          ) : (
            <div className={`mt-4 space-y-2 overflow-y-auto transition-all ${auditExpanded ? 'max-h-[600px]' : 'max-h-64'}`}>
              {auditEvents.map((event) => (
                <div key={event.id}
                  className="flex items-start gap-3 rounded-lg border border-foreground/[0.05] bg-foreground/[0.01] p-3">
                  <span className="text-base leading-none mt-0.5 shrink-0">{EVENT_ICONS[event.event_type] ?? '●'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs font-mono text-secondary">{event.event_type}</code>
                      <span className="shrink-0 text-xs text-foreground/25">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                    {event.ip_address && (
                      <p className="mt-0.5 text-xs text-foreground/25">IP: {event.ip_address}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF Field Placer Modal */}
      {fieldPlacerSigner && sourcePdfSignedUrl && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="flex items-center justify-between border-b border-foreground/[0.08] bg-background/97 px-6 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="font-semibold text-foreground">Place Signature Fields</h2>
                <p className="text-sm text-foreground/40">
                  Placing fields for: <span className="text-secondary font-medium">{fieldPlacerSigner.name}</span>
                  {fieldPlacerSigner.role && <span className="text-foreground/30"> · {fieldPlacerSigner.role}</span>}
                </p>
              </div>
              {/* Show other signers as switcher */}
              {signers.length > 1 && (
                <div className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] p-1">
                  {signers.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setFieldPlacerSigner(s)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                        s.id === fieldPlacerSigner.id
                          ? 'bg-accent/15 text-secondary'
                          : 'text-foreground/30 hover:text-foreground/60'
                      }`}
                    >
                      {s.name.split(' ')[0]}
                      {(s.signature_requests?.[0]?.field_positions?.length ?? 0) > 0 && (
                        <span className="ml-1 text-green-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setFieldPlacerSigner(null)}
              className="rounded-lg border border-foreground/[0.08] px-4 py-2 text-sm text-foreground/40 hover:text-foreground transition-colors"
            >
              Done
            </button>
          </div>
          <div className="flex-1 overflow-hidden bg-background">
            <PDFFieldPlacer
              pdfUrl={sourcePdfSignedUrl}
              signatureRequestId={fieldPlacerSigner.signature_requests?.[0]?.id ?? ''}
              existingFields={fieldPlacerSigner.signature_requests?.[0]?.field_positions ?? []}
              adminName="Matt Bravo"
              onSave={(fields) => handleSaveFields(
                fieldPlacerSigner.id,
                fieldPlacerSigner.signature_requests?.[0]?.id ?? '',
                fields
              )}
            />
          </div>
        </div>
      )}

      {/* Add Signer Modal */}
      <Modal open={addSignerOpen} onClose={() => setAddSignerOpen(false)}
        title="Add Signer" description="Add a signer to this proposal. A unique sign link will be generated.">
        <form onSubmit={handleAddSigner} className="space-y-4">
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Smith', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@avant.com', required: true },
            { name: 'role', label: 'Role / Title (optional)', type: 'text', placeholder: 'VP Partnerships', required: false },
          ].map((field) => (
            <div key={field.name}>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground/35">{field.label}</label>
              <input name={field.name} type={field.type} required={field.required} placeholder={field.placeholder}
                className="input-field w-full rounded-xl px-4 py-3 text-sm" />
            </div>
          ))}
          <button type="submit" disabled={addingSignerLoading}
            className="flex w-full items-center justify-center gap-2 rounded-[40px] py-3 text-sm font-medium text-foreground btn-primary disabled:opacity-50">
            {addingSignerLoading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : <Plus size={15} />}
            Add Signer + Generate Link
          </button>
        </form>
      </Modal>

      {/* Share Links Modal */}
      <Modal open={shareModalOpen} onClose={() => setShareModalOpen(false)}
        title="Share Links" description="Copy and send these links to the appropriate recipients." size="lg">
        <div className="space-y-4">
          {shareData.map((link) => (
            <div key={link.label}>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/35">{link.label}</p>
              <div className="flex gap-2">
                <code className="flex-1 truncate rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-xs text-secondary">
                  {link.url}
                </code>
                <button onClick={() => copy(link.url, link.label)}
                  className="flex items-center gap-1.5 rounded-xl border border-foreground/[0.08] px-3 py-2 text-xs text-foreground/40 transition-all hover:text-foreground">
                  <Copy size={11} />Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
