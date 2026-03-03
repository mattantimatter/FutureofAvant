'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TermsSection {
  title: string
  items: string[]
}

interface LegalTermsProps {
  content: {
    title: string
    subtitle: string
    sections: TermsSection[]
  }
}

export function LegalTerms({ content }: LegalTermsProps) {
  const [expanded, setExpanded] = useState<string | null>(content.sections[0]?.title ?? null)

  return (
    <section id="section-legal" className="section-anchor proposal-section">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            Terms
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">{content.subtitle}</p>
        </div>

        {/* Accordion sections */}
        <div className="space-y-3">
          {content.sections.map((section) => {
            const isOpen = expanded === section.title
            return (
              <div
                key={section.title}
                className="overflow-hidden rounded-xl border border-[rgba(105,106,172,0.12)] bg-[rgba(10,10,15,0.5)]"
              >
                <button
                  className="flex w-full items-center justify-between p-5 text-left"
                  onClick={() => setExpanded(isOpen ? null : section.title)}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-secondary shrink-0" />
                    <span className="font-semibold text-foreground">{section.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500 shrink-0" />
                  )}
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-[600px]' : 'max-h-0'
                  )}
                >
                  <ul className="space-y-2 border-t border-[rgba(105,106,172,0.08)] px-5 pb-5 pt-4">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legal disclaimer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          This is a summary. Full legal terms will be attached to the final executed agreement.
          Contact paul@antimatterai.com with questions.
        </p>
      </div>
    </section>
  )
}
