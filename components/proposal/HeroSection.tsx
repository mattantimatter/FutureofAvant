'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Download, Play } from 'lucide-react'
import { StaggeredText } from '@/components/reactbits/StaggeredText'

interface HeroSectionProps {
  content: {
    title: string
    subtitle: string
    description: string
    badges: string[]
    stats: Array<{ label: string; value: string }>
    ctas: Array<{ label: string; href: string; primary: boolean }>
    videoUrl?: string
  }
  proposalToken: string
  signToken?: string
  sourcePdfDownloadUrl?: string | null
}

function isIframe(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be') ||
    url.includes('loom.com') || url.includes('vimeo.com')
}

export function HeroSection({ content, proposalToken, signToken, sourcePdfDownloadUrl }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 40 })
  const [isHovered, setIsHovered] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
  }

  const handlePlayClick = () => {
    if (videoRef.current) { videoRef.current.play(); setVideoPlaying(true) }
  }

  const hasVideo = !!content.videoUrl
  // Always go to the sign page — with token it's a personal link, without it's a guest flow
  const signHref = signToken
    ? `/p/${proposalToken}/sign?st=${signToken}`
    : `/p/${proposalToken}/sign`

  return (
    <section
      id="section-hero"
      ref={heroRef}
      className="section-anchor relative overflow-hidden"
      style={{ minHeight: '100vh' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient backgrounds */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(62,63,126,0.22) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 animate-aurora-1" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(105,106,172,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity: isHovered ? 1 : 0, background: `radial-gradient(ellipse 55% 45% at ${mousePos.x}% ${mousePos.y}%, rgba(105,106,172,0.14) 0%, transparent 70%)` }}
        aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'linear-gradient(rgba(246,246,253,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(246,246,253,0.6) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
        aria-hidden="true" />

      {/* ── TOP: Logo + Headline — 40% down from viewport top ─────── */}
      {/* pt = ~40vh minus half the content block height (~65px) = center lands at 40% */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center" style={{ paddingTop: 'calc(38vh - 65px)' }}>

        {/* Logo lockup */}
        <div className="mb-5 flex items-center justify-center gap-5">
          <img src="/avant-logo.svg" alt="Avant"
            style={{ height: 26, width: 'auto', mixBlendMode: 'screen' }} loading="eager" />
          <span className="text-lg font-light text-white/25">×</span>
          <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-sm">
            <Image src="/antimatter-logo.png" alt="Antimatter AI" width={130} height={24}
              className="h-5 w-auto object-contain brightness-[2] invert" priority />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
          <StaggeredText text={content.title} className="block" />
          <span className="text-gradient mt-2 block">
            <StaggeredText text={content.subtitle} delay={180} />
          </span>
        </h1>
      </div>

      {/* ── VIDEO: Sits below the headline, partially visible at fold ─ */}
      <div className="relative z-10 px-6 pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-white/[0.10]"
            style={{ boxShadow: '0 20px 80px rgba(0,0,0,0.7), 0 0 60px rgba(105,106,172,0.12)', aspectRatio: '16/9' }}
          >
            {hasVideo && isIframe(content.videoUrl!) ? (
              <iframe src={content.videoUrl} className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen title="Avant Pathfinder × ATOM — Introduction" />
            ) : hasVideo ? (
              <div className="relative h-full w-full bg-black">
                <video ref={videoRef} src={content.videoUrl} className="h-full w-full object-cover"
                  controls={videoPlaying} playsInline preload="metadata"
                  onPlay={() => setVideoPlaying(true)} onEnded={() => setVideoPlaying(false)} />
                {!videoPlaying && (
                  <button onClick={handlePlayClick} aria-label="Play video"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-[2px] transition-all hover:bg-black/30">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 hover:border-white/70">
                      <Play size={32} className="translate-x-1 text-white" fill="white" />
                    </div>
                    <span className="text-sm font-medium text-white/80">Play Overview</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-white/[0.03]">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                  <Play size={32} className="translate-x-1 text-white/30" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white/60">Hype Video Coming</p>
                  <p className="mt-1.5 text-xs text-white/30">
                    Set <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-accent/70">videoUrl</code> in seed.ts
                  </p>
                </div>
              </div>
            )}
            {/* Bottom gradient fade — "peek" effect */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
              style={{ background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)' }}
              aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── BELOW THE FOLD: Description, badges, CTAs, stats ─────── */}
      <div className="relative z-10 mx-auto max-w-main px-6 pb-20 text-center">
        <p className="mx-auto mb-7 mt-4 max-w-2xl text-base font-light leading-relaxed text-white/75 md:text-lg">
          {content.description}
        </p>
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {content.badges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
              {badge}
            </span>
          ))}
        </div>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <Link href={signHref}
            className="group inline-flex items-center justify-center gap-3 rounded-[40px] py-4 pl-8 pr-4 text-base font-semibold text-white shadow-lg transition-all duration-300 btn-primary">
            <span>Sign Now</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
              <ArrowRight size={16} />
            </span>
          </Link>
          {sourcePdfDownloadUrl ? (
            <a href={sourcePdfDownloadUrl} download="avant-pathfinder-atom-proposal.pdf"
              target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-[40px] border border-white/20 bg-white/[0.06] py-4 pl-8 pr-4 text-base font-semibold text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-white/35 hover:bg-white/[0.10] hover:text-white">
              <span>Download PDF</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">
                <Download size={15} />
              </span>
            </a>
          ) : (
            <button onClick={() => window.print()}
              className="group inline-flex items-center justify-center gap-3 rounded-[40px] border border-white/20 bg-white/[0.06] py-4 pl-8 pr-4 text-base font-semibold text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-white/35 hover:bg-white/[0.10] hover:text-white">
              <span>Download PDF</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">
                <Download size={15} />
              </span>
            </button>
          )}
        </div>
        <div className="mx-auto mb-10 grid max-w-lg grid-cols-2 gap-3 md:grid-cols-4">
          {content.stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm transition-all hover:border-white/18 hover:bg-white/[0.08]">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-xs font-light text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 text-white/25">
          <span className="text-xs uppercase tracking-[0.2em]">Scroll to explore</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/15 p-1">
            <div className="h-1.5 w-1 animate-bounce rounded-full bg-accent/70" />
          </div>
        </div>
      </div>
    </section>
  )
}
