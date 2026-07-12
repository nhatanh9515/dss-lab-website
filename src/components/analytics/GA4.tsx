import Script from 'next/script'
import { GA4_ID } from '@/lib/gtag'

/** Nạp Google Analytics 4 nếu có NEXT_PUBLIC_GA4_ID. Không có thì render rỗng. */
export function GA4() {
  if (!GA4_ID) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
        `}
      </Script>
    </>
  )
}
