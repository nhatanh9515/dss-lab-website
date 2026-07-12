'use client'

import { Phone, MessageCircle, Facebook } from 'lucide-react'
import type { SiteSetting } from '@/payload-types'
import { trackBuyClick, type BuyChannel } from '@/lib/gtag'
import { externalHref } from '@/lib/format'

type Item = {
  channel: BuyChannel
  href: string
  label: string
  icon: typeof Phone
  isTel?: boolean
  accent?: boolean
}

/**
 * Nút liên hệ nổi cố định góc phải: Messenger / Zalo / Gọi điện.
 * Bật/tắt & nội dung từ SiteSettings > "Nút liên hệ nổi".
 * Có fallback về hotline / social.zalo cũ nếu chưa điền link riêng.
 */
export function FloatingContact({
  config,
  fallbackZalo,
  fallbackHotline,
}: {
  config?: SiteSetting['floatingContact']
  fallbackZalo?: string | null
  fallbackHotline?: string | null
}) {
  const c = config || {}

  const items: Item[] = []

  const messengerUrl = externalHref(c.messengerUrl)
  if (c.messengerEnabled && messengerUrl) {
    items.push({
      channel: 'facebook',
      href: messengerUrl,
      label: 'Messenger',
      icon: Facebook,
    })
  }

  const zaloUrl = externalHref(c.zaloUrl || fallbackZalo)
  if ((c.zaloEnabled ?? true) && zaloUrl) {
    items.push({
      channel: 'zalo',
      href: zaloUrl,
      label: 'Zalo',
      icon: MessageCircle,
      accent: true,
    })
  }

  const phone = c.callPhone || fallbackHotline
  if ((c.callEnabled ?? true) && phone) {
    items.push({
      channel: 'call',
      href: `tel:${phone}`,
      label: 'Gọi điện',
      icon: Phone,
      isTel: true,
    })
  }

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <a
            key={item.channel}
            href={item.href}
            target={item.isTel ? undefined : '_blank'}
            rel={item.isTel ? undefined : 'noopener noreferrer'}
            aria-label={item.label}
            title={item.label}
            onClick={() => trackBuyClick(item.channel, 'site')}
            className={`grid h-12 w-12 place-items-center rounded-full shadow-md transition-transform hover:scale-105 ${
              item.accent
                ? 'bg-accent text-ink'
                : 'border border-line bg-bg text-ink'
            }`}
          >
            <Icon size={20} />
          </a>
        )
      })}
    </div>
  )
}
