'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ProposalIcon } from './ProposalIcon'
import { Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Phase {
  phase: string
  title: string
  duration: string
  icon: string
  color: string
  deliverables: string[]
  milestone: string
}

interface RolloutPlanProps {
  content: {
    title: string
    subtitle: string
    phases: Phase[]
  }
}

const colorMap: Record<string, {
  dot: string
  label: string
  card: string
  milestone: string
  line: string
}> = {
  purple: {
    dot: 'bg-secondary/60 ring-secondary/20',
    label: 'text-secondary',
    card: 'border-secondary/15 hover:border-secondary/30',
    milestone: 'bg-secondary/[0.08] text-secondary border-secondary/15',
    line: 'from-secondary/30',
  },
  indigo: {
    dot: 'bg-accent/60 ring-accent/20',
    label: 'text-accent',
    card: 'border-accent/15 hover:border-accent/25',
    milestone: 'bg-accent/[0.08] text-accent border-accent/15',
    line: 'from-accent/30',
  },
  blue: {
    dot: 'bg-blue-400/60 ring-blue-400/20',
    label: 'text-blue-400',
    card: 'border-blue-400/15 hover:border-blue-400/25',
    milestone: 'bg-blue-400/[0.08] text-blue-400 border-blue-400/15',
    line: 'from-blue-400/30',
  },
  green: {
    dot: 'bg-green-400/60 ring-green-400/20',
    label: 'text-green-400',
    card: 'border-green-400/15 hover:border-green-400/25',
    milestone: 'bg-green-400/[0.08] text-green-400 border-green-400/15',
    line: 'from-green-400/30',
  },
}

export function RolloutPlan({ content }: RolloutPlanProps) {
  const [visiblePhases, setVisiblePhases] = useState<Set<number>>(new Set())
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = phaseRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisiblePhases((p) => new Set([...p, i])) },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <section id="section-rollout-plan" className="section-anchor proposal-section">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground/55">
            Rollout Plan
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-md text-base font-light text-foreground/70">{content.subtitle}</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-[19px] top-6 bottom-6 w-px md:left-1/2 md:-translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, rgba(105,106,172,0.25) 0%, rgba(105,106,172,0.10) 100%)',
            }}
          />

          <div className="space-y-10">
            {content.phases.map((phase, i) => {
              const c = colorMap[phase.color] ?? colorMap.purple
              const isVisible = visiblePhases.has(i)

              return (
                <div
                  key={phase.phase}
                  ref={(el) => { phaseRefs.current[i] = el }}
                  className={cn(
                    'relative transition-all duration-700',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  )}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* Timeline node — centered on the vertical line */}
                  <div className="absolute left-0 top-5 flex flex-col items-center md:left-1/2 md:-translate-x-1/2">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full ring-4 bg-background',
                        c.dot, c.dot.replace('bg-', 'ring-').replace('/60', '/20')
                      )}
                    >
                      <ProposalIcon name={phase.icon} size={16} className={c.label} />
                    </div>
                  </div>

                  {/* Card — offset to the right on mobile, alternating on desktop */}
                  <div
                    className={cn(
                      'ml-16 rounded-2xl border bg-foreground/[0.02] p-6 transition-all duration-200',
                      c.card,
                      'md:ml-0',
                      i % 2 === 0 ? 'md:mr-[calc(50%+1.5rem)]' : 'md:ml-[calc(50%+1.5rem)]'
                    )}
                  >
                    {/* Phase label + duration */}
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={cn('font-mono text-xs font-bold uppercase tracking-wider', c.label)}>
                          {phase.phase}
                        </span>
                        <span className="h-0.5 w-4 bg-current opacity-20 rounded" />
                        <span className="font-semibold text-foreground">{phase.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-2.5 py-1">
                        <Clock size={10} className="text-foreground/75" />
                        <span className="text-xs text-foreground/70">{phase.duration}</span>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <ul className="mb-4 space-y-2">
                      {phase.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-sm font-light text-foreground/75">
                          <Check size={13} className={cn('mt-0.5 shrink-0', c.label)} />
                          {d}
                        </li>
                      ))}
                    </ul>

                    {/* Milestone */}
                    <div
                      className={cn(
                        'rounded-xl border px-4 py-2.5 text-xs font-medium',
                        c.milestone
                      )}
                    >
                      ✦ Milestone: {phase.milestone}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
