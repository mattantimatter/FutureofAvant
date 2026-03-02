'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewProposalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ id: string; token: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setSuccess({ id: data.proposalId, token: data.publicToken })
      } else {
        setError(data.error ?? 'Failed to create proposal')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <div className="w-full max-w-sm rounded-2xl border border-emerald-500/20 bg-[rgba(10,10,15,0.8)] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle size={28} className="text-emerald-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Proposal Created!</h2>
            <p className="mb-6 text-sm text-slate-400">
              Your proposal has been seeded with the default Avant × Atom content.
            </p>
            <div className="mb-6 rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(2,2,2,0.4)] p-3 text-left">
              <p className="mb-1 text-xs text-slate-500">Public Token</p>
              <code className="text-xs text-tertiary break-all">{success.token}</code>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={`/admin/proposals/${success.id}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
              >
                Manage Proposal →
              </Link>
              <Link
                href={`/p/${success.token}`}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(105,106,172,0.15)] px-4 py-2 text-sm text-slate-300 transition-all hover:text-white"
              >
                Preview Proposal
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">New Proposal</h1>
            <p className="text-sm text-slate-400">Create an interactive ATOM deployment proposal</p>
          </div>
        </div>

        <div className="max-w-lg">
          <div className="rounded-2xl border border-[rgba(105,106,172,0.12)] bg-[rgba(10,10,15,0.6)] p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Proposal Title <span className="text-red-400">*</span>
                </label>
                <input
                  name="title"
                  defaultValue="Avant × Antimatter — ATOM Deployment Proposal"
                  required
                  className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-accent/50"
                  placeholder="e.g. Avant × Antimatter — ATOM Deployment Proposal"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Client Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="clientName"
                  defaultValue="Avant"
                  required
                  className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-accent/50"
                  placeholder="e.g. Avant"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="rounded-xl border border-[rgba(105,106,172,0.08)] bg-[rgba(105,106,172,0.03)] p-4 text-sm text-slate-400">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <FileText size={12} />
                  Default Content
                </div>
                The proposal will be seeded with all 9 sections of the default Avant × Atom content
                including executive summary, ATOM framework, use cases, rollout plan, and pricing.
                You can customize the JSON in the manage page after creation.
              </div>

              <Button type="submit" loading={loading} size="lg" className="w-full">
                Create Proposal
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
