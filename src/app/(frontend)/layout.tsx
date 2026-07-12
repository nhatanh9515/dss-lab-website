import type { Metadata } from 'next'
import { Jost, Mulish } from 'next/font/google'
import './globals.css'
import { getSiteSettings } from '@/lib/queries'
import { getImageUrl } from '@/lib/format'
import { getBaseUrl, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { FloatingContact } from '@/components/site/FloatingContact'
import { Analytics } from '@/components/analytics/Analytics'
import { OrganizationJsonLd } from '@/components/seo/JsonLd'

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
  const title = seo?.title || `${SITE_NAME} — Mỹ phẩm chăm sóc da`
  const description = seo?.description || SITE_DESCRIPTION
  const ogImage = getImageUrl(seo?.ogImage, 'og')

  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'vi_VN',
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
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
        <OrganizationJsonLd settings={settings} />
        <Header settings={settings} />
        <div className="flex-1">{children}</div>
        <Footer settings={settings} />
        <FloatingContact
          config={settings.floatingContact}
          fallbackZalo={settings.social?.zalo}
          fallbackHotline={settings.hotline}
        />
        <Analytics />
      </body>
    </html>
  )
}
