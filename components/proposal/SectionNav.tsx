'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProposalSection } from '@/lib/seed'

interface SectionNavProps {
  sections: ProposalSection[]
  className?: string
}

export function SectionNav({ sections, className }: SectionNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '')
  const [scrollPct, setScrollPct] = useState(0)
  const navRef = useRef<HTMLElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement | null>(null)

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy using position-based detection (more reliable than IntersectionObserver alone)
  useEffect(() => {
    const getSectionOffsets = () =>
      sections.map((s) => ({
        id: s.id,
        top: document.getElementById(`section-${s.id}`)?.getBoundingClientRect().top ?? Infinity,
      }))

    const onScroll = () => {
      const offsets = getSectionOffsets()
      const viewportMid = window.innerHeight * 0.35
      // Find the last section whose top is above 35% from the top of the viewport
      const visible = offsets.filter((o) => o.top <= viewportMid)
      if (visible.length > 0) {
        setActive(visible[visible.length - 1].id)
      } else if (offsets.length > 0) {
        setActive(offsets[0].id)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // run immediately
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections])

  // Auto-scroll nav so active item is visible
  useEffect(() => {
    activeButtonRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [active])

  const scrollTo = (id: string) => {
    const el = document.getElementById(`section-${id}`)
    if (!el) return
    const offset = 72 // header height
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav ref={navRef} className={cn('flex flex-col gap-0.5', className)}>
      {/* Progress bar */}
      <div className="mb-5 px-2">
        <div className="mb-1.5 flex justify-between text-xs text-foreground/25">
          <span className="uppercase tracking-wider">Progress</span>
          <span>{Math.round(scrollPct)}%</span>
        </div>
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${scrollPct}%` }}
          />
        </div>
      </div>

      {/* Section list */}
      <div className="max-h-[calc(100vh-160px)] overflow-y-auto pr-1 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              ref={isActive ? activeButtonRef : null}
              onClick={() => scrollTo(s.id)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150',
                isActive
                  ? 'bg-foreground/[0.06] text-foreground'
                  : 'text-foreground/35 hover:bg-foreground/[0.03] hover:text-foreground/65'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200',
                  isActive ? 'bg-accent scale-110' : 'bg-foreground/12'
                )}
              />
              <span className="truncate font-medium leading-tight">{s.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
