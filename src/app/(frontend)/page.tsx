import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories, getSiteSettings } from '@/lib/queries'
import { getImageUrl, getImageAlt } from '@/lib/format'
import { ProductList } from '@/components/product/ProductList'
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ])

  const banner = settings.homeBanners?.[0]
  const bannerUrl = getImageUrl(banner?.image, 'feature')
  const activeCat = categories.find((c) => c.slug === category)

  const heading = q
    ? `Kết quả tìm kiếm: “${q}”`
    : activeCat
      ? activeCat.name
      : 'Tất cả sản phẩm'

  return (
    <main className="mx-auto max-w-content px-4 py-6 md:px-9 md:py-8">
      {/* Banner — luôn cố định, không đổi khi lọc/tìm kiếm */}
      {banner ? (
        <Link
          href={banner.link || '/'}
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
          <span className="font-heading text-2xl font-medium tracking-[2px] md:text-4xl">
            DSS HOMELAB
          </span>
          <p className="max-w-md text-sm text-ink-soft">
            Mỹ phẩm chăm sóc da lành tính, an toàn cho làn da Việt.
          </p>
        </div>
      )}

      {/* Bộ lọc danh mục */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/"
          className={`rounded-pill px-4 py-2 text-[13px] transition-colors ${
            !category && !q
              ? 'bg-ink text-white'
              : 'border border-line-strong text-ink hover:bg-surface'
          }`}
        >
          Tất cả
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/?category=${c.slug}`}
            className={`rounded-pill px-4 py-2 text-[13px] transition-colors ${
              category === c.slug
                ? 'bg-ink text-white'
                : 'border border-line-strong text-ink hover:bg-surface'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Tiêu đề + danh sách (chỉ phần này đổi khi lọc/tìm) */}
      <div className="mt-6">
        <h1 className="mb-4 font-heading text-lg font-medium tracking-[2px] md:text-xl">
          {heading}
        </h1>
        <Suspense
          key={`${category ?? ''}-${q ?? ''}`}
          fallback={<ProductGridSkeleton />}
        >
          <ProductList
            categorySlug={category}
            q={q}
            activeCatName={activeCat?.name}
          />
        </Suspense>
      </div>
    </main>
  )
}
