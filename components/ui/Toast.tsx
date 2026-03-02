'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

interface Toast { id: string; type: 'success' | 'error' | 'info'; message: string }
interface ToastCtx { toast: (message: string, type?: Toast['type']) => void }

const ToastContext = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

const iconMap = { success: CheckCircle, error: AlertCircle, info: Info }
const styleMap = {
  success: 'border-green-500/20 bg-green-500/5 text-green-400',
  error: 'border-red-500/20 bg-red-500/5 text-red-400',
  info: 'border-accent/20 bg-accent/5 text-secondary',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((p) => [...p, { id, type, message }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = iconMap[t.type]
          return (
            <div
              key={t.id}
              className={cn(
                'flex animate-slide-up items-center gap-3 rounded-xl border px-4 py-3 text-xs backdrop-blur-sm',
                styleMap[t.type]
              )}
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
            >
              <Icon size={14} className="shrink-0" />
              <span className="font-medium">{t.message}</span>
              <button
                onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                className="ml-2 opacity-50 hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
