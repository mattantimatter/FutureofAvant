'use client'

import React from 'react'
import { AnimatedList } from '@/components/reactbits/AnimatedList'
import { ChromaCard } from '@/components/reactbits/ChromaCard'
import { ProposalIcon } from './ProposalIcon'

interface Bullet {
  icon: string
  title: string
  body: string
}

interface ExecutiveSummaryProps {
  content: {
    title: string
    subtitle: string
    bullets: Bullet[]
  }
}

const accentColors = ['accent', 'primary', 'green', 'primary', 'accent'] as const

export function ExecutiveSummary({ content }: ExecutiveSummaryProps) {
  return (
    <section id="section-executive-summary" className="section-anchor proposal-section">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            Executive Summary
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">{content.subtitle}</p>
        </div>

        {/* Bullets */}
        <AnimatedList staggerDelay={150}>
          {content.bullets.map((bullet, i) => (
            <ChromaCard key={bullet.title} accent={accentColors[i % accentColors.length]}>
              <div className="flex gap-5 p-6">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(105,106,172,0.15)' }}
                >
                  <ProposalIcon name={bullet.icon} size={22} className="text-tertiary" />
                </div>
                <div>
                  <h3 className="mb-2 text-base font-bold text-white">{bullet.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{bullet.body}</p>
                </div>
              </div>
            </ChromaCard>
          ))}
        </AnimatedList>
      </div>
    </section>
  )
}
