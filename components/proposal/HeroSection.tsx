'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { AuroraBlur } from '@/components/reactbits/AuroraBlur'
import { StaggeredText } from '@/components/reactbits/StaggeredText'
import { GradientBlob } from '@/components/reactbits/GradientBlob'

interface HeroSectionProps {
  content: {
    title: string
    subtitle: string
    description: string
    badges: string[]
    stats: Array<{ label: string; value: string }>
    ctas: Array<{ label: string; href: string; primary: boolean }>
  }
  proposalToken: string
  signToken?: string
}

export function HeroSection({ content, proposalToken, signToken }: HeroSectionProps) {
  return (
    <section id="section-hero" className="section-anchor relative min-h-screen overflow-hidden">
      <AuroraBlur intensity="high" className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <GradientBlob size="xl" color="primary" className="absolute -right-40 -top-40 opacity-20" />
        <GradientBlob size="lg" color="accent" className="absolute -bottom-20 left-1/4 opacity-15" />
        {/* Subtle gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-main px-6 py-32 text-center">
        {/* Lockup */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-2 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-tertiary">Avant</span>
          </div>
          <span className="text-foreground/20">×</span>
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-2 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Antimatter AI</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-8xl">
          <StaggeredText text={content.title} className="block" />
          <span className="text-gradient mt-2 block font-bold">
            <StaggeredText text={content.subtitle} delay={150} />
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 mt-6 max-w-2xl text-base font-light leading-relaxed text-foreground/50 md:text-lg">
          {content.description}
        </p>

        {/* Badges */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {content.badges.map((badge) => (
            <span key={badge} className="tag-pill">{badge}</span>
          ))}
        </div>

        {/* CTAs — Antimatter pill button pattern */}
        <div className="mb-20 flex flex-wrap items-center justify-center gap-4">
          {signToken ? (
            <Link
              href={`/p/${proposalToken}/sign?st=${signToken}`}
              className="group inline-flex items-center justify-center gap-3 rounded-[40px] py-3 pl-6 pr-3 font-medium text-foreground shadow-lg transition-all duration-300 btn-primary"
            >
              <span>Review &amp; Sign</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110">
                <ArrowRight size={15} />
              </span>
            </Link>
          ) : (
            <button className="group inline-flex items-center justify-center gap-3 rounded-[40px] py-3 pl-6 pr-3 font-medium text-foreground btn-primary opacity-60">
              <span>Review &amp; Sign</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
                <ArrowRight size={15} />
              </span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center justify-center gap-3 rounded-[40px] border border-secondary/40 py-3 pl-6 pr-3 font-medium text-secondary transition-all duration-300 hover:border-secondary hover:bg-foreground/[0.03]"
          >
            <span>Download PDF</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 transition-transform duration-300 group-hover:scale-110">
              <Download size={14} />
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 md:grid-cols-4">
          {content.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] p-4 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="mt-1 text-xs font-light text-foreground/40">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-foreground/25">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-foreground/20 p-1">
            <div className="h-1.5 w-1 animate-bounce rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}
