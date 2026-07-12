import { redirect } from 'next/navigation'

/**
 * Trang danh sách sản phẩm giờ nằm ở trang chủ ("/").
 * Chuyển hướng /san-pham (và giữ tham số lọc/tìm) về "/".
 */
export default async function ProductsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  const qs = params.toString()
  redirect(qs ? `/?${qs}` : '/')
}
