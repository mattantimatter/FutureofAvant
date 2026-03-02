'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab?: string
  onTabChange?: (id: string) => void
  className?: string
  variant?: 'pills' | 'underline'
}

export function Tabs({ tabs, activeTab, onTabChange, className, variant = 'pills' }: TabsProps) {
  const [internal, setInternal] = useState(tabs[0]?.id)
  const current = activeTab ?? internal

  const handleClick = (id: string) => {
    if (!activeTab) setInternal(id)
    onTabChange?.(id)
  }

  if (variant === 'underline') {
    return (
      <div className={cn('border-b border-foreground/[0.08]', className)}>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200',
                current === tab.id
                  ? 'border-accent text-foreground'
                  : 'border-transparent text-foreground/40 hover:text-foreground/70'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-1 overflow-x-auto rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-1',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={cn(
            'flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
            current === tab.id
              ? 'bg-accent-soft text-foreground shadow-accent-glow bg-[rgba(105,106,172,0.15)] text-secondary'
              : 'text-foreground/40 hover:bg-foreground/5 hover:text-foreground/70'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
