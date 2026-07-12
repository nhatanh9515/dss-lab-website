export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

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
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/** Bắn event GA4 khi khách bấm nút mua. No-op nếu chưa cấu hình GA4. */
export const trackBuyClick = (channel: BuyChannel, productSlug: string) => {
  if (typeof window === 'undefined') return
  const eventName = EVENT_BY_CHANNEL[channel]
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, { product_slug: productSlug })
  }
}
