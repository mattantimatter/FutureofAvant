'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { AuditEventInsert } from '@/lib/supabase/types'

export async function logAuditEvent(event: AuditEventInsert) {
  const supabase = createServerClient()
  const { error } = await supabase.from('audit_events').insert(event)
  if (error) {
    console.error('[audit] Failed to log event:', error.message)
  }
}
