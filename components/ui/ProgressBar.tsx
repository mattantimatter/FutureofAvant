import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
  color?: 'accent' | 'green' | 'amber'
}

const colorMap = {
  accent: 'from-primary to-secondary',
  green: 'from-green-600 to-green-400',
  amber: 'from-yellow-600 to-yellow-400',
}

export function ProgressBar({ value, max = 100, className, showLabel, size = 'md', color = 'accent' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-foreground/30">
          <span>Progress</span><span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-foreground/[0.06]', size === 'sm' ? 'h-0.5' : 'h-1.5')}>
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out', colorMap[color])}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
