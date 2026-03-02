'use client'

import React, { useState } from 'react'
import { SignatureCapture } from './SignatureCapture'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

interface SignatureData {
  type: 'typed' | 'drawn'
  text?: string
  dataURL?: string
}

interface StepSignProps {
  signerName: string
  acceptanceClause: string
  onNext: (data: {
    signature: SignatureData
    initials: SignatureData
    accepted: boolean
    acceptanceText: string
  }) => void
  onBack: () => void
}

export function StepSign({ signerName, acceptanceClause, onNext, onBack }: StepSignProps) {
  const [signature, setSignature] = useState<SignatureData | null>(null)
  const [initials, setInitials] = useState<SignatureData | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [attempted, setAttempted] = useState(false)

  const isValid = signature && initials && accepted

  const handleSubmit = () => {
    setAttempted(true)
    if (!isValid) return
    onNext({
      signature: signature!,
      initials: initials!,
      accepted: true,
      acceptanceText: acceptanceClause,
    })
  }

  return (
    <div className="p-6 md:p-8">
      <h2 className="mb-2 text-xl font-bold text-white">Sign the Proposal</h2>
      <p className="mb-6 text-sm text-slate-400">
        Provide your signature and initials, then accept the terms below.
      </p>

      <div className="space-y-8">
        {/* Signature */}
        <SignatureCapture
          label="Full Signature"
          onChange={(data) => setSignature(data)}
          signerName={signerName}
        />

        {/* Initials */}
        <SignatureCapture
          label="Initials"
          onChange={(data) => setInitials(data)}
          signerName={signerName}
          isInitials
        />

        {/* Acceptance clause */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Terms of Acceptance</h3>
          <div
            className="max-h-40 overflow-y-auto rounded-xl border border-[rgba(105,106,172,0.15)] bg-[rgba(2,2,2,0.5)] p-4 text-xs leading-relaxed text-slate-400"
            style={{ scrollbarWidth: 'thin' }}
          >
            {acceptanceClause}
          </div>
          <label className="flex cursor-pointer items-start gap-3">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                  accepted
                    ? 'border-accent bg-accent'
                    : attempted && !accepted
                    ? 'border-red-400'
                    : 'border-[rgba(105,106,172,0.3)]'
                }`}
              >
                {accepted && (
                  <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-slate-300">
              I have read and agree to the acceptance terms above. I understand this electronic signature is legally binding.
            </span>
          </label>
        </div>

        {/* Validation errors */}
        {attempted && !isValid && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>
              Please complete all fields: {!signature ? 'signature, ' : ''}{!initials ? 'initials, ' : ''}{!accepted ? 'and accept the terms' : ''}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
            ← Back
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Submit Signature →
          </Button>
        </div>
      </div>
    </div>
  )
}
