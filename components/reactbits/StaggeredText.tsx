'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StaggeredTextProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export function StaggeredText({
  text,
  className,
  delay = 0,
  staggerDelay = 40,
}: StaggeredTextProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <span
      ref={ref}
      className={cn('inline', className)}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: i < words.length - 1 ? '0.25em' : 0 }}
        >
          <span
            className="inline-block transition-all duration-500 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(100%)',
              transitionDelay: `${delay + i * staggerDelay}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  )
}
