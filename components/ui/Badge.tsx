import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'accent' | 'secondary' | 'green' | 'amber' | 'red' | 'muted' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

const variantStyles = {
  accent: 'bg-[rgba(105,106,172,0.15)] text-secondary border border-[rgba(105,106,172,0.25)]',
  secondary: 'bg-[rgba(162,163,233,0.10)] text-tertiary border border-[rgba(162,163,233,0.20)]',
  green: 'bg-green-500/10 text-green-400 border border-green-500/20',
  amber: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  red: 'bg-red-500/10 text-red-400 border border-red-500/20',
  muted: 'bg-foreground/5 text-foreground/50 border border-foreground/10',
  outline: 'bg-transparent text-secondary border border-[rgba(105,106,172,0.30)]',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-lg',
}

export function Badge({ children, variant = 'accent', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium tracking-wide',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  )
}
