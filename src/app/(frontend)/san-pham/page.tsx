import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { getCategories } from '@/lib/queries'
import { ProductList } from '@/components/product/ProductList'
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton'

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Danh sách sản phẩm mỹ phẩm DSS HOMELAB',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const categories = await getCategories()
  const activeCat = categories.find((c) => c.slug === category)

  return (
    <main className="mx-auto max-w-content px-4 py-6 md:px-9 md:py-8">
      <h1 className="font-heading text-xl font-medium tracking-[2px] md:text-2xl">
        {activeCat ? activeCat.name : 'Tất cả sản phẩm'}
      </h1>

      {/* Bộ lọc danh mục */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/san-pham"
          className={`rounded-pill px-4 py-2 text-[13px] transition-colors ${
            !category
              ? 'bg-ink text-white'
              : 'border border-line-strong text-ink hover:bg-surface'
          }`}
        >
          Tất cả
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/san-pham?category=${c.slug}`}
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

      {/* Grid — bọc Suspense để có skeleton khi đổi bộ lọc */}
      <div className="mt-6">
        <Suspense key={category ?? 'all'} fallback={<ProductGridSkeleton />}>
          <ProductList categorySlug={category} activeCatName={activeCat?.name} />
        </Suspense>
      </div>
    </main>
  )
}
