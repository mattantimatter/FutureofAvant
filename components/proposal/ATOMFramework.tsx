'use client'

import React, { useState } from 'react'
import { DepthCard } from '@/components/reactbits/DepthCard'
import { Badge } from '@/components/ui/Badge'
import { ProposalIcon } from './ProposalIcon'
import { cn } from '@/lib/utils'
import { Check, ExternalLink } from 'lucide-react'
import { GradientBlob } from '@/components/reactbits/GradientBlob'

interface Pillar {
  id: string
  step: string
  title: string
  subtitle: string
  icon: string
  color: string
  description: string
  capabilities: string[]
  exampleUrl?: string
  exampleLabel?: string
}

interface ATOMFrameworkProps {
  content: {
    title: string
    subtitle: string
    description: string
    pillars: Pillar[]
  }
}

const colorMap: Record<string, { accent: 'accent' | 'secondary' | 'green'; glow: string; badge: 'accent' | 'secondary' | 'green'; text: string }> = {
  purple: { accent: 'accent', glow: 'rgba(105,106,172,0.3)', badge: 'accent', text: 'text-tertiary' },
  indigo: { accent: 'secondary', glow: 'rgba(62,63,126,0.3)', badge: 'secondary', text: 'text-indigo-300' },
  green: { accent: 'green', glow: 'rgba(16,185,129,0.3)', badge: 'green', text: 'text-emerald-300' },
}

export function ATOMFramework({ content }: ATOMFrameworkProps) {
  const [activePillar, setActivePillar] = useState<string | null>(null)

  return (
    <section id="section-atom-framework" className="section-anchor proposal-section relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <GradientBlob size="xl" color="primary" className="opacity-10" animate={false} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            Framework
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="mb-2 text-2xl font-bold text-gradient">{content.subtitle}</p>
          <p className="mx-auto max-w-2xl text-base text-slate-400">{content.description}</p>
        </div>

        {/* Flow connector */}
        <div className="mb-8 hidden items-center justify-center gap-4 md:flex">
          {content.pillars.map((pillar, i) => {
            const c = colorMap[pillar.color] ?? colorMap.purple
            return (
              <React.Fragment key={pillar.id}>
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all cursor-pointer',
                    activePillar === pillar.id
                      ? 'border-accent/60 bg-accent/15 text-white'
                      : 'border-[rgba(105,106,172,0.2)] bg-[rgba(10,10,15,0.6)] text-slate-300 hover:text-white'
                  )}
                  onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
                >
                  <ProposalIcon name={pillar.icon} size={16} className={c.text} />
                  {pillar.title}
                </div>
                {i < content.pillars.length - 1 && (
                  <div className="flex h-px w-8 items-center">
                    <div className="h-px w-full bg-gradient-to-r from-purple-500/40 to-transparent" />
                    <span className="shrink-0 text-accent">→</span>
                    <div className="h-px w-full bg-gradient-to-l from-purple-500/40 to-transparent" />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Pillar cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {content.pillars.map((pillar) => {
            const c = colorMap[pillar.color] ?? colorMap.purple
            return (
              <DepthCard
                key={pillar.id}
                glowColor={c.glow}
                className="p-6 cursor-pointer"
              >
                {/* Step number + badge + example link */}
                <div className="mb-5 flex items-start justify-between gap-2">
                  <span className="font-mono text-5xl font-black text-[rgba(105,106,172,0.12)]">
                    {pillar.step}
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge variant={c.badge} size="sm">{pillar.title}</Badge>
                    {pillar.exampleUrl && (
                      <a
                        href={pillar.exampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 rounded-lg border border-accent/50 bg-accent/20 px-2 py-1 text-[10px] font-semibold text-secondary shadow-[0_0_16px_rgba(105,106,172,0.4),0_0_32px_rgba(105,106,172,0.2)] transition-all hover:border-accent hover:bg-accent/30 hover:shadow-[0_0_20px_rgba(105,106,172,0.5),0_0_40px_rgba(105,106,172,0.25)] hover:text-foreground"
                      >
                        <ExternalLink size={9} />
                        {pillar.exampleLabel ?? 'View Example'}
                      </a>
                    )}
                  </div>
                </div>

                {/* Icon + title */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: c.glow }}
                  >
                    <ProposalIcon name={pillar.icon} size={20} className={c.text} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                    <p className="text-xs text-slate-500">{pillar.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-5 text-sm leading-relaxed text-slate-400">{pillar.description}</p>

                {/* Capabilities list */}
                <div className="space-y-2 border-t border-[rgba(105,106,172,0.1)] pt-4">
                  {pillar.capabilities.map((cap) => (
                    <div key={cap} className="flex items-start gap-2 text-xs text-slate-400">
                      <Check size={12} className={cn('mt-0.5 shrink-0', c.text)} />
                      {cap}
                    </div>
                  ))}
                </div>
              </DepthCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
