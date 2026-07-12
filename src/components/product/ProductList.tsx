import Link from 'next/link'
import { getProducts } from '@/lib/queries'
import { ProductGrid } from './ProductGrid'

/** Async: lấy sản phẩm theo danh mục / từ khoá rồi render grid (dùng trong <Suspense>). */
export async function ProductList({
  categorySlug,
  q,
  activeCatName,
}: {
  categorySlug?: string
  q?: string
  activeCatName?: string
}) {
  const products = await getProducts({ categorySlug, q })

  if (products.length === 0) {
    let message = 'Chưa có sản phẩm nào.'
    if (q) message = `Không tìm thấy sản phẩm nào cho “${q}”.`
    else if (activeCatName)
      message = `Chưa có sản phẩm nào trong danh mục “${activeCatName}”.`

    return (
      <div className="rounded-lg bg-surface px-4 py-12 text-center">
        <p className="text-sm text-ink-soft">{message}</p>
        <Link
          href="/"
          className="mt-3 inline-block text-[13px] text-brand-blue hover:underline"
        >
          ← Xem tất cả sản phẩm
        </Link>
      </div>
    )
  }

  return <ProductGrid products={products} />
}
