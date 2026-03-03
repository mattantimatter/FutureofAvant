import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(['signature', 'initials']),
  page: z.number().int().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
})

const bodySchema = z.object({
  signatureRequestId: z.string().uuid(),
  fields: z.array(fieldSchema),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const { signatureRequestId, fields } = parsed.data
    const supabase = createServerClient()

    // Strip canvas-only properties before storing
    const storableFields = fields.map(({ id, type, page, x, y, width, height }) => ({
      id, type, page, x, y, width, height,
    }))

    const { error } = await supabase
      .from('signature_requests')
      .update({
        field_positions: storableFields,
        updated_at: new Date().toISOString(),
      })
      .eq('id', signatureRequestId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, fieldCount: storableFields.length })
  } catch (e) {
    console.error('[signers/fields]', e)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
