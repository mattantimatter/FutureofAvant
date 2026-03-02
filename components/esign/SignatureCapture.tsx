'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Trash2, Type, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SignatureCaptureProps {
  label?: string
  onChange: (data: { type: 'typed' | 'drawn'; text?: string; dataURL?: string } | null) => void
  value?: { type: 'typed' | 'drawn'; text?: string; dataURL?: string } | null
  signerName?: string
  isInitials?: boolean
}

const SIGNATURE_FONTS = [
  { name: 'Elegant', style: { fontFamily: 'Dancing Script, cursive', fontSize: '2rem' } },
  { name: 'Classic', style: { fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem' } },
  { name: 'Modern', style: { fontFamily: 'Inter, sans-serif', fontWeight: 'bold', fontSize: '1.5rem' } },
]

export function SignatureCapture({
  label = 'Signature',
  onChange,
  value,
  signerName = '',
  isInitials = false,
}: SignatureCaptureProps) {
  const [activeTab, setActiveTab] = useState<'typed' | 'drawn'>('typed')
  const [typedText, setTypedText] = useState(isInitials ? getInitials(signerName) : signerName)
  const [selectedFont, setSelectedFont] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Notify parent when typed tab changes
  useEffect(() => {
    if (activeTab === 'typed' && typedText.trim()) {
      onChange({ type: 'typed', text: typedText })
    } else if (activeTab === 'typed' && !typedText.trim()) {
      onChange(null)
    }
  }, [typedText, selectedFont, activeTab])

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    setIsDrawing(true)
    setHasDrawn(true)
    lastPos.current = getCanvasPos(e, canvas)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pos = getCanvasPos(e, canvas)
    if (lastPos.current) {
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }
    lastPos.current = pos
    onChange({ type: 'drawn', dataURL: canvas.toDataURL('image/png') })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    lastPos.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    onChange(null)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-300">{label}</label>

      <Tabs
        tabs={[
          { id: 'typed', label: 'Type', icon: <Type size={14} /> },
          { id: 'drawn', label: 'Draw', icon: <PenLine size={14} /> },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as 'typed' | 'drawn')}
        variant="pills"
      />

      {activeTab === 'typed' && (
        <div className="space-y-3">
          <input
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder={isInitials ? 'Your initials' : 'Type your full name'}
            className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-accent/50"
          />
          {/* Font selection */}
          <div className="flex gap-2">
            {SIGNATURE_FONTS.map((font, i) => (
              <button
                key={font.name}
                onClick={() => setSelectedFont(i)}
                className={cn(
                  'flex-1 rounded-lg border py-1.5 text-xs transition-all',
                  selectedFont === i
                    ? 'border-accent/50 bg-accent/15 text-white'
                    : 'border-[rgba(105,106,172,0.1)] text-slate-400 hover:text-slate-300'
                )}
              >
                {font.name}
              </button>
            ))}
          </div>
          {/* Preview */}
          <div className="flex min-h-[80px] items-center justify-center rounded-xl border border-[rgba(105,106,172,0.15)] bg-[rgba(2,2,2,0.4)] px-6 py-4">
            {typedText ? (
              <span
                className="text-white"
                style={SIGNATURE_FONTS[selectedFont].style}
              >
                {typedText}
              </span>
            ) : (
              <span className="text-sm text-slate-600">
                {isInitials ? 'Initials preview' : 'Signature preview'}
              </span>
            )}
          </div>
        </div>
      )}

      {activeTab === 'drawn' && (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)]">
            <canvas
              ref={canvasRef}
              width={600}
              height={isInitials ? 100 : 150}
              className="w-full cursor-crosshair touch-none"
              style={{ height: isInitials ? '100px' : '150px' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasDrawn && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-600">
                Draw your {isInitials ? 'initials' : 'signature'} here
              </div>
            )}
          </div>
          {hasDrawn && (
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  )
}
