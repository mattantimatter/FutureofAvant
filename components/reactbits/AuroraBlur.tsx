'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AuroraBlurProps {
  className?: string
  children?: React.ReactNode
  intensity?: 'low' | 'medium' | 'high'
}

export function AuroraBlur({ className, children, intensity = 'medium' }: AuroraBlurProps) {
  const opacityMap = { low: 'opacity-20', medium: 'opacity-40', high: 'opacity-60' }
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn('pointer-events-none absolute inset-0', opacityMap[intensity])}
        aria-hidden="true"
      >
        {/* Primary accent bloom */}
        <div
          className="animate-aurora-1 absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(105,106,172,0.55) 0%, rgba(62,63,126,0.2) 45%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        {/* Secondary deeper purple */}
        <div
          className="animate-aurora-2 absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(62,63,126,0.45) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Tertiary light accent */}
        <div
          className="animate-aurora-3 absolute bottom-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(133,135,227,0.30) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>
      {children}
    </div>
  )
}
