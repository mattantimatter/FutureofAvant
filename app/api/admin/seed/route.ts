import { NextResponse } from 'next/server'
import { createProposal } from '@/lib/actions/proposals'

/**
 * POST /api/admin/seed
 * Seeds the default Avant × Atom proposal into the database.
 * Called from the admin dashboard "Create Sample Proposal" button.
 */
export async function POST() {
  try {
    const formData = new FormData()
    formData.append('title', 'Avant × Antimatter — ATOM Deployment Proposal')
    formData.append('clientName', 'Avant')
    const result = await createProposal(formData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[seed]', error)
    return NextResponse.json({ success: false, error: 'Seed failed' }, { status: 500 })
  }
}
