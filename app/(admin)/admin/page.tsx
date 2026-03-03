'use client'

import React, { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { Plus, FileText, Clock, CheckCircle, Send, Eye, Copy, ExternalLink, Sparkles, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import type { Proposal } from '@/lib/supabase/types'

const statusColors: Record<string, 'accent' | 'amber' | 'green'> = {
  draft: 'accent', sent: 'amber', signed: 'green',
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://futureofavant.com'

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    fetch('/api/admin/proposals-list')
      .then((r) => r.json())
      .then((d) => setProposals(d.proposals ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        toast('Sample proposal created!')
        window.location.href = `/admin/proposals/${data.proposalId}`
      } else {
        toast(data.error ?? 'Failed to seed', 'error')
      }
    } catch {
      toast('Failed to seed proposal', 'error')
    } finally {
      setSeeding(false)
    }
  }

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast(`${label} copied!`)
  }

  const counts = {
    total: proposals.length,
    draft: proposals.filter((p) => p.status === 'draft').length,
    sent: proposals.filter((p) => p.status === 'sent').length,
    signed: proposals.filter((p) => p.status === 'signed').length,
  }

  const demoUrl = `${SITE_URL}/demo`

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm font-light text-foreground/40">Avant × Antimatter proposal management</p>
          </div>
          <Link
            href="/admin/proposals/new"
            className="flex items-center gap-2 rounded-[40px] px-4 py-2.5 text-sm font-medium text-foreground btn-primary"
          >
            <Plus size={15} />New Proposal
          </Link>
        </div>

        {/* Demo link banner */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.08] to-primary/[0.05]">
          <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                  <Sparkles size={16} className="text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Customer Demo Link</p>
                  <p className="mt-0.5 text-sm font-light text-foreground/50">
                    Send this to Avant — renders the full interactive proposal with no login required.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <code className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-3 py-1.5 text-xs text-secondary">
                      {demoUrl}
                    </code>
                    <button
                      onClick={() => copy(demoUrl, 'Demo link')}
                      className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-3 py-1.5 text-xs text-foreground/50 transition-all hover:border-accent/30 hover:text-foreground"
                    >
                      <Copy size={11} />Copy
                    </button>
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-3 py-1.5 text-xs text-foreground/50 transition-all hover:border-accent/30 hover:text-foreground"
                    >
                      <ExternalLink size={11} />Preview
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="flex items-center gap-2 rounded-[40px] border border-accent/30 px-4 py-2 text-sm font-medium text-secondary transition-all hover:bg-accent/10 disabled:opacity-50"
                >
                  {seeding ? (
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : <Plus size={14} />}
                  Create Live Proposal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Total', value: counts.total, color: 'text-foreground' },
            { label: 'Draft', value: counts.draft, color: 'text-secondary' },
            { label: 'Sent', value: counts.sent, color: 'text-yellow-400' },
            { label: 'Signed', value: counts.signed, color: 'text-green-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4"
            >
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="mt-1 text-xs font-light text-foreground/30 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Proposals list */}
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]">
          <div className="border-b border-foreground/[0.06] px-6 py-4">
            <h2 className="font-semibold text-foreground">All Proposals</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="h-6 w-6 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <FileText size={28} className="mb-3 text-foreground/15" />
              <p className="mb-1 font-medium text-foreground/50">No proposals yet</p>
              <p className="mb-5 text-sm font-light text-foreground/30">
                Create a live proposal to start tracking and signing.
              </p>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 rounded-[40px] px-5 py-2.5 text-sm font-medium text-foreground btn-primary disabled:opacity-50"
              >
                <Plus size={14} />Create Sample Proposal
              </button>
            </div>
          ) : (
            <div className="divide-y divide-foreground/[0.04]">
              {proposals.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-foreground/[0.02]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <p className="truncate font-medium text-foreground">{p.title}</p>
                      <Badge variant={statusColors[p.status]} size="sm">{p.status}</Badge>
                    </div>
                    <p className="text-xs font-light text-foreground/30">
                      {p.client_name} · {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/p/${p.public_token}`}
                      target="_blank"
                      className="flex items-center gap-1 rounded-lg border border-foreground/[0.08] px-2.5 py-1.5 text-xs text-foreground/40 transition-all hover:border-foreground/20 hover:text-foreground"
                    >
                      <Eye size={11} />View
                    </Link>
                    <Link
                      href={`/admin/proposals/${p.id}`}
                      className="flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-secondary transition-all hover:bg-accent/20"
                    >
                      Manage <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
