import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Avant × Antimatter — ATOM Proposal',
  description:
    "Interactive enterprise AI deployment proposal powered by Antimatter AI's ATOM framework.",
  openGraph: {
    title: 'Avant × Antimatter — ATOM Deployment Proposal',
    description:
      'Deploy governed enterprise AI across voice, search, and workflows — in your infrastructure.',
    siteName: 'Antimatter AI',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable} suppressHydrationWarning>
      <body className={font.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
