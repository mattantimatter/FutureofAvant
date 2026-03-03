'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PenLine, Type, Calendar, UserCheck, Info, Save, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FieldPosition {
  id: string
  /** signature / initials = placed by signer | text / date = filled by signer | admin_signature = pre-stamped by admin */
  type: 'signature' | 'initials' | 'text' | 'date' | 'admin_signature'
  page: number      // 1-indexed
  x: number         // PDF points from left (72pt/inch)
  y: number         // PDF points from bottom (pdf-lib origin)
  width: number
  height: number
  label?: string    // text fields: prompt shown to signer (e.g. "Title", "Company")
  value?: string    // pre-filled: admin typed sig text, or date override
  dataURL?: string  // admin drawn sig PNG
  // Canvas display coords (rendering only — not stored in DB)
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
  /** Admin's name for counter-signing */
  adminName?: string
}

const FIELD_CONFIG = {
  signature:       { label: 'Signature',       icon: PenLine,    color: '#696aac', bg: 'rgba(105,106,172,0.12)', defaultW: 200, defaultH: 60 },
  initials:        { label: 'Initials',         icon: Type,       color: '#10b981', bg: 'rgba(16,185,129,0.10)',  defaultW: 80,  defaultH: 40 },
  text:            { label: 'Text Field',       icon: Type,       color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  defaultW: 180, defaultH: 36 },
  date:            { label: 'Date Signed',      icon: Calendar,   color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', defaultW: 130, defaultH: 36 },
  admin_signature: { label: 'My Signature',    icon: UserCheck,  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', defaultW: 200, defaultH: 60 },
} as const

type FieldType = keyof typeof FIELD_CONFIG

// Mini admin signature capture modal
function AdminSigCapture({
  adminName,
  onConfirm,
  onCancel,
}: {
  adminName: string
  onConfirm: (value: string, dataURL?: string) => void
  onCancel: () => void
}) {
  const [mode, setMode] = useState<'type' | 'draw'>('type')
  const [typedSig, setTypedSig] = useState(adminName)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    setHasDrawn(true)
    lastPos.current = getPos(e, canvasRef.current!)
  }
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')!
    const pos = getPos(e, canvasRef.current)
    if (lastPos.current) {
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = '#f6f6fd'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()
    }
    lastPos.current = pos
  }
  const stopDraw = () => { setIsDrawing(false); lastPos.current = null }
  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d')
    ctx?.clearRect(0, 0, 600, 120)
    setHasDrawn(false)
  }

  const handleConfirm = () => {
    if (mode === 'type') {
      onConfirm(typedSig)
    } else {
      const dataURL = canvasRef.current?.toDataURL('image/png')
      onConfirm(adminName, dataURL)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-foreground/10 bg-[#0a0a10] p-6 shadow-modal">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Your Signature</h3>
            <p className="text-xs text-foreground/40">This will be pre-stamped on the document as the sender</p>
          </div>
          <button onClick={onCancel} className="text-foreground/30 hover:text-foreground"><X size={16} /></button>
        </div>

        {/* Mode tabs */}
        <div className="mb-4 flex gap-2">
          {(['type', 'draw'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={cn('rounded-lg px-4 py-1.5 text-xs font-medium transition-all',
                mode === m ? 'bg-[rgba(139,92,246,0.2)] text-violet-300' : 'text-foreground/35 hover:text-foreground/60'
              )}>
              {m === 'type' ? 'Type' : 'Draw'}
            </button>
          ))}
        </div>

        {mode === 'type' ? (
          <div className="space-y-3">
            <input
              value={typedSig}
              onChange={(e) => setTypedSig(e.target.value)}
              className="input-field w-full rounded-xl px-4 py-3 text-sm"
              placeholder="Type your name"
            />
            <div className="flex min-h-[70px] items-center justify-center rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] px-4">
              <span className="font-signature text-2xl text-foreground/90">{typedSig || 'Preview'}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
              <canvas
                ref={canvasRef} width={560} height={120}
                className="w-full cursor-crosshair touch-none" style={{ height: 120 }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
              />
              {!hasDrawn && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-foreground/25">
                  Draw your signature here
                </div>
              )}
            </div>
            {hasDrawn && (
              <button onClick={clearCanvas} className="flex items-center gap-1 text-xs text-foreground/30 hover:text-red-400 transition-colors">
                <Trash2 size={11} />Clear
              </button>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button onClick={onCancel}
            className="flex-1 rounded-xl border border-foreground/[0.08] py-2.5 text-sm text-foreground/40 transition-all hover:text-foreground">
            Cancel
          </button>
          <button onClick={handleConfirm}
            className="flex-1 rounded-[40px] py-2.5 text-sm font-medium text-foreground btn-primary">
            Add My Signature
          </button>
        </div>
      </div>
    </div>
  )
}

export function PDFFieldPlacer({ pdfUrl, signatureRequestId, existingFields = [], onSave, adminName = 'Admin' }: PDFFieldPlacerProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<{ canvas: HTMLCanvasElement; width: number; height: number; pdfHeight: number }[]>([])
  const [fields, setFields] = useState<FieldPosition[]>(existingFields)
  const [activeType, setActiveType] = useState<FieldType>('signature')
  const [isDragging, setIsDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingAdminField, setPendingAdminField] = useState<FieldPosition | null>(null)
  const [textLabelModal, setTextLabelModal] = useState<FieldPosition | null>(null)
  const [textLabelValue, setTextLabelValue] = useState('')

  // Load PDF pages
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true); setError(null)
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise
        const rendered: typeof pages = []

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const scale = 1.4
          const vp = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = vp.width; canvas.height = vp.height
          const ctx = canvas.getContext('2d')!
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await page.render({ canvasContext: ctx as any, canvas, viewport: vp }).promise
          rendered.push({ canvas, width: vp.width, height: vp.height, pdfHeight: page.getViewport({ scale: 1 }).height })
        }
        if (!cancelled) { setPages(rendered); setLoading(false) }
      } catch (e) {
        if (!cancelled) { setError('Failed to render PDF.'); setLoading(false) }
      }
    }
    load()
    return () => { cancelled = true }
  }, [pdfUrl])

  const canvasToPdf = useCallback((cx: number, cy: number, pi: number) => {
    const page = pages[pi]
    if (!page) return { x: 0, y: 0 }
    return { x: Math.round(cx / 1.4), y: Math.round(page.pdfHeight - cy / 1.4) }
  }, [pages])

  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>, pi: number) => {
    if (isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const pdfCoords = canvasToPdf(cx, cy, pi)
    const cfg = FIELD_CONFIG[activeType]
    const newField: FieldPosition = {
      id: Math.random().toString(36).slice(2),
      type: activeType,
      page: pi + 1,
      ...pdfCoords,
      width: cfg.defaultW,
      height: cfg.defaultH,
      canvasX: cx - cfg.defaultW / 2,
      canvasY: cy - cfg.defaultH / 2,
      canvasW: cfg.defaultW,
      canvasH: cfg.defaultH,
    }

    if (activeType === 'admin_signature') {
      setPendingAdminField(newField)
    } else if (activeType === 'text') {
      setTextLabelModal(newField)
      setTextLabelValue('')
    } else {
      setFields((p) => [...p, newField])
    }
  }, [activeType, isDragging, canvasToPdf])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, pi: number) => {
    if (!isDragging) return
    setFields((prev) => prev.map((f) => {
      if (f.id !== isDragging || f.page !== pi + 1) return f
      const dx = e.clientX - dragOffset.x
      const dy = e.clientY - dragOffset.y
      const nx = (f.canvasX ?? 0) + dx
      const ny = (f.canvasY ?? 0) + dy
      const pdf = canvasToPdf(nx + (f.canvasW ?? 0) / 2, ny + (f.canvasH ?? 0) / 2, pi)
      return { ...f, canvasX: nx, canvasY: ny, x: pdf.x, y: pdf.y }
    }))
    setDragOffset({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragOffset, canvasToPdf])

  const handleFieldMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setIsDragging(id)
    setDragOffset({ x: e.clientX, y: e.clientY })
  }

  const handleSave = async () => {
    setSaving(true)
    try { await onSave(fields) } finally { setSaving(false) }
  }

  const signerFields = fields.filter(f => f.type !== 'admin_signature')
  const adminFields = fields.filter(f => f.type === 'admin_signature')

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-foreground/[0.08] bg-foreground/[0.02] px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/35 mr-1">Add:</span>
        {(Object.entries(FIELD_CONFIG) as [FieldType, typeof FIELD_CONFIG[FieldType]][]).map(([type, cfg]) => {
          const Icon = cfg.icon
          return (
            <button key={type} onClick={() => setActiveType(type)}
              className={cn('flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                activeType === type
                  ? 'border-[var(--active-border)] text-[var(--active-color)]'
                  : 'border-foreground/[0.08] text-foreground/35 hover:border-foreground/20 hover:text-foreground/70'
              )}
              style={activeType === type
                ? ({ '--active-border': `${cfg.color}60`, '--active-color': cfg.color, background: cfg.bg } as React.CSSProperties)
                : {}}
            >
              <Icon size={12} />{cfg.label}
            </button>
          )
        })}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex gap-3 text-xs text-foreground/25">
            <span>{signerFields.length} signer field{signerFields.length !== 1 ? 's' : ''}</span>
            {adminFields.length > 0 && <span className="text-violet-400">{adminFields.length} admin sig</span>}
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-[40px] px-4 py-1.5 text-xs font-medium text-foreground btn-primary disabled:opacity-50">
            {saving ? (
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : <Save size={12} />}
            Save Fields
          </button>
        </div>
      </div>

      {/* Help bar */}
      <div className="flex flex-wrap items-center gap-4 border-b border-foreground/[0.06] bg-foreground/[0.01] px-4 py-2 text-xs text-foreground/25">
        <span className="flex items-center gap-1"><Info size={11} />Click PDF to place · Drag to move · × to remove</span>
        <span className="text-violet-400/60">✦ "My Signature" = pre-stamped by you before the signer sees it</span>
      </div>

      {/* PDF canvas */}
      <div ref={canvasContainerRef} className="flex-1 overflow-y-auto bg-background p-4" onMouseUp={() => setIsDragging(null)}>
        {loading && (
          <div className="flex h-40 items-center justify-center gap-2 text-sm text-foreground/35">
            <svg className="h-4 w-4 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Rendering PDF pages...
          </div>
        )}
        {error && <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">{error}</div>}

        {!loading && !error && pages.map((page, pi) => (
          <div key={pi} className="relative mb-4 mx-auto" style={{ width: page.width }}>
            <div className="absolute -top-5 left-0 text-xs text-foreground/20">Page {pi + 1}</div>
            <div
              className="relative cursor-crosshair overflow-hidden shadow-card"
              style={{ width: page.width, height: page.height }}
              onClick={(e) => handlePageClick(e, pi)}
              onMouseMove={(e) => handleMouseMove(e, pi)}
            >
              {/* PDF canvas */}
              <canvas
                ref={(el) => {
                  if (el) {
                    el.width = page.canvas.width; el.height = page.canvas.height
                    el.getContext('2d')!.drawImage(page.canvas, 0, 0)
                  }
                }}
                style={{ width: page.width, height: page.height, display: 'block' }}
              />

              {/* Field overlays */}
              {fields.filter(f => f.page === pi + 1).map((field) => {
                const cfg = FIELD_CONFIG[field.type]
                const Icon = cfg.icon
                return (
                  <div key={field.id}
                    className="absolute flex cursor-move select-none items-center justify-center rounded border-2"
                    style={{
                      left: field.canvasX ?? 0, top: field.canvasY ?? 0,
                      width: field.canvasW ?? 160, height: field.canvasH ?? 48,
                      background: cfg.bg,
                      borderColor: cfg.color,
                      borderStyle: isDragging === field.id ? 'solid' : 'dashed',
                    }}
                    onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center gap-0.5" style={{ color: cfg.color }}>
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <Icon size={11} />
                        <span>{field.label || cfg.label}</span>
                      </div>
                      {field.type === 'admin_signature' && field.value && (
                        <span className="font-signature text-sm" style={{ color: cfg.color }}>
                          {field.value}
                        </span>
                      )}
                    </div>
                    <button
                      className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold"
                      onClick={(e) => { e.stopPropagation(); setFields(p => p.filter(f => f.id !== field.id)) }}
                    >×</button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Admin signature capture modal */}
      {pendingAdminField && (
        <AdminSigCapture
          adminName={adminName}
          onConfirm={(value, dataURL) => {
            setFields(p => [...p, { ...pendingAdminField, value, dataURL }])
            setPendingAdminField(null)
          }}
          onCancel={() => setPendingAdminField(null)}
        />
      )}

      {/* Text field label modal */}
      {textLabelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setTextLabelModal(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-foreground/10 bg-[#0a0a10] p-6 shadow-modal">
            <h3 className="mb-1 font-semibold text-foreground">Text Field Label</h3>
            <p className="mb-4 text-xs text-foreground/40">What should the signer fill in here? (e.g., "Title", "Company Name")</p>
            <input
              autoFocus
              value={textLabelValue}
              onChange={e => setTextLabelValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && textLabelValue.trim()) {
                  setFields(p => [...p, { ...textLabelModal, label: textLabelValue.trim() }])
                  setTextLabelModal(null)
                }
              }}
              placeholder="e.g. Title, Company Name, Phone..."
              className="input-field mb-4 w-full rounded-xl px-4 py-3 text-sm"
            />
            <div className="flex gap-3">
              <button onClick={() => setTextLabelModal(null)}
                className="flex-1 rounded-xl border border-foreground/[0.08] py-2.5 text-sm text-foreground/40 hover:text-foreground">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (textLabelValue.trim()) {
                    setFields(p => [...p, { ...textLabelModal, label: textLabelValue.trim() }])
                    setTextLabelModal(null)
                  }
                }}
                disabled={!textLabelValue.trim()}
                className="flex-1 rounded-[40px] py-2.5 text-sm font-medium text-foreground btn-primary disabled:opacity-40">
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
