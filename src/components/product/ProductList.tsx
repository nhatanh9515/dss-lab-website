import Link from 'next/link'
import { getProducts } from '@/lib/queries'
import { ProductGrid } from './ProductGrid'

/** Async: lấy sản phẩm theo danh mục rồi render grid (dùng trong <Suspense>). */
export async function ProductList({
  categorySlug,
  activeCatName,
}: {
  categorySlug?: string
  activeCatName?: string
}) {
  const products = await getProducts({ categorySlug })

  if (products.length === 0) {
    return (
      <div className="rounded-lg bg-surface px-4 py-12 text-center">
        <p className="text-sm text-ink-soft">
          {activeCatName
            ? `Chưa có sản phẩm nào trong danh mục "${activeCatName}".`
            : 'Chưa có sản phẩm nào.'}
        </p>
        <Link
          href="/san-pham"
          className="mt-3 inline-block text-[13px] text-brand-blue hover:underline"
        >
          ← Xem tất cả sản phẩm
        </Link>
      </div>
    )
  }

  return <ProductGrid products={products} />
}
