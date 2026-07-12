import type { Product, SiteSetting } from '@/payload-types'
import { getImageUrl } from '@/lib/format'
import { getBaseUrl, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'
import { externalHref } from '@/lib/format'

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** schema.org Organization — đặt ở layout, xuất hiện mọi trang. */
export function OrganizationJsonLd({ settings }: { settings: SiteSetting }) {
  const base = getBaseUrl()
  const social = settings.social || {}
  const sameAs = [
    social.facebook,
    social.instagram,
    social.tiktok,
    social.youtube,
    social.shopee,
  ]
    .map((u) => externalHref(u))
    .filter(Boolean)

  const logo = getImageUrl(settings.logo, 'feature')

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: base,
        description: settings.defaultSeo?.description || SITE_DESCRIPTION,
        ...(logo ? { logo } : {}),
        ...(settings.hotline
          ? {
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: settings.hotline,
                contactType: 'customer service',
              },
            }
          : {}),
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  )
}

const AVAILABILITY: Record<NonNullable<Product['stockStatus']>, string> = {
  in_stock: 'https://schema.org/InStock',
  low_stock: 'https://schema.org/LimitedAvailability',
  out_of_stock: 'https://schema.org/OutOfStock',
}

/** schema.org Product (kèm offers, availability từ stockStatus). */
export function ProductJsonLd({ product }: { product: Product }) {
  const base = getBaseUrl()
  const url = `${base}/san-pham/${product.slug}`
  const images = (product.images || [])
    .map((it) => getImageUrl(it.image, 'feature'))
    .filter((u): u is string => !!u)

  const category =
    typeof product.category === 'object' && product.category
      ? product.category.name
      : undefined

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        ...(product.seo?.description
          ? { description: product.seo.description }
          : {}),
        ...(images.length ? { image: images } : {}),
        ...(category ? { category } : {}),
        brand: { '@type': 'Brand', name: SITE_NAME },
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'VND',
          price: product.price,
          availability:
            AVAILABILITY[product.stockStatus || 'in_stock'] ??
            AVAILABILITY.in_stock,
        },
      }}
    />
  )
}

export type Crumb = { name: string; url: string }

/** schema.org BreadcrumbList. */
export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const base = getBaseUrl()
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.url.startsWith('http') ? c.url : `${base}${c.url}`,
        })),
      }}
    />
  )
}
