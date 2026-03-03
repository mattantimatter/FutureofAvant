'use client'

import React, { useState } from 'react'
import { SignatureCapture } from './SignatureCapture'
import { AlertCircle, Type } from 'lucide-react'
import type { FieldPosition } from '@/components/admin/PDFFieldPlacer'

interface SignatureData {
  type: 'typed' | 'drawn'
  text?: string
  dataURL?: string
}

interface StepSignProps {
  signerName: string
  acceptanceClause: string
  fieldPositions?: FieldPosition[]
  onNext: (data: {
    signature: SignatureData
    initials: SignatureData
    accepted: boolean
    acceptanceText: string
    textFieldValues: Record<string, string>
  }) => void
  onBack: () => void
}

export function StepSign({ signerName, acceptanceClause, fieldPositions = [], onNext, onBack }: StepSignProps) {
  const [signature, setSignature] = useState<SignatureData | null>(null)
  const [initials, setInitials] = useState<SignatureData | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [textValues, setTextValues] = useState<Record<string, string>>({})

  // Which field types are required
  const needsSignature = !fieldPositions.length || fieldPositions.some(f => f.type === 'signature')
  const needsInitials = fieldPositions.some(f => f.type === 'initials')
  const textFields = fieldPositions.filter(f => f.type === 'text')

  const isValid = (!needsSignature || signature) && (!needsInitials || initials) && accepted
    && textFields.every(f => (textValues[f.id] ?? '').trim().length > 0)

  const handleSubmit = () => {
    setAttempted(true)
    if (!isValid) return
    onNext({
      signature: signature ?? { type: 'typed', text: signerName },
      initials: initials ?? { type: 'typed', text: signerName.split(' ').map(n => n[0]).join('') },
      accepted: true,
      acceptanceText: acceptanceClause,
      textFieldValues: textValues,
    })
  }

  const missingFields = [
    needsSignature && !signature && 'signature',
    needsInitials && !initials && 'initials',
    ...textFields.filter(f => !(textValues[f.id] ?? '').trim()).map(f => f.label ?? 'text field'),
    !accepted && 'acceptance checkbox',
  ].filter(Boolean)

  return (
    <div className="p-6 md:p-8">
      <h2 className="mb-2 text-xl font-semibold text-foreground">Sign the Proposal</h2>
      <p className="mb-7 text-sm font-light text-foreground/45">
        {fieldPositions.length > 0
          ? `Complete ${fieldPositions.filter(f => f.type !== 'admin_signature' && f.type !== 'date').length} field${fieldPositions.filter(f => f.type !== 'admin_signature' && f.type !== 'date').length !== 1 ? 's' : ''} below to sign.`
          : 'Provide your signature and initials, then accept the terms.'}
      </p>

      <div className="space-y-8">
        {/* Text fields */}
        {textFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Required Information</h3>
            {textFields.map((field) => (
              <div key={field.id}>
                <label className="mb-1.5 block text-sm font-medium text-foreground/60">
                  {field.label ?? 'Text Field'} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Type size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25" />
                  <input
                    value={textValues[field.id] ?? ''}
                    onChange={e => setTextValues(p => ({ ...p, [field.id]: e.target.value }))}
                    placeholder={`Enter your ${field.label?.toLowerCase() ?? 'response'}...`}
                    className="input-field w-full rounded-xl py-3 pl-9 pr-4 text-sm"
                  />
                </div>
                {attempted && !(textValues[field.id] ?? '').trim() && (
                  <p className="mt-1 text-xs text-red-400">This field is required</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Signature capture */}
        {needsSignature && (
          <SignatureCapture
            label="Full Signature"
            onChange={(data) => setSignature(data)}
            signerName={signerName}
          />
        )}

        {/* Initials capture */}
        {needsInitials && (
          <SignatureCapture
            label="Initials"
            onChange={(data) => setInitials(data)}
            signerName={signerName}
            isInitials
          />
        )}

        {/* If neither signature nor initials fields placed, show both anyway */}
        {!needsSignature && !needsInitials && fieldPositions.length === 0 && (
          <>
            <SignatureCapture label="Full Signature" onChange={setSignature} signerName={signerName} />
            <SignatureCapture label="Initials" onChange={setInitials} signerName={signerName} isInitials />
          </>
        )}

        {/* Acceptance clause */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Terms of Acceptance</h3>
          <div className="max-h-40 overflow-y-auto rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 text-xs leading-relaxed text-foreground/40">
            {acceptanceClause}
          </div>
          <label className="flex cursor-pointer items-start gap-3">
            <div className="relative mt-0.5">
              <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="sr-only" />
              <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                accepted ? 'border-accent bg-accent' : attempted && !accepted ? 'border-red-400' : 'border-foreground/20'
              }`}>
                {accepted && (
                  <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-light text-foreground/55">
              I have read and agree to the terms above. I understand this electronic signature is legally binding.
            </span>
          </label>
        </div>

        {/* Validation error */}
        {attempted && !isValid && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/15 bg-red-500/5 p-3 text-xs text-red-400">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>Please complete: {missingFields.join(', ')}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={onBack}
            className="flex-1 rounded-xl border border-foreground/[0.08] py-3 text-sm text-foreground/40 transition-all hover:border-foreground/20 hover:text-foreground">
            ← Back
          </button>
          <button onClick={handleSubmit}
            className="flex-1 rounded-[40px] py-3 text-sm font-medium text-foreground btn-primary">
            Submit Signature →
          </button>
        </div>
      </div>
    </div>
  )
}
