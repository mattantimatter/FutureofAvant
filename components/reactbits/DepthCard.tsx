'use client'

import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface DepthCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  intensity?: number
}

export function DepthCard({
  children,
  className,
  glowColor = 'rgba(105,106,172,0.25)',
  intensity = 8,
}: DepthCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotX = (y - 0.5) * -intensity
    const rotY = (x - 0.5) * intensity
    setTransform(`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01,1.01,1.01)`)
    setGlowPos({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)')
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03] transition-shadow duration-300 hover:border-foreground/[0.18]',
        className
      )}
      style={{ transform, transition: 'transform 0.15s ease, box-shadow 0.3s ease, border-color 0.2s ease' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor} 0%, transparent 60%)`,
          opacity: 0.5,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
