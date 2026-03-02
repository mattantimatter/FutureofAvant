import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface SignLayoutProps {
  proposalTitle: string
  proposalToken: string
  step: number
  totalSteps: number
  children: React.ReactNode
}

const STEP_LABELS = ['Review', 'Identify', 'Sign', 'Submit']

export function SignLayout({
  proposalTitle,
  proposalToken,
  step,
  totalSteps,
  children,
}: SignLayoutProps) {
  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="border-b border-[rgba(105,106,172,0.12)] bg-[rgba(2,2,2,0.9)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href={`/p/${proposalToken}`}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Proposal
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-400" />
            Secured e-sign
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Proposal info */}
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-secondary mb-1">Electronic Signature</p>
          <h1 className="text-xl font-bold text-white">{proposalTitle}</h1>
        </div>

        {/* Step progress */}
        <div className="mb-10">
          <div className="mb-3 flex justify-between">
            {STEP_LABELS.map((label, i) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={
                    i + 1 < step
                      ? 'flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white'
                      : i + 1 === step
                      ? 'flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-[0_0_15px_rgba(105,106,172,0.5)]'
                      : 'flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(105,106,172,0.2)] text-xs text-slate-500'
                  }
                >
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span
                  className={
                    i + 1 <= step ? 'text-xs text-slate-300' : 'text-xs text-slate-600'
                  }
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <ProgressBar value={(step / totalSteps) * 100} size="sm" />
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-[rgba(105,106,172,0.12)] bg-[rgba(10,10,15,0.6)] backdrop-blur-sm">
          {children}
        </div>

        {/* Trust indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400/60" />
            256-bit TLS encryption
          </span>
          <span>·</span>
          <span>Audit trail recorded</span>
          <span>·</span>
          <span>Legally binding e-signature</span>
        </div>
      </div>
    </div>
  )
}
