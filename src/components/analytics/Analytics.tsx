import { GoogleAnalytics } from '@next/third-parties/google'
import { MetaPixel } from './MetaPixel'
import { GA4_ID, META_PIXEL_ID } from '@/lib/gtag'

/** Nạp GA4 (qua @next/third-parties) và Meta Pixel nếu có ID trong env. */
export function Analytics() {
  return (
    <>
      {GA4_ID ? <GoogleAnalytics gaId={GA4_ID} /> : null}
      {META_PIXEL_ID ? <MetaPixel pixelId={META_PIXEL_ID} /> : null}
    </>
  )
}
