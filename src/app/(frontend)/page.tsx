import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories, getSiteSettings } from '@/lib/queries'
import { getImageUrl, getImageAlt } from '@/lib/format'
import { FeaturedProducts } from '@/components/product/FeaturedProducts'
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton'

export default async function HomePage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ])

  const banner = settings.homeBanners?.[0]
  const bannerUrl = getImageUrl(banner?.image, 'feature')

  return (
    <main className="mx-auto max-w-content px-4 py-6 md:px-9 md:py-8">
      {/* Banner */}
      {banner ? (
        <Link
          href={banner.link || '/san-pham'}
          className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-accent md:aspect-[21/9]"
        >
          {bannerUrl && (
            <Image
              src={bannerUrl}
              alt={getImageAlt(banner.image) || banner.heading || 'Banner'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1000px"
              className="object-cover"
            />
          )}
          {(banner.heading || banner.subheading) && (
            <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/40 to-transparent p-6 md:p-9">
              {banner.heading && (
                <h1 className="font-heading text-2xl font-medium text-white md:text-4xl">
                  {banner.heading}
                </h1>
              )}
              {banner.subheading && (
                <p className="max-w-md text-sm text-white/90">{banner.subheading}</p>
              )}
            </div>
          )}
        </Link>
      ) : (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-lg bg-accent px-6 text-center md:aspect-[21/9]">
          <h1 className="font-heading text-2xl font-medium tracking-[2px] md:text-4xl">
            DSS HOMELAB
          </h1>
          <p className="max-w-md text-sm text-ink-soft">
            Mỹ phẩm chăm sóc da lành tính, an toàn cho làn da Việt.
          </p>
          <Link
            href="/san-pham"
            className="mt-2 rounded-pill bg-ink px-6 py-3 text-sm text-white transition-opacity hover:opacity-90"
          >
            Xem sản phẩm →
          </Link>
        </div>
      )}

      {/* Danh mục */}
      {categories.length > 0 && (
        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/san-pham"
              className="rounded-pill bg-ink px-4 py-2 text-[13px] text-white"
            >
              Tất cả
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/san-pham?category=${c.slug}`}
                className="rounded-pill border border-line-strong px-4 py-2 text-[13px] text-ink transition-colors hover:bg-surface"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sản phẩm nổi bật */}
      <section className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-lg font-medium tracking-[2px] md:text-xl">
            SẢN PHẨM NỔI BẬT
          </h2>
          <Link href="/san-pham" className="text-[13px] text-muted-2 hover:text-ink">
            Xem tất cả
          </Link>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </main>
  )
}
