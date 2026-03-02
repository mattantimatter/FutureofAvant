'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Plus, LogOut, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Proposals', href: '/admin/proposals', icon: FileText },
  { label: 'New Proposal', href: '/admin/proposals/new', icon: Plus },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-52 shrink-0 flex-col border-r border-foreground/[0.06]">
        <div className="border-b border-foreground/[0.06] px-4 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
              <span className="text-xs font-bold text-secondary">A</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Atom Admin</p>
              <p className="text-xs font-light text-foreground/30">Avant × Antimatter</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                  isActive
                    ? 'bg-foreground/[0.05] text-foreground'
                    : 'text-foreground/40 hover:bg-foreground/[0.03] hover:text-foreground/70'
                )}
              >
                <item.icon size={15} className={isActive ? 'text-accent' : 'text-foreground/25'} />
                {item.label}
                {isActive && <ChevronRight size={13} className="ml-auto text-foreground/20" />}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-foreground/[0.06] p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/30 transition-all hover:bg-red-500/5 hover:text-red-400"
          >
            <LogOut size={14} />Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
