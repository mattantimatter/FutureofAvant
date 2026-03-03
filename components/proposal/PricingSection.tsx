'use client'

import React from 'react'
import { Check, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface PricingTier {
  id: string
  name: string
  price: string
  period: string
  badge: string
  description: string
  features: string[]
  cta: string
  highlight: boolean
}

interface PaymentScheduleItem {
  milestone: string
  amount: string
  timing: string
}

interface PricingSectionProps {
  content: {
    title: string
    subtitle: string
    note: string
    tiers: PricingTier[]
    paymentSchedule: PaymentScheduleItem[]
  }
  proposalToken: string
  signToken?: string
}

export function PricingSection({ content, proposalToken, signToken }: PricingSectionProps) {
  return (
    <section id="section-pricing" className="section-anchor proposal-section">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-4 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            Pricing
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">{content.subtitle}</p>
        </div>

        {/* Note */}
        <div className="mb-10 flex items-start justify-center gap-2 text-sm text-amber-400">
          <Star size={14} className="mt-0.5 shrink-0" />
          <span>{content.note}</span>
        </div>

        {/* Tier cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {content.tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative overflow-hidden rounded-2xl border transition-all duration-300',
                tier.highlight
                  ? 'border-accent/40 bg-gradient-to-b from-accent/10 to-[rgba(10,10,15,0.8)] shadow-[0_0_40px_rgba(105,106,172,0.2)]'
                  : 'border-[rgba(105,106,172,0.12)] bg-[rgba(10,10,15,0.5)] hover:border-[rgba(105,106,172,0.25)]'
              )}
            >
              {tier.highlight && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              )}

              <div className="p-6">
                {/* Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant={tier.highlight ? 'accent' : 'muted'} size="sm">
                    {tier.badge}
                  </Badge>
                  {tier.highlight && (
                    <Star size={14} className="text-secondary" fill="currentColor" />
                  )}
                </div>

                {/* Name + Price */}
                <h3 className="mb-1 text-xl font-bold text-white">{tier.name}</h3>
                <div className="mb-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-foreground">{tier.price}</span>
                  {tier.period !== 'custom' && (
                    <span className="mb-1 text-sm text-slate-500">{tier.period}</span>
                  )}
                </div>
                <p className="mb-5 text-sm text-slate-400">{tier.description}</p>

                {/* CTA */}
                {tier.id === 'production' && signToken ? (
                  <Link
                    href={`/p/${proposalToken}/sign?st=${signToken}`}
                    className={cn(
                      'mb-6 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-all',
                      'bg-accent text-white shadow-[0_0_20px_rgba(105,106,172,0.3)] hover:bg-secondary'
                    )}
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <button
                    className={cn(
                      'mb-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-all',
                      tier.highlight
                        ? 'bg-accent text-white shadow-[0_0_20px_rgba(105,106,172,0.3)] hover:bg-secondary'
                        : 'border border-[rgba(105,106,172,0.2)] bg-transparent text-slate-200 hover:border-accent/40 hover:text-white'
                    )}
                  >
                    {tier.cta}
                  </button>
                )}

                {/* Features */}
                <ul className="space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <Check
                        size={14}
                        className={cn(
                          'mt-0.5 shrink-0',
                          tier.highlight ? 'text-secondary' : 'text-emerald-400'
                        )}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Payment schedule */}
        <div className="rounded-2xl border border-[rgba(105,106,172,0.12)] bg-[rgba(10,10,15,0.4)] p-6">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-secondary">
            Payment Schedule
          </h4>
          <div className="grid gap-3 sm:grid-cols-3">
            {content.paymentSchedule.map((item, i) => (
              <div
                key={item.milestone}
                className="flex items-center gap-3 rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(2,2,2,0.4)] p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-tertiary">
                  {i + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{item.amount}</div>
                  <div className="text-xs text-slate-500">{item.milestone}</div>
                  <div className="text-xs text-slate-600">{item.timing}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
