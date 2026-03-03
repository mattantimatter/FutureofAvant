'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PenLine, Type, Trash2, Save, Plus, Move, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FieldPosition {
  id: string
  type: 'signature' | 'initials'
  page: number         // 1-indexed
  x: number            // PDF points from left
  y: number            // PDF points from bottom (pdf-lib coordinate system)
  width: number
  height: number
  // Canvas display coords (for rendering only, not stored)
  canvasX?: number
  canvasY?: number
  canvasW?: number
  canvasH?: number
}

interface PDFFieldPlacerProps {
  pdfUrl: string
  signatureRequestId: string
  existingFields?: FieldPosition[]
  onSave: (fields: FieldPosition[]) => Promise<void>
}

const FIELD_COLORS = {
  signature: { bg: 'rgba(105,106,172,0.15)', border: '#696aac', label: 'Signature', icon: PenLine },
  initials: { bg: 'rgba(16,185,129,0.12)', border: '#10b981', label: 'Initials', icon: Type },
}

export function PDFFieldPlacer({ pdfUrl, signatureRequestId, existingFields = [], onSave }: PDFFieldPlacerProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<{ canvas: HTMLCanvasElement; width: number; height: number; pdfHeight: number }[]>([])
  const [fields, setFields] = useState<FieldPosition[]>(existingFields)
  const [activeType, setActiveType] = useState<'signature' | 'initials'>('signature')
  const [isDragging, setIsDragging] = useState<string | null>(null) // field id being dragged
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pageOffsetsRef = useRef<number[]>([]) // cumulative top offsets of each page in the scroll container

  // Load PDF and render all pages using pdfjs-dist
  useEffect(() => {
    let cancelled = false
    async function loadPDF() {
      try {
        setLoading(true)
        setError(null)

        // Dynamic import to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise
        const renderedPages: typeof pages = []
        const offsets: number[] = []
        let cumulativeOffset = 0

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const scale = 1.4 // good quality for field placement
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')!
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await page.render({ canvasContext: ctx as any, canvas, viewport }).promise

          offsets.push(cumulativeOffset)
          cumulativeOffset += viewport.height + 16 // 16px gap between pages

          renderedPages.push({
            canvas,
            width: viewport.width,
            height: viewport.height,
            pdfHeight: page.getViewport({ scale: 1 }).height,
          })
        }

        if (!cancelled) {
          setPages(renderedPages)
          pageOffsetsRef.current = offsets
          setLoading(false)
        }
      } catch (e) {
        console.error('[PDFFieldPlacer] Failed to load PDF:', e)
        if (!cancelled) {
          setError('Failed to render PDF. Check that the PDF URL is accessible.')
          setLoading(false)
        }
      }
    }
    loadPDF()
    return () => { cancelled = true }
  }, [pdfUrl])

  // Convert canvas click position to PDF coordinates
  const canvasToPdfCoords = useCallback((
    canvasX: number, canvasY: number, pageIndex: number
  ): { x: number; y: number } => {
    const page = pages[pageIndex]
    if (!page) return { x: 0, y: 0 }
    const scale = page.width / page.canvas.width * (page.canvas.width / page.width)
    const pdfScale = 1.4
    // Convert canvas px → PDF points (scale down from rendered size, flip Y axis)
    const pdfX = (canvasX / pdfScale)
    const pdfY = page.pdfHeight - (canvasY / pdfScale) // flip Y for pdf-lib bottom-origin
    return { x: Math.round(pdfX), y: Math.round(pdfY) }
  }, [pages])

  // Handle click on a page canvas to add a field
  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    if (isDragging) return
    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    const pdfCoords = canvasToPdfCoords(canvasX, canvasY, pageIndex)
    const fieldW = activeType === 'signature' ? 200 : 80
    const fieldH = activeType === 'signature' ? 60 : 40

    const newField: FieldPosition = {
      id: Math.random().toString(36).slice(2),
      type: activeType,
      page: pageIndex + 1,
      x: pdfCoords.x,
      y: pdfCoords.y,
      width: fieldW,
      height: fieldH,
      canvasX: canvasX - fieldW / 2,
      canvasY: canvasY - fieldH / 2,
      canvasW: fieldW,
      canvasH: fieldH,
    }
    setFields((prev) => [...prev, newField])
  }, [activeType, isDragging, canvasToPdfCoords])

  const removeField = (id: string) => setFields((p) => p.filter((f) => f.id !== id))

  const handleFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation()
    setIsDragging(fieldId)
    setDragOffset({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    if (!isDragging) return
    setFields((prev) => prev.map((f) => {
      if (f.id !== isDragging || f.page !== pageIndex + 1) return f
      const dx = e.clientX - dragOffset.x
      const dy = e.clientY - dragOffset.y
      const newCanvasX = (f.canvasX ?? 0) + dx
      const newCanvasY = (f.canvasY ?? 0) + dy
      const pdfCoords = canvasToPdfCoords(newCanvasX + (f.canvasW ?? 0) / 2, newCanvasY + (f.canvasH ?? 0) / 2, pageIndex)
      return { ...f, canvasX: newCanvasX, canvasY: newCanvasY, x: pdfCoords.x, y: pdfCoords.y }
    }))
    setDragOffset({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragOffset, canvasToPdfCoords])

  const handleMouseUp = () => setIsDragging(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(fields)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-foreground/[0.08] bg-foreground/[0.02] px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Add Field:</span>
        {(['signature', 'initials'] as const).map((type) => {
          const c = FIELD_COLORS[type]
          const Icon = c.icon
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                activeType === type
                  ? 'border-accent/50 bg-accent/10 text-secondary'
                  : 'border-foreground/[0.08] text-foreground/40 hover:border-foreground/20 hover:text-foreground/70'
              )}
            >
              <Icon size={13} />
              {c.label}
            </button>
          )
        })}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-foreground/30">{fields.length} field{fields.length !== 1 ? 's' : ''} placed</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-[40px] px-4 py-1.5 text-xs font-medium text-foreground btn-primary disabled:opacity-50"
          >
            {saving ? (
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : <Save size={12} />}
            Save Positions
          </button>
        </div>
      </div>

      {/* Instruction bar */}
      <div className="flex items-center gap-2 border-b border-foreground/[0.06] bg-foreground/[0.01] px-4 py-2 text-xs text-foreground/30">
        <Info size={11} />
        Click anywhere on the PDF to place a field. Drag fields to reposition. Click × to remove.
      </div>

      {/* PDF canvas area */}
      <div
        ref={canvasContainerRef}
        className="flex-1 overflow-y-auto bg-background p-4"
        onMouseUp={handleMouseUp}
      >
        {loading && (
          <div className="flex h-40 items-center justify-center text-sm text-foreground/40">
            <svg className="mr-2 h-4 w-4 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Rendering PDF...
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">{error}</div>
        )}
        {!loading && !error && pages.map((page, pageIndex) => (
          <div key={pageIndex} className="relative mb-4 mx-auto shadow-card" style={{ width: page.width }}>
            {/* Page number label */}
            <div className="absolute -top-5 left-0 text-xs text-foreground/25">Page {pageIndex + 1}</div>

            {/* Canvas wrapper — click to add field, drag to move */}
            <div
              className="relative cursor-crosshair overflow-hidden"
              style={{ width: page.width, height: page.height }}
              onClick={(e) => handlePageClick(e, pageIndex)}
              onMouseMove={(e) => handleMouseMove(e, pageIndex)}
            >
              {/* Rendered PDF canvas */}
              <canvas
                ref={(el) => { if (el) { el.width = page.canvas.width; el.height = page.canvas.height; el.getContext('2d')!.drawImage(page.canvas, 0, 0) } }}
                style={{ width: page.width, height: page.height, display: 'block' }}
              />

              {/* Field overlays */}
              {fields
                .filter((f) => f.page === pageIndex + 1)
                .map((field) => {
                  const c = FIELD_COLORS[field.type]
                  const Icon = c.icon
                  return (
                    <div
                      key={field.id}
                      className="absolute flex cursor-move select-none items-center justify-center rounded border-2"
                      style={{
                        left: field.canvasX ?? 0,
                        top: field.canvasY ?? 0,
                        width: field.canvasW ?? 160,
                        height: field.canvasH ?? 48,
                        background: c.bg,
                        borderColor: c.border,
                        borderStyle: isDragging === field.id ? 'solid' : 'dashed',
                      }}
                      onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: c.border }}>
                        <Icon size={12} />
                        <span>{c.label}</span>
                      </div>
                      <button
                        className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white"
                        onClick={(e) => { e.stopPropagation(); removeField(field.id) }}
                      >
                        <span style={{ fontSize: 9, lineHeight: 1 }}>×</span>
                      </button>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
