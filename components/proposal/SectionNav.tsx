'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProposalSection } from '@/lib/seed'

interface SectionNavProps {
  sections: ProposalSection[]
  className?: string
}

export function SectionNav({ sections, className }: SectionNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '')
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`)
      if (!el) return
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(s.id) },
        { threshold: 0.25, rootMargin: '-10% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [sections])

  const scrollTo = (id: string) =>
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav className={cn('flex flex-col gap-0.5', className)}>
      {/* Progress */}
      <div className="mb-5 px-2">
        <div className="mb-1.5 flex justify-between text-xs text-foreground/30">
          <span className="uppercase tracking-wider">Progress</span>
          <span>{Math.round(scrollPct)}%</span>
        </div>
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${scrollPct}%` }}
          />
        </div>
      </div>

      {sections.map((s) => {
        const isActive = active === s.id
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150',
              isActive
                ? 'bg-foreground/[0.05] text-foreground'
                : 'text-foreground/40 hover:bg-foreground/[0.03] hover:text-foreground/70'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-150',
                isActive ? 'bg-accent scale-125' : 'bg-foreground/15'
              )}
            />
            <span className="truncate font-medium">{s.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
