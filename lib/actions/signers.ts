'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { generateSignToken } from '@/lib/tokens'
import { revalidatePath } from 'next/cache'

const addSignerSchema = z.object({
  proposalId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.string().optional(),
})

export type AddSignerResult =
  | { success: true; signerId: string; signToken: string }
  | { success: false; error: string }

export async function addSigner(formData: FormData): Promise<AddSignerResult> {
  const parsed = addSignerSchema.safeParse({
    proposalId: formData.get('proposalId'),
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role') || undefined,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation error' }
  }

  const { proposalId, name, email, role } = parsed.data
  const signToken = generateSignToken()
  const supabase = createServerClient()

  // Create signer
  const { data: signer, error: signerError } = await supabase
    .from('signers')
    .insert({ proposal_id: proposalId, name, email, role: role ?? null })
    .select('id')
    .single()

  if (signerError || !signer) {
    return { success: false, error: signerError?.message ?? 'Failed to create signer' }
  }

  // Create signature request
  const { error: reqError } = await supabase.from('signature_requests').insert({
    proposal_id: proposalId,
    signer_id: signer.id,
    sign_token: signToken,
    status: 'pending',
  })

  if (reqError) {
    return { success: false, error: reqError.message }
  }

  revalidatePath(`/admin/proposals/${proposalId}`)
  return { success: true, signerId: signer.id, signToken }
}

export async function getSignersByProposal(proposalId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('signers')
    .select('*, signature_requests(*)')
    .eq('proposal_id', proposalId)
  if (error) throw error
  return data ?? []
}

export async function getSignatureRequestByToken(signToken: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('signature_requests')
    .select('*, signers(*), proposals(*)')
    .eq('sign_token', signToken)
    .single()
  if (error) return null
  return data
}
