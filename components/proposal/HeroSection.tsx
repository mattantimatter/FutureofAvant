'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { StaggeredText } from '@/components/reactbits/StaggeredText'

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
  const heroRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 40 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <section
      id="section-hero"
      ref={heroRef}
      className="section-anchor relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Static ambient background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(62,63,126,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 animate-aurora-1"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(105,106,172,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Cursor-following glow — the interactive hover effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(ellipse 55% 45% at ${mousePos.x}% ${mousePos.y}%, rgba(105,106,172,0.14) 0%, rgba(62,63,126,0.06) 40%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(246,246,253,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(246,246,253,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-main px-6 py-36 text-center">
        {/* Lockup */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] px-4 py-2 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-tertiary">Avant</span>
          </div>
          <span className="text-foreground/20 text-lg">×</span>
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] px-4 py-2 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Antimatter AI</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-6xl font-bold leading-[1.03] tracking-tight text-foreground md:text-8xl lg:text-[6.5rem]">
          <StaggeredText text={content.title} className="block" />
          <span className="text-gradient mt-3 block">
            <StaggeredText text={content.subtitle} delay={180} />
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 mt-8 max-w-2xl text-base font-light leading-relaxed text-foreground/45 md:text-lg">
          {content.description}
        </p>

        {/* Badges */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          {content.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-foreground/[0.08] bg-foreground/[0.03] px-3.5 py-1.5 text-xs font-medium text-foreground/50 backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mb-24 flex flex-wrap items-center justify-center gap-4">
          {signToken ? (
            <Link
              href={`/p/${proposalToken}/sign?st=${signToken}`}
              className="group inline-flex items-center justify-center gap-3 rounded-[40px] py-3.5 pl-7 pr-4 font-medium text-foreground shadow-lg transition-all duration-300 btn-primary"
            >
              <span>Review &amp; Sign</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                <ArrowRight size={15} />
              </span>
            </Link>
          ) : (
            <button className="group inline-flex items-center justify-center gap-3 rounded-[40px] py-3.5 pl-7 pr-4 font-medium text-foreground/60 btn-primary opacity-50 cursor-not-allowed">
              <span>Review &amp; Sign</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
                <ArrowRight size={15} />
              </span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center justify-center gap-3 rounded-[40px] border border-foreground/[0.12] bg-foreground/[0.02] py-3.5 pl-7 pr-4 font-medium text-foreground/50 backdrop-blur-sm transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.05] hover:text-foreground/80"
          >
            <span>Download PDF</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 transition-all duration-300 group-hover:scale-110">
              <Download size={14} />
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 md:grid-cols-4">
          {content.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] p-4 backdrop-blur-sm transition-all duration-200 hover:border-foreground/[0.12] hover:bg-foreground/[0.04]"
            >
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="mt-1 text-xs font-light text-foreground/35">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="mt-24 flex flex-col items-center gap-2 text-foreground/20">
          <span className="text-xs uppercase tracking-[0.2em]">Scroll to explore</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-foreground/15 p-1">
            <div className="h-1.5 w-1 animate-bounce rounded-full bg-accent/60" />
          </div>
        </div>
      </div>
    </section>
  )
}
