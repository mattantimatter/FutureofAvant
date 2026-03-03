'use client'

import React from 'react'
import { FileText, Clock, User, Building } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Proposal, Signer } from '@/lib/supabase/types'
import type { ProposalJSON } from '@/lib/seed'

interface StepReviewProps {
  proposal: Proposal
  proposalJson: ProposalJSON
  signer: Signer
  onNext: () => void
}

export function StepReview({ proposal, proposalJson, signer, onNext }: StepReviewProps) {
  const summarySection = proposalJson.sections.find((s) => s.id === 'executive-summary')
  const pricingSection = proposalJson.sections.find((s) => s.id === 'pricing')

  return (
    <div className="p-6 md:p-8">
      <h2 className="mb-2 text-xl font-bold text-white">Review Proposal</h2>
      <p className="mb-6 text-sm text-slate-400">
        Please review the key terms before proceeding to sign.
      </p>

      {/* Parties */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(2,2,2,0.4)] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
            <Building size={12} />
            Provider
          </div>
          <p className="font-semibold text-foreground">Antimatter AI</p>
          <p className="text-sm text-slate-400">paul@antimatterai.com</p>
        </div>
        <div className="rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(2,2,2,0.4)] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
            <User size={12} />
            Signing As
          </div>
          <p className="font-semibold text-foreground">{signer.name}</p>
          <p className="text-sm text-slate-400">{signer.email}</p>
          {signer.role && <p className="text-xs text-slate-500">{signer.role}</p>}
        </div>
      </div>

      {/* Proposal summary */}
      <div className="mb-6 rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(2,2,2,0.4)] p-5">
        <div className="mb-3 flex items-center gap-2">
          <FileText size={16} className="text-secondary" />
          <h3 className="font-semibold text-foreground">{proposal.title}</h3>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-slate-500">Client: </span>
            <span className="text-slate-200">{proposal.client_name}</span>
          </div>
          <div>
            <span className="text-slate-500">Prepared by: </span>
            <span className="text-slate-200">{proposalJson.meta.preparedBy}</span>
          </div>
          <div>
            <span className="text-slate-500">Date: </span>
            <span className="text-slate-200">{proposalJson.meta.date}</span>
          </div>
          <div>
            <span className="text-slate-500">Version: </span>
            <span className="text-slate-200">{proposalJson.version}</span>
          </div>
        </div>
      </div>

      {/* Key terms summary */}
      {summarySection && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">
            Key Terms Summary
          </h3>
          <div className="space-y-2">
            {(summarySection.content as { bullets: Array<{ title: string; body: string }> }).bullets.map((bullet) => (
              <div
                key={bullet.title}
                className="rounded-lg border border-[rgba(105,106,172,0.08)] bg-[rgba(2,2,2,0.3)] px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-200">{bullet.title}: </span>
                <span className="text-slate-400">{bullet.body}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source PDF preview */}
      {proposal.source_pdf_path && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">
            Full Proposal Document
          </h3>
          <div className="rounded-xl border border-foreground/[0.08] overflow-hidden" style={{ height: 380 }}>
            <iframe
              src={`/api/pdf-proxy?path=${encodeURIComponent(proposal.source_pdf_path)}&bucket=proposal_source_pdfs`}
              className="h-full w-full bg-white"
              title="Proposal PDF"
            />
          </div>
        </div>
      )}

      {/* Valid until */}
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-500/5 p-3 text-xs text-amber-400">
        <Clock size={12} className="shrink-0" />
        This proposal is valid until {proposalJson.meta.validUntil}
      </div>

      <Button onClick={onNext} size="lg" className="w-full">
        I&apos;ve Reviewed — Continue to Sign →
      </Button>
    </div>
  )
}
