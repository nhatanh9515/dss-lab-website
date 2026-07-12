import type { Metadata } from 'next'
import { Phone } from 'lucide-react'
import { getSiteSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ với DSS HOMELAB',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const social = settings.social || {}

  const channels = [
    { label: 'Zalo', href: social.zalo },
    { label: 'Facebook', href: social.facebook },
    { label: 'Instagram', href: social.instagram },
    { label: 'TikTok', href: social.tiktok },
    { label: 'Shopee', href: social.shopee },
  ].filter((c) => c.href)

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:px-9">
      <h1 className="font-heading text-2xl font-medium tracking-[2px] md:text-3xl">
        Liên hệ
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        Bạn cần tư vấn sản phẩm? Hãy liên hệ với DSS HOMELAB qua các kênh dưới đây.
      </p>

      {/* Hotline */}
      {settings.hotline && (
        <a
          href={`tel:${settings.hotline}`}
          className="mt-6 flex items-center gap-3 rounded-lg bg-accent px-5 py-4"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-bg text-ink">
            <Phone size={18} />
          </span>
          <span>
            <span className="block text-xs text-muted">Gọi hotline</span>
            <span className="block font-heading text-lg font-medium text-ink">
              {settings.hotline}
            </span>
          </span>
        </a>
      )}

      {/* Kênh mạng xã hội */}
      {channels.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href as string}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line px-4 py-4 text-center text-sm font-medium text-ink transition-colors hover:bg-surface"
            >
              {c.label}
            </a>
          ))}
        </div>
      )}

      {!settings.hotline && channels.length === 0 && (
        <p className="mt-6 rounded-lg bg-surface px-4 py-8 text-center text-sm text-ink-soft">
          Thông tin liên hệ đang được cập nhật.
        </p>
      )}
    </main>
  )
}
