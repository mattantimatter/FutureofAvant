'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { generatePublicToken } from '@/lib/tokens'
import { defaultProposalJSON, defaultPricingJSON } from '@/lib/seed'
import { revalidatePath } from 'next/cache'

const createProposalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  clientName: z.string().min(1, 'Client name is required').max(200),
})

export type CreateProposalResult =
  | { success: true; proposalId: string; publicToken: string }
  | { success: false; error: string }

export async function createProposal(
  formData: FormData
): Promise<CreateProposalResult> {
  const parsed = createProposalSchema.safeParse({
    title: formData.get('title'),
    clientName: formData.get('clientName'),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation error' }
  }

  const { title, clientName } = parsed.data
  const publicToken = generatePublicToken()

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('proposals')
    .insert({
      title,
      client_name: clientName,
      status: 'draft',
      public_token: publicToken,
      proposal_json: defaultProposalJSON as unknown as Record<string, unknown>,
      pricing_json: defaultPricingJSON as unknown as Record<string, unknown>,
    })
    .select('id, public_token')
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? 'Failed to create proposal' }
  }

  revalidatePath('/admin')
  return { success: true, proposalId: data.id, publicToken: data.public_token }
}

export async function updateProposalStatus(
  proposalId: string,
  status: 'draft' | 'sent' | 'signed'
) {
  const supabase = createServerClient()
  await supabase
    .from('proposals')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', proposalId)
  revalidatePath('/admin')
}

export async function updateProposalPdfPath(
  proposalId: string,
  field: 'source_pdf_path' | 'signed_pdf_path',
  path: string
) {
  const supabase = createServerClient()
  await supabase
    .from('proposals')
    .update({ [field]: path, updated_at: new Date().toISOString() })
    .eq('id', proposalId)
  revalidatePath(`/admin/proposals/${proposalId}`)
}

export async function getProposals() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getProposalById(id: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}
