'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { stampSignaturePdf, generateSignaturePage } from '@/lib/pdf/stamp'
import { logAuditEvent } from './audit'
import { revalidatePath } from 'next/cache'
import type { ProposalJSON } from '@/lib/seed'

const submitSignatureSchema = z.object({
  signToken: z.string().min(10),
  signerName: z.string().min(1),
  signerEmail: z.string().email(),
  signerPhone: z.string().optional(),
  signatureType: z.enum(['typed', 'drawn']),
  signatureText: z.string().optional(),
  signatureDataURL: z.string().optional(),
  initialsText: z.string().optional(),
  initialsDataURL: z.string().optional(),
  accepted: z.literal('true'),
  acceptanceText: z.string().min(10),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
})

export type SubmitSignatureResult =
  | { success: true; signedPdfPath: string | null }
  | { success: false; error: string }

export async function submitSignature(formData: FormData): Promise<SubmitSignatureResult> {
  const raw = {
    signToken: formData.get('signToken'),
    signerName: formData.get('signerName'),
    signerEmail: formData.get('signerEmail'),
    signerPhone: formData.get('signerPhone') || undefined,
    signatureType: formData.get('signatureType'),
    signatureText: formData.get('signatureText') || undefined,
    signatureDataURL: formData.get('signatureDataURL') || undefined,
    initialsText: formData.get('initialsText') || undefined,
    initialsDataURL: formData.get('initialsDataURL') || undefined,
    accepted: formData.get('accepted'),
    acceptanceText: formData.get('acceptanceText'),
    userAgent: formData.get('userAgent') || undefined,
    ipAddress: formData.get('ipAddress') || undefined,
  }

  const parsed = submitSignatureSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation error' }
  }

  const data = parsed.data
  const supabase = createServerClient()

  // Find signature request
  const { data: sigReq, error: sigReqError } = await supabase
    .from('signature_requests')
    .select('*, proposals!inner(*), signers!inner(*)')
    .eq('sign_token', data.signToken)
    .single()

  if (sigReqError || !sigReq) {
    return { success: false, error: 'Invalid signature request token' }
  }

  if (sigReq.status === 'signed') {
    return { success: false, error: 'This document has already been signed' }
  }

  const proposal = sigReq.proposals as unknown as { id: string; source_pdf_path: string | null; proposal_json: ProposalJSON; public_token: string }
  const signedAt = new Date().toISOString()

  // Upload drawn signature image to storage if present
  let signatureImagePath: string | null = null
  if (data.signatureType === 'drawn' && data.signatureDataURL) {
    try {
      const base64Data = data.signatureDataURL.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      const filePath = `signatures/${sigReq.id}-signature.png`
      const { error: uploadError } = await supabase.storage
        .from('signatures')
        .upload(filePath, buffer, { contentType: 'image/png', upsert: true })
      if (!uploadError) signatureImagePath = filePath
    } catch (e) {
      console.error('[sign] Failed to upload signature image:', e)
    }
  }

  // Generate / stamp signed PDF
  let signedPdfPath: string | null = null
  try {
    const signatureBlock = {
      signerName: data.signerName,
      signerEmail: data.signerEmail,
      signedAt,
      signatureType: data.signatureType,
      signatureText: data.signatureText,
      signatureDataURL: data.signatureDataURL,
      initialsText: data.initialsText,
      ipAddress: data.ipAddress,
      acceptanceText: data.acceptanceText,
    }

    let pdfBytes: Uint8Array
    if (proposal.source_pdf_path) {
      // Download source PDF from storage and stamp
      const { data: pdfData } = await supabase.storage
        .from('proposal_source_pdfs')
        .download(proposal.source_pdf_path)
      if (pdfData) {
        const arrayBuffer = await pdfData.arrayBuffer()
        pdfBytes = await stampSignaturePdf(new Uint8Array(arrayBuffer), signatureBlock)
      } else {
        pdfBytes = await generateSignaturePage(proposal.id, signatureBlock)
      }
    } else {
      pdfBytes = await generateSignaturePage(proposal.id, signatureBlock)
    }

    const pdfPath = `signed/${proposal.id}/${sigReq.id}-signed.pdf`
    const { error: pdfUploadError } = await supabase.storage
      .from('proposal_signed_pdfs')
      .upload(pdfPath, pdfBytes, { contentType: 'application/pdf', upsert: true })

    if (!pdfUploadError) {
      signedPdfPath = pdfPath
      // Update proposal with signed pdf path
      await supabase
        .from('proposals')
        .update({ signed_pdf_path: pdfPath, updated_at: signedAt })
        .eq('id', proposal.id)
    }
  } catch (e) {
    console.error('[sign] PDF generation failed:', e)
  }

  // Update signature request
  await supabase
    .from('signature_requests')
    .update({
      status: 'signed',
      signed_at: signedAt,
      signature_type: data.signatureType,
      signature_text: data.signatureText ?? null,
      signature_image_path: signatureImagePath,
      initials_text: data.initialsText ?? null,
      ip_address: data.ipAddress ?? null,
      user_agent: data.userAgent ?? null,
      acceptance: true,
      acceptance_text: data.acceptanceText,
      updated_at: signedAt,
    })
    .eq('id', sigReq.id)

  // Check if all signers have signed
  const { data: allRequests } = await supabase
    .from('signature_requests')
    .select('status')
    .eq('proposal_id', proposal.id)

  const allSigned = allRequests?.every((r) => r.status === 'signed') ?? false
  if (allSigned) {
    await supabase
      .from('proposals')
      .update({ status: 'signed', updated_at: signedAt })
      .eq('id', proposal.id)
  }

  // Log audit events
  await logAuditEvent({
    proposal_id: proposal.id,
    signer_id: sigReq.signer_id,
    signature_request_id: sigReq.id,
    event_type: 'SUBMIT_SIGNATURE',
    event_meta: {
      signatureType: data.signatureType,
      signedAt,
      hasSignatureImage: !!signatureImagePath,
    },
    ip_address: data.ipAddress ?? null,
    user_agent: data.userAgent ?? null,
  })

  if (signedPdfPath) {
    await logAuditEvent({
      proposal_id: proposal.id,
      signer_id: sigReq.signer_id,
      signature_request_id: sigReq.id,
      event_type: 'FINALIZE_PDF',
      event_meta: { signedPdfPath },
      ip_address: data.ipAddress ?? null,
      user_agent: data.userAgent ?? null,
    })
  }

  revalidatePath(`/p/${proposal.public_token}`)
  revalidatePath(`/admin/proposals/${proposal.id}`)

  return { success: true, signedPdfPath }
}
