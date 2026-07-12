import { getFeaturedProducts } from '@/lib/queries'
import { ProductGrid } from './ProductGrid'

/** Async: sản phẩm nổi bật cho trang chủ (dùng trong <Suspense>). */
export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8)

  if (products.length === 0) {
    return (
      <p className="rounded-lg bg-surface px-4 py-8 text-center text-sm text-ink-soft">
        Chưa có sản phẩm nào. Hãy thêm sản phẩm trong trang quản trị.
      </p>
    )
  }

  return <ProductGrid products={products} />
}
