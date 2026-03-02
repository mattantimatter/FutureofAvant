'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BlobProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'accent' | 'primary' | 'secondary'
  animate?: boolean
}

const sizeMap = { sm: 'h-48 w-48', md: 'h-72 w-72', lg: 'h-96 w-96', xl: 'h-[600px] w-[600px]' }
const colorMap = {
  accent: 'rgba(105,106,172,0.45)',
  primary: 'rgba(62,63,126,0.45)',
  secondary: 'rgba(133,135,227,0.35)',
}

export function GradientBlob({ className, size = 'lg', color = 'accent', animate = true }: BlobProps) {
  return (
    <div
      className={cn('rounded-full', sizeMap[size], animate && 'animate-aurora-1', className)}
      style={{
        background: `radial-gradient(ellipse, ${colorMap[color]} 0%, transparent 70%)`,
        filter: 'blur(70px)',
      }}
      aria-hidden="true"
    />
  )
}
