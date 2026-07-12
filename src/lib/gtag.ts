export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export type BuyChannel = 'shopee' | 'tiktok' | 'zalo' | 'facebook' | 'call'

const EVENT_BY_CHANNEL: Record<BuyChannel, string> = {
  shopee: 'click_shopee',
  tiktok: 'click_tiktok',
  zalo: 'click_zalo',
  facebook: 'click_facebook',
  call: 'click_call',
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Bắn event khi khách bấm nút mua/liên hệ:
 * - GA4: click_<channel> kèm { channel, product_slug }
 * - Meta Pixel: custom event tương ứng kèm { channel, product_slug }
 * No-op nếu chưa cấu hình analytics.
 */
export const trackBuyClick = (channel: BuyChannel, productSlug: string) => {
  if (typeof window === 'undefined') return
  const eventName = EVENT_BY_CHANNEL[channel]
  const params = { channel, product_slug: productSlug }

  if (GA4_ID) {
    // Nạp động để không đưa code analytics vào bundle ban đầu.
    import('@next/third-parties/google')
      .then(({ sendGAEvent }) => sendGAEvent('event', eventName, params))
      .catch(() => {})
  }
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, params)
  }
}
