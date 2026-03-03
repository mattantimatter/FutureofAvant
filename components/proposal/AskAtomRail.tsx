'use client'

import React, { useRef, useState } from 'react'
import { Send, Bot, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message { role: 'user' | 'assistant'; content: string }

const CHIPS = [
  { label: 'How does ATOM handle security?', key: 'security' },
  { label: 'What deployment options exist?', key: 'deployment' },
  { label: 'How is pricing structured?', key: 'pricing' },
  { label: 'Is ATOM HIPAA-compatible?', key: 'hipaa' },
]

export function AskAtomRail({ proposalToken, className }: { proposalToken: string; className?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)
  const [highlighted, setHighlighted] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Listen for the focus-atom event from Next Steps
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = () => {
      setOpen(true)
      setHighlighted(true)
      setTimeout(() => {
        inputRef.current?.focus()
        setHighlighted(false)
      }, 600)
    }
    el.addEventListener('focus-atom', handler)
    return () => el.removeEventListener('focus-atom', handler)
  }, [])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setMessages((p) => [...p, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, token: proposalToken }),
      })
      const data = await res.json()
      setMessages((p) => [...p, { role: 'assistant', content: data.response }])
    } catch {
      setMessages((p) => [...p, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-3 text-sm text-foreground/50 transition-all hover:border-foreground/20 hover:text-foreground/80"
      >
        <Bot size={15} className="text-accent" />Ask Atom
      </button>
    )
  }

  return (
    <div
      id="ask-atom-rail"
      ref={containerRef}
      className={cn(
        'flex h-[490px] flex-col rounded-2xl border bg-foreground/[0.02] transition-all duration-500',
        highlighted ? 'border-accent/60 shadow-[0_0_30px_rgba(105,106,172,0.25)]' : 'border-foreground/10',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-foreground/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15">
            <Bot size={14} className="text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Ask Atom</p>
            <p className="text-xs text-foreground/30">Powered by ATOM IntentIQ</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="text-foreground/30 hover:text-foreground/60">
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Bot size={18} className="text-secondary" />
            </div>
            <p className="text-xs font-light text-foreground/35">
              Ask about ATOM, deployment, security, or pricing.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            {m.role === 'assistant' && (
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Bot size={11} className="text-secondary" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                m.role === 'user'
                  ? 'rounded-br-sm bg-white text-black'
                  : 'rounded-bl-sm bg-foreground/[0.07] text-foreground/80'
              )}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                <User size={11} className="text-foreground/60" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Bot size={11} className="text-secondary" />
            </div>
            <div className="rounded-xl rounded-bl-sm bg-foreground/[0.07] px-3 py-2">
              <div className="flex gap-1">
                {[0,1,2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: `${i*200}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Prompt chips */}
      {messages.length === 0 && (
        <div className="border-t border-foreground/[0.06] px-3 py-2">
          <div className="flex flex-wrap gap-1.5">
            {CHIPS.map((c) => (
              <button
                key={c.key}
                onClick={() => send(c.label)}
                className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-2.5 py-1.5 text-xs text-foreground/40 transition-all hover:bg-accent hover:text-background hover:border-accent"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-foreground/[0.06] p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Ask about ATOM..."
            ref={inputRef}
          className="flex-1 rounded-lg border border-foreground/[0.08] bg-transparent px-3 py-2 text-xs text-foreground placeholder-foreground/25 outline-none focus:border-accent/40"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full btn-primary disabled:opacity-30"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
