import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/getPayload'
import { getBaseUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl()
  const payload = await getPayloadClient()

  const products = await payload.find({
    collection: 'products',
    where: { published: { equals: true } },
    limit: 1000,
    depth: 0,
    select: { slug: true, updatedAt: true },
  })

  const productUrls: MetadataRoute.Sitemap = products.docs
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${base}/san-pham/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/gioi-thieu`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/lien-he`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  return [...staticUrls, ...productUrls]
}
