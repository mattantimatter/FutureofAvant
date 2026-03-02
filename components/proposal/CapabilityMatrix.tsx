'use client'

import React from 'react'
import { Check, X, Minus } from 'lucide-react'

type MatrixValue = 'yes' | 'no' | 'partial'

interface MatrixRow {
  capability: string
  atom: MatrixValue
  typical: MatrixValue
  note?: string
}

const DEFAULT_MATRIX: MatrixRow[] = [
  { capability: 'Customer-owned IP', atom: 'yes', typical: 'no' },
  { capability: 'Deploy in your VPC / on-prem', atom: 'yes', typical: 'no', note: 'SaaS-only by default' },
  { capability: 'Zero training on your data', atom: 'yes', typical: 'no' },
  { capability: 'RBAC + audit trails', atom: 'yes', typical: 'partial' },
  { capability: 'Model provider agnostic', atom: 'yes', typical: 'no', note: 'Locked to one provider' },
  { capability: 'RAG over private data', atom: 'yes', typical: 'partial' },
  { capability: 'Voice + search + workflow', atom: 'yes', typical: 'partial' },
  { capability: 'Deterministic workflows', atom: 'yes', typical: 'no' },
  { capability: 'Human-in-the-loop approvals', atom: 'yes', typical: 'partial' },
  { capability: 'Edge / hybrid deployment', atom: 'yes', typical: 'no' },
]

const ValueCell = ({ value }: { value: MatrixValue }) => {
  if (value === 'yes') return <Check size={16} className="text-emerald-400" />
  if (value === 'no') return <X size={16} className="text-red-400/60" />
  return <Minus size={16} className="text-amber-400" />
}

interface CapabilityMatrixProps {
  rows?: MatrixRow[]
}

export function CapabilityMatrix({ rows = DEFAULT_MATRIX }: CapabilityMatrixProps) {
  return (
    <section id="section-comparison" className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-secondary">Comparison</p>
          <h3 className="text-2xl font-semibold text-foreground">ATOM vs Typical SaaS AI</h3>
          <p className="mt-2 text-sm text-slate-400">
            Why enterprise teams choose infrastructure-first AI over SaaS wrappers
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[rgba(105,106,172,0.15)] bg-[rgba(10,10,15,0.6)]">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-[rgba(105,106,172,0.1)] bg-[rgba(105,106,172,0.05)] px-6 py-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Capability</div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              ATOM
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Typical SaaS
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.capability}
              className="grid grid-cols-3 items-center border-b border-[rgba(105,106,172,0.06)] px-6 py-3 last:border-0 hover:bg-[rgba(105,106,172,0.03)] transition-colors"
            >
              <div className="text-sm text-slate-300">{row.capability}</div>
              <div className="flex justify-center">
                <ValueCell value={row.atom} />
              </div>
              <div className="flex flex-col items-center">
                <ValueCell value={row.typical} />
                {row.note && (
                  <span className="mt-0.5 text-center text-xs text-slate-600">{row.note}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Check size={12} className="text-emerald-400" /> Yes</span>
          <span className="flex items-center gap-1"><Minus size={12} className="text-amber-400" /> Partial</span>
          <span className="flex items-center gap-1"><X size={12} className="text-red-400/60" /> No</span>
        </div>
      </div>
    </section>
  )
}
