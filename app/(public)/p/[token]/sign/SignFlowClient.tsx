'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignLayout } from '@/components/esign/SignLayout'
import { StepReview } from '@/components/esign/StepReview'
import { StepIdentify } from '@/components/esign/StepIdentify'
import { StepSign } from '@/components/esign/StepSign'
import { Loader2 } from 'lucide-react'
import type { ProposalJSON } from '@/lib/seed'
import type { FieldPosition } from '@/components/admin/PDFFieldPlacer'

interface SignFlowClientProps {
  signToken: string | undefined
  proposalToken: string
  proposal: {
    id: string
    title: string
    client_name: string
    source_pdf_path: string | null
    public_token: string
  }
  proposalJson: ProposalJSON
  signer: {
    id: string
    name: string
    email: string
    role: string | null
  }
  fieldPositions?: FieldPosition[]
  /** Guest mode: no sign token, signer creates their own record at submit */
  isGuest?: boolean
}

type IdentifyData = { name: string; email: string; phone?: string }

export function SignFlowClient({
  signToken, proposalToken, proposal, proposalJson, signer, fieldPositions = [], isGuest = false,
}: SignFlowClientProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [identifyData, setIdentifyData] = useState<IdentifyData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleIdentify = (data: IdentifyData) => { setIdentifyData(data); setStep(3) }

  const handleSign = async (signData: {
    signature: { type: 'typed' | 'drawn'; text?: string; dataURL?: string }
    initials: { type: 'typed' | 'drawn'; text?: string; dataURL?: string }
    accepted: boolean
    acceptanceText: string
    textFieldValues: Record<string, string>
  }) => {
    setSubmitting(true); setError(null)
    try {
      let activeSignToken = signToken

      // Guest flow: create a signer + signature_request first
      if (isGuest || !activeSignToken) {
        const guestRes = await fetch('/api/sign/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proposalId: proposal.id,
            name: identifyData?.name ?? '',
            email: identifyData?.email ?? '',
            role: identifyData?.phone ? `Phone: ${identifyData.phone}` : null,
          }),
        })
        const guestData = await guestRes.json()
        if (!guestData.success) {
          setError(guestData.error ?? 'Failed to initiate signing')
          setSubmitting(false)
          return
        }
        activeSignToken = guestData.signToken
      }

      const formData = new FormData()
      formData.append('signToken', activeSignToken!)
      formData.append('signerName', identifyData?.name ?? signer.name)
      formData.append('signerEmail', identifyData?.email ?? signer.email)
      if (identifyData?.phone) formData.append('signerPhone', identifyData.phone)
      formData.append('signatureType', signData.signature.type)
      if (signData.signature.text) formData.append('signatureText', signData.signature.text)
      if (signData.signature.dataURL) formData.append('signatureDataURL', signData.signature.dataURL)
      if (signData.initials.text) formData.append('initialsText', signData.initials.text)
      if (signData.initials.dataURL) formData.append('initialsDataURL', signData.initials.dataURL)
      formData.append('accepted', 'true')
      formData.append('acceptanceText', signData.acceptanceText)
      formData.append('userAgent', navigator.userAgent)
      if (Object.keys(signData.textFieldValues).length > 0) {
        formData.append('textFieldValues', JSON.stringify(signData.textFieldValues))
      }

      try {
        const ipRes = await fetch('/api/audit')
        const ipData = await ipRes.json()
        if (ipData.ip) formData.append('ipAddress', ipData.ip)
      } catch { /* IP best-effort */ }

      const res = await fetch('/api/sign/finalize', { method: 'POST', body: formData })
      const result = await res.json()

      if (result.success) {
        router.push(`/p/${proposalToken}/signed?st=${activeSignToken}`)
      } else {
        setError(result.error ?? 'Signing failed. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
            <Loader2 size={28} className="animate-spin text-secondary" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Processing your signature</h2>
          <p className="text-sm font-light text-foreground/40">Generating signed PDF and recording audit trail...</p>
        </div>
      </div>
    )
  }

  const displaySigner = identifyData
    ? { ...signer, name: identifyData.name, email: identifyData.email }
    : signer

  return (
    <SignLayout proposalTitle={proposal.title} proposalToken={proposalToken} step={step} totalSteps={4}>
      {step === 1 && (
        <StepReview
          proposal={proposal as Parameters<typeof StepReview>[0]['proposal']}
          proposalJson={proposalJson}
          signer={displaySigner as Parameters<typeof StepReview>[0]['signer']}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepIdentify
          signer={displaySigner as Parameters<typeof StepIdentify>[0]['signer']}
          onNext={handleIdentify}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <>
          <StepSign
            signerName={identifyData?.name ?? signer.name}
            acceptanceClause={proposalJson.acceptanceClause}
            fieldPositions={fieldPositions}
            onNext={handleSign}
            onBack={() => setStep(2)}
          />
          {error && (
            <div className="mx-6 mb-6 rounded-xl border border-red-500/15 bg-red-500/5 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </>
      )}
    </SignLayout>
  )
}
