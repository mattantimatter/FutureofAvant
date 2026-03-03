import { redirect } from 'next/navigation'

/**
 * /admin/proposals → redirect to /admin dashboard
 * The dashboard shows the full proposals list.
 */
export default function ProposalsPage() {
  redirect('/admin')
}
