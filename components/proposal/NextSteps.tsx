'use client'

import React from 'react'
import Link from 'next/link'
import { ProposalIcon } from './ProposalIcon'
import { Mail, Calendar, Clock } from 'lucide-react'
import { AuroraBlur } from '@/components/reactbits/AuroraBlur'
import { cn } from '@/lib/utils'

interface Action {
  title: string
  description: string
  icon: string
  cta: string
  href: string
  primary: boolean
}

interface Contact {
  name: string
  role: string
  email: string
}

interface NextStepsProps {
  content: {
    title: string
    subtitle: string
    description: string
    actions: Action[]
    contacts: Contact[]
    validUntil: string
    urgencyItems?: string[]
  }
  proposalToken: string
  signToken?: string
}

export function NextSteps({ content, proposalToken, signToken }: NextStepsProps) {
  return (
    <section id="section-next-steps" className="section-anchor proposal-section relative overflow-hidden">
      <AuroraBlur intensity="low" className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            Next Steps
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">{content.subtitle}</p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">{content.description}</p>
        </div>

        {/* Action cards */}
        <div className="mb-12 grid gap-5 md:grid-cols-3">
          {content.actions.map((action) => (
            <div
              key={action.title}
              className={cn(
                'relative overflow-hidden rounded-2xl border p-6 transition-all duration-300',
                action.primary
                  ? 'border-accent/40 bg-gradient-to-b from-accent/10 to-[rgba(10,10,15,0.8)] hover:shadow-[0_0_30px_rgba(105,106,172,0.2)]'
                  : 'border-[rgba(105,106,172,0.12)] bg-[rgba(10,10,15,0.5)] hover:border-[rgba(105,106,172,0.25)]'
              )}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(105,106,172,0.12)' }}
              >
                <ProposalIcon name={action.icon} size={20} className="text-tertiary" />
              </div>
              <h3 className="mb-2 font-bold text-white">{action.title}</h3>
              <p className="mb-5 text-sm text-slate-400">{action.description}</p>

              {action.href === '#sign' && signToken ? (
                <Link
                  href={`/p/${proposalToken}/sign?st=${signToken}`}
                  className={cn(
                    'inline-flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-all',
                    action.primary
                      ? 'bg-accent text-white hover:bg-secondary shadow-[0_0_20px_rgba(105,106,172,0.3)]'
                      : 'border border-[rgba(105,106,172,0.2)] text-slate-200 hover:border-accent/40 hover:text-white'
                  )}
                >
                  {action.cta}
                </Link>
              ) : (
                <a
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'inline-flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-all',
                    action.primary
                      ? 'bg-accent text-white hover:bg-secondary shadow-[0_0_20px_rgba(105,106,172,0.3)]'
                      : 'border border-[rgba(105,106,172,0.2)] text-slate-200 hover:border-accent/40 hover:text-white'
                  )}
                >
                  {action.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Urgency items */}
        {content.urgencyItems && content.urgencyItems.length > 0 && (
          <div className="mb-10 rounded-2xl border border-accent/15 bg-accent/[0.04] p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/40">Why Act Now</p>
            <ul className="space-y-2">
              {content.urgencyItems.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-light text-foreground/55">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Valid until notice */}
        <div className="mb-10 flex items-center justify-center gap-2 text-sm text-foreground/35">
          <Clock size={14} />
          <span>This proposal is valid until <strong className="text-slate-400">{content.validUntil}</strong></span>
        </div>

        {/* Contacts */}
        <div className="rounded-2xl border border-[rgba(105,106,172,0.12)] bg-[rgba(10,10,15,0.4)] p-6">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-secondary">
            Your Contacts
          </h4>
          <div className="flex flex-wrap gap-4">
            {content.contacts.map((contact) => (
              <div
                key={contact.email}
                className="flex items-center gap-3 rounded-xl border border-[rgba(105,106,172,0.1)] bg-[rgba(2,2,2,0.4)] px-4 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-tertiary">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{contact.name}</div>
                  <div className="text-xs text-slate-500">{contact.role}</div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-1 text-xs text-secondary hover:text-tertiary"
                  >
                    <Mail size={10} />
                    {contact.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
