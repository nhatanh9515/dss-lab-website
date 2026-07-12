import type { Metadata } from 'next'
import { Jost, Mulish } from 'next/font/google'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

const mulish = Mulish({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-mulish',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DSS HOMELAB — Mỹ phẩm',
  description: 'Website giới thiệu sản phẩm mỹ phẩm DSS HOMELAB',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${jost.variable} ${mulish.variable}`}>
      <body className="min-h-screen bg-bg font-body text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
