import { getProposals } from '@/lib/actions/proposals'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { Plus, FileText, Clock, CheckCircle, Send, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Proposal } from '@/lib/supabase/types'

const statusIcons = {
  draft: Clock,
  sent: Send,
  signed: CheckCircle,
}

const statusColors: Record<string, 'accent' | 'amber' | 'green'> = {
  draft: 'accent',
  sent: 'amber',
  signed: 'green',
}

export default async function AdminDashboardPage() {
  let proposals: Proposal[] = []
  try {
    proposals = await getProposals()
  } catch {
    // Supabase not connected yet — show empty state
  }

  const counts = {
    total: proposals.length,
    draft: proposals.filter((p) => p.status === 'draft').length,
    sent: proposals.filter((p) => p.status === 'sent').length,
    signed: proposals.filter((p) => p.status === 'signed').length,
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your Avant × Antimatter proposals</p>
          </div>
          <Link
            href="/admin/proposals/new"
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-foreground shadow-[0_0_20px_rgba(105,106,172,0.3)] transition-all hover:bg-secondary"
          >
            <Plus size={16} />
            New Proposal
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total', value: counts.total, color: 'text-white' },
            { label: 'Draft', value: counts.draft, color: 'text-secondary' },
            { label: 'Sent', value: counts.sent, color: 'text-amber-400' },
            { label: 'Signed', value: counts.signed, color: 'text-emerald-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(10,10,15,0.5)] p-4"
            >
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Proposals table */}
        <div className="rounded-2xl border border-[rgba(105,106,172,0.1)] bg-[rgba(10,10,15,0.5)] overflow-hidden">
          <div className="border-b border-[rgba(105,106,172,0.08)] px-6 py-4">
            <h2 className="font-semibold text-foreground">All Proposals</h2>
          </div>

          {proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <FileText size={32} className="mb-3 text-slate-700" />
              <p className="mb-1 font-medium text-slate-400">No proposals yet</p>
              <p className="mb-4 text-sm text-slate-600">
                Create your first proposal to get started.
              </p>
              <Link
                href="/admin/proposals/new"
                className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
              >
                <Plus size={14} />
                Create Proposal
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(105,106,172,0.06)]">
              {proposals.map((proposal) => {
                const StatusIcon = statusIcons[proposal.status]
                return (
                  <div
                    key={proposal.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(105,106,172,0.04)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="truncate font-semibold text-foreground">{proposal.title}</p>
                        <Badge variant={statusColors[proposal.status]} size="sm">
                          {proposal.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{proposal.client_name}</span>
                        <span>·</span>
                        <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
                        <span>·</span>
                        <code className="font-mono text-xs text-slate-600">
                          {proposal.public_token.slice(0, 12)}...
                        </code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/p/${proposal.public_token}`}
                        target="_blank"
                        className="flex items-center gap-1.5 rounded-lg border border-[rgba(105,106,172,0.15)] px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-accent/30 hover:text-white"
                      >
                        <Eye size={12} />
                        View
                      </Link>
                      <Link
                        href={`/admin/proposals/${proposal.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-accent/15 px-3 py-1.5 text-xs font-semibold text-tertiary transition-all hover:bg-accent/20"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
