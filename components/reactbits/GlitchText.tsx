'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
  glitchChars?: string
  interval?: number
}

export function GlitchText({
  text,
  className,
  glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&',
  interval = 3000,
}: GlitchTextProps) {
  const [displayed, setDisplayed] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const trigger = setInterval(() => {
      setIsGlitching(true)
      let iterations = 0
      const glitch = setInterval(() => {
        setDisplayed(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' '
              if (i < iterations) return text[i]
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            })
            .join('')
        )
        iterations += 1
        if (iterations > text.length) {
          clearInterval(glitch)
          setDisplayed(text)
          setIsGlitching(false)
        }
      }, 40)
    }, interval)

    return () => clearInterval(trigger)
  }, [text, glitchChars, interval])

  return (
    <span
      className={cn(
        'font-mono transition-all',
        isGlitching && 'text-tertiary',
        className
      )}
    >
      {displayed}
    </span>
  )
}
