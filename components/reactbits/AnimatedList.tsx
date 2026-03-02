'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedListProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  itemDelay?: number
}

export function AnimatedList({
  children,
  className,
  staggerDelay = 100,
  itemDelay = 0,
}: AnimatedListProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const interval = setInterval(() => {
            setVisibleCount((prev) => {
              if (prev >= children.length) {
                clearInterval(interval)
                return prev
              }
              return prev + 1
            })
          }, staggerDelay)
          observer.disconnect()
          return () => clearInterval(interval)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [children.length, staggerDelay])

  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      {children.map((child, i) => (
        <div
          key={i}
          className="transition-all duration-500 ease-out"
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: `${itemDelay + i * 20}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
