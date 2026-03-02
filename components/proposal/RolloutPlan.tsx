'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ProposalIcon } from './ProposalIcon'
import { Check } from 'lucide-react'
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

const colorMap: Record<string, { ring: string; bg: string; text: string; line: string }> = {
  purple: { ring: 'ring-accent/50', bg: 'bg-accent/15', text: 'text-tertiary', line: 'from-purple-500/40' },
  indigo: { ring: 'ring-indigo-500/50', bg: 'bg-indigo-600/20', text: 'text-indigo-300', line: 'from-indigo-500/40' },
  blue: { ring: 'ring-blue-500/50', bg: 'bg-blue-600/20', text: 'text-blue-300', line: 'from-blue-500/40' },
  green: { ring: 'ring-emerald-500/50', bg: 'bg-emerald-600/20', text: 'text-emerald-300', line: 'from-emerald-500/40' },
}

export function RolloutPlan({ content }: RolloutPlanProps) {
  const [visiblePhases, setVisiblePhases] = useState<Set<number>>(new Set())
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = phaseRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisiblePhases((prev) => new Set([...prev, i]))
          }
        },
        { threshold: 0.2 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <section id="section-rollout-plan" className="section-anchor proposal-section">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-secondary">
            Rollout Plan
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">{content.subtitle}</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-purple-500/40 via-indigo-500/20 to-transparent md:left-1/2" />

          <div className="space-y-12">
            {content.phases.map((phase, i) => {
              const c = colorMap[phase.color] ?? colorMap.purple
              const isVisible = visiblePhases.has(i)
              const isEven = i % 2 === 0

              return (
                <div
                  key={phase.phase}
                  ref={(el) => { phaseRefs.current[i] = el }}
                  className={cn(
                    'relative flex gap-6 transition-all duration-700',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                    'md:gap-0',
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Timeline node */}
                  <div className="relative flex shrink-0 flex-col items-center md:absolute md:left-1/2 md:-translate-x-1/2">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full ring-2',
                        c.bg, c.ring
                      )}
                    >
                      <ProposalIcon name={phase.icon} size={18} className={c.text} />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={cn(
                      'flex-1 rounded-2xl border border-[rgba(105,106,172,0.12)] bg-[rgba(10,10,15,0.6)] p-6 backdrop-blur-sm',
                      isEven ? 'md:mr-16 md:ml-0' : 'md:ml-16 md:mr-0',
                      'ml-4 md:ml-0'
                    )}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className={cn('font-mono text-xs font-bold', c.text)}>{phase.phase}</span>
                        <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                      </div>
                      <span className="rounded-lg border border-[rgba(105,106,172,0.15)] px-3 py-1 text-xs text-slate-400">
                        {phase.duration}
                      </span>
                    </div>

                    <ul className="mb-4 space-y-1.5">
                      {phase.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-slate-400">
                          <Check size={12} className={cn('mt-0.5 shrink-0', c.text)} />
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 text-xs font-medium',
                        c.bg, c.text,
                        'border border-[rgba(105,106,172,0.1)]'
                      )}
                    >
                      Milestone: {phase.milestone}
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
