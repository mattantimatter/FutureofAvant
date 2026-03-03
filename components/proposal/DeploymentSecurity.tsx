'use client'

import React from 'react'
import { ChromaCard } from '@/components/reactbits/ChromaCard'
import { Badge } from '@/components/ui/Badge'
import { ProposalIcon } from './ProposalIcon'
import { Info } from 'lucide-react'

interface Feature {
  title: string
  icon: string
  description: string
  badge: string
  note?: string
}

interface DeploymentSecurityProps {
  content: {
    title: string
    subtitle: string
    features: Feature[]
  }
}

const badgeVariants: Record<string, 'accent' | 'secondary' | 'green' | 'amber' | 'muted'> = {
  Infrastructure: 'secondary',
  Governance: 'accent',
  'IP Protection': 'green',
  Compliance: 'amber',
  Certifications: 'muted',
  Flexibility: 'secondary',
}

export function DeploymentSecurity({ content }: DeploymentSecurityProps) {
  return (
    <section id="section-deployment-security" className="section-anchor proposal-section">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            Deployment & Security
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">{content.subtitle}</p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature, i) => (
            <ChromaCard
              key={feature.title}
              accent={i % 2 === 0 ? 'accent' : 'primary'}
              className="p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(105,106,172,0.12)' }}
                >
                  <ProposalIcon name={feature.icon} size={20} className="text-tertiary" />
                </div>
                <Badge variant={badgeVariants[feature.badge] ?? 'accent'} size="sm">
                  {feature.badge}
                </Badge>
              </div>
              <h3 className="mb-2 text-base font-bold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
              {feature.note && (
                <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-500/5 p-2.5 text-xs text-amber-400">
                  <Info size={12} className="mt-0.5 shrink-0" />
                  {feature.note}
                </div>
              )}
            </ChromaCard>
          ))}
        </div>
      </div>
    </section>
  )
}
