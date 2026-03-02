import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { updateProposalPdfPath } from '@/lib/actions/proposals'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const proposalId = formData.get('proposalId') as string | null

    if (!file || !proposalId) {
      return NextResponse.json({ success: false, error: 'file and proposalId are required' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files are allowed' }, { status: 400 })
    }

    const supabase = createServerClient()
    const arrayBuffer = await file.arrayBuffer()
    const filePath = `source/${proposalId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { error: uploadError } = await supabase.storage
      .from('proposal_source_pdfs')
      .upload(filePath, new Uint8Array(arrayBuffer), {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 })
    }

    await updateProposalPdfPath(proposalId, 'source_pdf_path', filePath)

    return NextResponse.json({ success: true, path: filePath })
  } catch (error) {
    console.error('[admin/upload-pdf]', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
