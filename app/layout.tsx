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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avant-atom-proposal.vercel.app'

export const metadata: Metadata = {
  title: 'Avant Pathfinder × Antimatter AI — ATOM Deployment Proposal',
  icons: { icon: '/icon.png', apple: '/icon.png' },
  description:
    'A comprehensive upgrade of Pathfinder\'s IQA, Competitive Matrices, and Atlas through Antimatter AI\'s ATOM agentic platform. Transform Trusted Advisor discovery through agentic AI.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Avant Pathfinder × Antimatter AI — ATOM Deployment Proposal',
    description:
      'Deploy agentic AI into Pathfinder\'s IQA, Competitive Matrices, and Atlas. Real-time discovery, same-session recommendations, and geospatial fiber intelligence.',
    siteName: 'Antimatter AI',
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1280,
        height: 800,
        alt: 'Antimatter AI — Building Enterprise AI that Makes Sense',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avant Pathfinder × Antimatter AI — ATOM Deployment Proposal',
    description: 'Deploy agentic AI into Pathfinder. IQA + Competitive Matrices + Atlas geospatial intelligence.',
    images: ['/og-image.png'],
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
