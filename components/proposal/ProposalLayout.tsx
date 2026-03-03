'use client'

import React, { useState, useEffect } from 'react'
import { SectionNav } from './SectionNav'
import { AskAtomRail } from './AskAtomRail'
import { HeroSection } from './HeroSection'
import { ExecutiveSummary } from './ExecutiveSummary'
import { ATOMFramework } from './ATOMFramework'
import { DeploymentSecurity } from './DeploymentSecurity'
import { AvantUseCases } from './AvantUseCases'
import { RolloutPlan } from './RolloutPlan'
import { PricingSection } from './PricingSection'
import { LegalTerms } from './LegalTerms'
import { NextSteps } from './NextSteps'
import { CapabilityMatrix } from './CapabilityMatrix'
import type { ProposalJSON, ProposalSection } from '@/lib/seed'
import type { Proposal } from '@/lib/supabase/types'
import Link from 'next/link'
import { PenLine, Download, Share2, Menu, X, Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface ProposalLayoutProps {
  proposal: Proposal
  proposalJson: ProposalJSON
  signToken?: string
  sourcePdfDownloadUrl?: string | null
}

function renderSection(section: ProposalSection, proposalToken: string, signToken?: string, pdfUrl?: string | null) {
  switch (section.id) {
    case 'hero':
      return <HeroSection content={section.content as Parameters<typeof HeroSection>[0]['content']} proposalToken={proposalToken} signToken={signToken} sourcePdfDownloadUrl={pdfUrl} />
    case 'executive-summary':
      return <ExecutiveSummary content={section.content as Parameters<typeof ExecutiveSummary>[0]['content']} />
    case 'atom-framework':
      return <ATOMFramework content={section.content as Parameters<typeof ATOMFramework>[0]['content']} />
    case 'deployment-security':
      return <DeploymentSecurity content={section.content as Parameters<typeof DeploymentSecurity>[0]['content']} />
    case 'avant-use-cases':
      return <AvantUseCases content={section.content as Parameters<typeof AvantUseCases>[0]['content']} />
    case 'rollout-plan':
      return <RolloutPlan content={section.content as Parameters<typeof RolloutPlan>[0]['content']} />
    case 'pricing':
      return <PricingSection content={section.content as Parameters<typeof PricingSection>[0]['content']} proposalToken={proposalToken} signToken={signToken} />
    case 'legal':
      return <LegalTerms content={section.content as Parameters<typeof LegalTerms>[0]['content']} />
    case 'next-steps':
      return <NextSteps content={section.content as Parameters<typeof NextSteps>[0]['content']} proposalToken={proposalToken} signToken={signToken} />
    default:
      return null
  }
}

const statusVariant: Record<string, 'green' | 'amber' | 'accent'> = {
  signed: 'green', sent: 'amber', draft: 'accent',
}
const statusLabel: Record<string, string> = {
  signed: 'Signed',
  sent: 'For Review',
  draft: 'Draft',
}

const MOBILE_GATE_KEY = 'avant-atom-mobile-gate-dismissed'
const MOBILE_BREAKPOINT_PX = 768

export function ProposalLayout({ proposal, proposalJson, signToken, sourcePdfDownloadUrl }: ProposalLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [mobileGateDismissed, setMobileGateDismissed] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`)
    const check = () => setIsMobile(mql.matches)
    check()
    mql.addEventListener('change', check)
    return () => mql.removeEventListener('change', check)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setMobileGateDismissed(sessionStorage.getItem(MOBILE_GATE_KEY) === '1')
  }, [])

  const dismissMobileGate = () => {
    setMobileGateDismissed(true)
    if (typeof window !== 'undefined') sessionStorage.setItem(MOBILE_GATE_KEY, '1')
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: proposal.title, url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const showMobileGate = isMobile === true && !mobileGateDismissed

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile "view on desktop" gate — only on small viewports until dismissed */}
      {showMobileGate && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/98 px-6 py-8 text-center backdrop-blur-sm md:hidden">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.06] mb-6">
            <Monitor className="h-7 w-7 text-foreground/60" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">For best experience, view on desktop</h2>
          <p className="text-sm text-foreground/60 max-w-xs mb-8">
            This proposal is designed for a larger screen. You can continue on mobile if you prefer.
          </p>
          <button
            onClick={dismissMobileGate}
            className="inline-flex items-center gap-2 rounded-[40px] border border-accent/30 bg-accent/10 px-6 py-3 text-sm font-medium text-secondary transition-all hover:bg-accent/20 hover:border-accent/50"
          >
            <Smartphone size={16} />
            Continue to mobile view
          </button>
        </div>
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/[0.06] bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-1.5 text-foreground/40 hover:text-foreground md:hidden"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">{proposal.title}</h1>
              <p className="text-xs text-foreground/40">{proposal.client_name}</p>
            </div>
            <Badge variant={statusVariant[proposal.status] ?? 'accent'} size="sm" className="hidden sm:inline-flex">
              {statusLabel[proposal.status] ?? proposal.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="hidden items-center gap-1.5 rounded-lg border border-foreground/10 px-3 py-1.5 text-xs text-foreground/50 transition-all hover:border-foreground/20 hover:text-foreground sm:flex"
            >
              <Share2 size={11} />Share
            </button>
            <Link
              href={signToken ? `/p/${proposal.public_token}/sign?st=${signToken}` : `/p/${proposal.public_token}/sign`}
              className="flex items-center gap-1.5 rounded-[40px] px-4 py-1.5 text-xs font-semibold text-foreground btn-primary"
            >
              <PenLine size={12} />Sign Now
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1800px]">
        {/* Left sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-56 shrink-0 overflow-y-auto border-r border-foreground/[0.06] py-6 md:block">
          <SectionNav sections={proposalJson.sections} className="px-3" />
        </aside>

        {/* Mobile nav */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <div className="absolute left-0 top-16 h-[calc(100vh-64px)] w-64 overflow-y-auto border-r border-foreground/[0.08] bg-background/98 py-6 backdrop-blur-xl">
              <SectionNav sections={proposalJson.sections} className="px-3" />
            </div>
          </div>
        )}

        {/* Main */}
        <main className="min-w-0 flex-1">
          {proposalJson.sections.map((section, i) => (
            <React.Fragment key={section.id}>
              {i > 0 && <div className="section-divider" />}
              {renderSection(section, proposal.public_token, signToken, sourcePdfDownloadUrl)}
            </React.Fragment>
          ))}
          <div className="section-divider" />
          <CapabilityMatrix />
          <footer className="border-t border-foreground/[0.06] px-6 py-10 text-center text-xs text-foreground/25">
            <p className="mb-1">
              Prepared by <span className="text-secondary">Antimatter AI</span> for{' '}
              <span className="text-foreground/50">{proposal.client_name}</span>
            </p>
            <p>Valid until {proposalJson.meta.validUntil} · Version {proposalJson.version} · antimatterai.com</p>
          </footer>
        </main>

        {/* Right rail */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-72 shrink-0 overflow-y-auto p-4 xl:block">
          <AskAtomRail proposalToken={proposal.public_token} />
        </aside>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-foreground/[0.08] bg-background/96 px-4 py-3 backdrop-blur-xl md:hidden">
        <Link
          href={signToken ? `/p/${proposal.public_token}/sign?st=${signToken}` : `/p/${proposal.public_token}/sign`}
          className="flex items-center gap-1.5 rounded-[40px] px-5 py-2 text-sm font-semibold text-foreground btn-primary"
        >
          <PenLine size={14} />Sign Now
        </Link>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-xl border border-foreground/10 px-4 py-2 text-sm text-foreground/60">
          <Download size={13} />PDF
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 rounded-xl border border-foreground/10 px-4 py-2 text-sm text-foreground/60">
          <Share2 size={13} />Share
        </button>
      </div>
    </div>
  )
}
