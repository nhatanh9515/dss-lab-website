'use client'

import { ShoppingBag, Music2, MessageCircle, Facebook, Phone } from 'lucide-react'
import type { Product } from '@/payload-types'
import { trackBuyClick, type BuyChannel } from '@/lib/gtag'

type Links = NonNullable<Product['links']>

export function BuyButtons({
  links,
  slug,
  isOutOfStock,
}: {
  links?: Links | null
  slug: string
  isOutOfStock: boolean
}) {
  const l = links || {}

  // Kênh mua chính trên sàn — bị disable khi hết hàng.
  const purchase = [
    {
      channel: 'shopee' as BuyChannel,
      href: l.shopee,
      label: 'Mua trên Shopee',
      icon: ShoppingBag,
      style: 'bg-channel-shopee text-white',
    },
    {
      channel: 'tiktok' as BuyChannel,
      href: l.tiktok,
      label: 'Mua trên TikTok Shop',
      icon: Music2,
      style: 'bg-channel-tiktok text-white',
    },
  ].filter((b) => b.href)

  // Kênh liên hệ — luôn hiển thị để khách hỏi, kể cả khi hết hàng.
  const contact = [
    {
      channel: 'zalo' as BuyChannel,
      href: l.zalo,
      label: 'Chat Zalo',
      icon: MessageCircle,
      style: 'bg-accent text-ink',
    },
    {
      channel: 'facebook' as BuyChannel,
      href: l.facebook,
      label: 'Nhắn Facebook',
      icon: Facebook,
      style: 'border border-line-strong text-ink',
    },
    {
      channel: 'call' as BuyChannel,
      href: l.hotline ? `tel:${l.hotline}` : undefined,
      label: l.hotline ? `Gọi ${l.hotline}` : 'Gọi điện',
      icon: Phone,
      style: 'border border-line-strong text-ink',
    },
  ].filter((b) => b.href)

  const hasAny = purchase.length > 0 || contact.length > 0

  if (!hasAny) {
    return (
      <p className="rounded-lg bg-surface px-4 py-3 text-sm text-ink-soft">
        Liên hệ shop để đặt sản phẩm này.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {isOutOfStock && (
        <p className="rounded-lg bg-badge-out px-4 py-2.5 text-sm font-medium text-badge-out-text">
          Tạm hết hàng
        </p>
      )}

      {/* Nút mua trên sàn */}
      {purchase.map((b) => {
        const Icon = b.icon
        if (isOutOfStock) {
          return (
            <button
              key={b.channel}
              type="button"
              disabled
              className="flex cursor-not-allowed items-center justify-center gap-2 rounded-pill bg-surface px-5 py-3 text-sm font-medium text-muted-2"
            >
              <Icon size={17} /> {b.label}
            </button>
          )
        }
        return (
          <a
            key={b.channel}
            href={b.href as string}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBuyClick(b.channel, slug)}
            className={`flex items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 ${b.style}`}
          >
            <Icon size={17} /> {b.label}
          </a>
        )
      })}

      {/* Nút liên hệ */}
      {contact.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {contact.map((b) => {
            const Icon = b.icon
            const isTel = b.channel === 'call'
            return (
              <a
                key={b.channel}
                href={b.href as string}
                target={isTel ? undefined : '_blank'}
                rel={isTel ? undefined : 'noopener noreferrer'}
                onClick={() => trackBuyClick(b.channel, slug)}
                className={`flex items-center justify-center gap-1.5 rounded-pill px-3 py-2.5 text-[13px] font-medium transition-opacity hover:opacity-90 ${b.style}`}
              >
                <Icon size={15} /> {b.label}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
