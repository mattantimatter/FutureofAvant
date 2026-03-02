'use client'

import React, { useState } from 'react'
import { DepthCard } from '@/components/reactbits/DepthCard'
import { Badge } from '@/components/ui/Badge'
import { ProposalIcon } from './ProposalIcon'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UseCase {
  id: string
  title: string
  icon: string
  phase: string
  priority: string
  description: string
  outcomes: string[]
  integrations: string[]
}

interface AvantUseCasesProps {
  content: {
    title: string
    subtitle: string
    useCases: UseCase[]
  }
}

const phaseColors: Record<string, 'accent' | 'secondary' | 'green' | 'muted'> = {
  'Phase 1 Pilot': 'accent',
  'Phase 2': 'secondary',
  'Phase 3': 'green',
  'Expansion': 'muted',
}

export function AvantUseCases({ content }: AvantUseCasesProps) {
  const [expanded, setExpanded] = useState<string | null>(content.useCases[0]?.id ?? null)

  return (
    <section id="section-avant-use-cases" className="section-anchor proposal-section">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-secondary">
            Use Cases
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">{content.subtitle}</p>
        </div>

        {/* Use case cards */}
        <div className="space-y-4">
          {content.useCases.map((uc) => {
            const isExpanded = expanded === uc.id
            const phaseColor = phaseColors[uc.phase] ?? 'slate'
            return (
              <DepthCard key={uc.id} className="overflow-hidden">
                {/* Card header */}
                <button
                  className="flex w-full items-start gap-4 p-6 text-left"
                  onClick={() => setExpanded(isExpanded ? null : uc.id)}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(105,106,172,0.12)' }}
                  >
                    <ProposalIcon name={uc.icon} size={22} className="text-tertiary" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">{uc.title}</h3>
                      <Badge variant={phaseColor} size="sm">{uc.phase}</Badge>
                      {uc.priority === 'High' && (
                        <Badge variant="amber" size="sm">High Priority</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">{uc.description}</p>
                  </div>
                  <div className="ml-2 mt-0.5 shrink-0 text-slate-500">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Expanded content */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isExpanded ? 'max-h-[600px]' : 'max-h-0'
                  )}
                >
                  <div className="border-t border-[rgba(105,106,172,0.1)] px-6 pb-6 pt-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Expected outcomes */}
                      <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-secondary">
                          Expected Outcomes
                        </h4>
                        <ul className="space-y-2">
                          {uc.outcomes.map((outcome) => (
                            <li key={outcome} className="flex items-start gap-2 text-sm text-slate-300">
                              <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Integrations */}
                      <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-secondary">
                          Key Integrations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uc.integrations.map((integration) => (
                            <span
                              key={integration}
                              className="rounded-lg border border-[rgba(105,106,172,0.15)] bg-[rgba(105,106,172,0.05)] px-2.5 py-1 text-xs text-slate-300"
                            >
                              {integration}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DepthCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
