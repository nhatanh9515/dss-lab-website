import type { Metadata } from 'next'
import { Jost, Mulish } from 'next/font/google'
import './globals.css'
import { getSiteSettings } from '@/lib/queries'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { FloatingContact } from '@/components/site/FloatingContact'
import { GA4 } from '@/components/analytics/GA4'

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const seo = settings.defaultSeo
  return {
    title: {
      default: seo?.title || 'DSS HOMELAB — Mỹ phẩm',
      template: '%s | DSS HOMELAB',
    },
    description:
      seo?.description || 'Website giới thiệu sản phẩm mỹ phẩm DSS HOMELAB',
  }
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="vi" className={`${jost.variable} ${mulish.variable}`}>
      <body className="flex min-h-screen flex-col bg-bg font-body text-ink antialiased">
        <GA4 />
        <Header settings={settings} />
        <div className="flex-1">{children}</div>
        <Footer settings={settings} />
        <FloatingContact
          zalo={settings.social?.zalo}
          hotline={settings.hotline}
        />
      </body>
    </html>
  )
}
