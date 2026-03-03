'use client'

import React from 'react'
import Link from 'next/link'
import { ProposalIcon } from './ProposalIcon'
import { Mail, Clock } from 'lucide-react'
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

  const handleActionClick = (action: Action) => {
    if (action.href === '#sign') {
      // Handled by <Link> below — no JS needed
      return
    }
    if (action.href === '#ask-atom') {
      // Scroll to and focus the Ask Atom chat rail
      const rail = document.getElementById('ask-atom-rail')
      if (rail) {
        rail.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Dispatch a custom event so the rail knows to open/focus
        rail.dispatchEvent(new CustomEvent('focus-atom', { bubbles: true }))
        // Also try to focus the input directly
        setTimeout(() => {
          const input = rail.querySelector<HTMLInputElement>('input[type="text"], textarea, input:not([type])')
          input?.focus()
        }, 400)
      }
      return
    }
  }

  const getButtonContent = (action: Action) => (
    <>
      <span>{action.cta}</span>
      <span className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110',
        action.primary ? 'bg-white/20 group-hover:bg-white/30' : 'bg-foreground/10 group-hover:bg-foreground/20'
      )}>
        <ProposalIcon name="arrow-right" size={13} />
      </span>
    </>
  )

  return (
    <section id="section-next-steps" className="section-anchor proposal-section relative overflow-hidden">
      <AuroraBlur intensity="low" className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            Next Steps
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-xl text-base font-semibold text-foreground/75">{content.subtitle}</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-light text-foreground/55">{content.description}</p>
        </div>

        {/* Action cards */}
        <div className="mb-12 grid gap-5 md:grid-cols-3">
          {content.actions.map((action) => (
            <div
              key={action.title}
              className={cn(
                'relative overflow-hidden rounded-2xl border p-6 transition-all duration-300',
                action.primary
                  ? 'border-accent/30 bg-gradient-to-b from-accent/[0.08] to-transparent hover:shadow-[0_0_30px_rgba(105,106,172,0.15)]'
                  : 'border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/[0.15]'
              )}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05]">
                <ProposalIcon name={action.icon} size={19} className="text-secondary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{action.title}</h3>
              <p className="mb-5 text-sm font-light text-foreground/70">{action.description}</p>

              {/* Route each button correctly */}
              {action.href === '#sign' ? (
                <Link
                  href={signToken ? `/p/${proposalToken}/sign?st=${signToken}` : `/p/${proposalToken}/sign`}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-[40px] py-2.5 px-5 text-sm font-medium text-foreground btn-primary transition-all"
                >
                  <span>Sign Now</span>
                  <span className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110',
                    action.primary ? 'bg-white/20 group-hover:bg-white/30' : 'bg-foreground/10 group-hover:bg-foreground/20'
                  )}>
                    <ProposalIcon name="arrow-right" size={13} />
                  </span>
                </Link>
              ) : action.href.startsWith('mailto') || action.href.startsWith('http') ? (
                <a
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'group inline-flex w-full items-center justify-center gap-2 rounded-[40px] py-2.5 px-5 text-sm font-medium transition-all',
                    action.primary
                      ? 'text-foreground btn-primary'
                      : 'border border-foreground/[0.10] text-foreground/55 hover:border-foreground/20 hover:text-foreground/80'
                  )}
                >
                  {getButtonContent(action)}
                </a>
              ) : (
                // #ask-atom and other hash actions
                <button
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    'group inline-flex w-full items-center justify-center gap-2 rounded-[40px] py-2.5 px-5 text-sm font-medium transition-all',
                    action.primary
                      ? 'text-foreground btn-primary'
                      : 'border border-foreground/[0.10] text-foreground/55 hover:border-foreground/20 hover:text-foreground/80'
                  )}
                >
                  {getButtonContent(action)}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Urgency items */}
        {content.urgencyItems && content.urgencyItems.length > 0 && (
          <div className="mb-10 rounded-2xl border border-accent/12 bg-accent/[0.04] p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/55">Why Act Now</p>
            <ul className="space-y-2">
              {content.urgencyItems.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-light text-foreground/75">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Valid until */}
        <div className="mb-10 flex items-center justify-center gap-2 text-sm text-foreground/45">
          <Clock size={13} />
          <span>Proposal valid until <strong className="text-foreground/70">{content.validUntil}</strong></span>
        </div>

        {/* Contacts */}
        <div className="rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] p-6">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground/55">Your Contacts</h4>
          <div className="flex flex-wrap gap-4">
            {content.contacts.map((contact) => (
              <div key={contact.email} className="flex items-center gap-3 rounded-xl border border-foreground/[0.07] bg-foreground/[0.02] px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-secondary">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{contact.name}</div>
                  <div className="text-xs text-foreground/55">{contact.role}</div>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs text-accent hover:text-secondary transition-colors">
                    <Mail size={10} />{contact.email}
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
