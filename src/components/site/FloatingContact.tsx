'use client'

import { Phone } from 'lucide-react'
import { trackBuyClick } from '@/lib/gtag'

/** Nút liên hệ nổi cố định góc phải: Zalo + Gọi điện (nếu có cấu hình). */
export function FloatingContact({
  zalo,
  hotline,
}: {
  zalo?: string | null
  hotline?: string | null
}) {
  if (!zalo && !hotline) return null

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3">
      {zalo && (
        <a
          href={zalo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
          onClick={() => trackBuyClick('zalo', 'site')}
          className="grid h-12 w-12 place-items-center rounded-full bg-accent text-xs font-semibold text-ink shadow-md"
        >
          Zalo
        </a>
      )}
      {hotline && (
        <a
          href={`tel:${hotline}`}
          aria-label="Gọi điện"
          onClick={() => trackBuyClick('call', 'site')}
          className="grid h-12 w-12 place-items-center rounded-full border border-line bg-bg text-ink shadow-md"
        >
          <Phone size={18} />
        </a>
      )}
    </div>
  )
}
