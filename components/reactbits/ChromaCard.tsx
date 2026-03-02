'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ChromaCardProps {
  children: React.ReactNode
  className?: string
  accent?: 'accent' | 'primary' | 'green' | 'amber'
  glow?: boolean
}

const accentMap = {
  accent: {
    border: 'border-[rgba(105,106,172,0.20)]',
    bg: 'from-[rgba(105,106,172,0.08)]',
    glow: 'hover:shadow-[0_0_25px_rgba(105,106,172,0.12)]',
  },
  primary: {
    border: 'border-[rgba(62,63,126,0.25)]',
    bg: 'from-[rgba(62,63,126,0.08)]',
    glow: 'hover:shadow-[0_0_25px_rgba(62,63,126,0.12)]',
  },
  green: {
    border: 'border-emerald-500/20',
    bg: 'from-emerald-500/[0.07]',
    glow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.10)]',
  },
  amber: {
    border: 'border-yellow-500/20',
    bg: 'from-yellow-500/[0.07]',
    glow: 'hover:shadow-[0_0_25px_rgba(234,179,8,0.10)]',
  },
}

export function ChromaCard({ children, className, accent = 'accent', glow = true }: ChromaCardProps) {
  const a = accentMap[accent]
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent transition-all duration-300',
        a.border, a.bg,
        glow && a.glow,
        className
      )}
    >
      {children}
    </div>
  )
}
