import type { Where } from 'payload'
import { getPayloadClient } from './getPayload'
import type { Category, Product, SiteSetting } from '@/payload-types'

/** Cấu hình website (global). */
export const getSiteSettings = async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

/** Danh sách danh mục, sắp theo sortOrder. */
export const getCategories = async (): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    sort: 'sortOrder',
    limit: 100,
    depth: 0,
  })
  return res.docs
}

/**
 * Danh sách sản phẩm cho trang chủ (có lọc danh mục + tìm kiếm).
 * Có thể lọc theo slug danh mục.
 */
export const getProducts = async (opts?: {
  categorySlug?: string
  q?: string
}): Promise<Product[]> => {
  const payload = await getPayloadClient()

  const and: Where[] = [{ published: { equals: true } }]

  if (opts?.categorySlug) {
    const cat = await payload.find({
      collection: 'categories',
      where: { slug: { equals: opts.categorySlug } },
      limit: 1,
      depth: 0,
    })
    if (cat.docs.length === 0) return []
    and.push({ category: { equals: cat.docs[0].id } })
  }

  const q = opts?.q?.trim()
  if (q) {
    // Tìm theo tên HOẶC mô tả ngắn (lưu ở seo.description dạng text thuần).
    and.push({
      or: [{ title: { like: q } }, { 'seo.description': { like: q } }],
    })
  }

  const res = await payload.find({
    collection: 'products',
    where: { and },
    sort: 'sortOrder',
    limit: 100,
    depth: 1,
  })
  return res.docs
}

/** Một sản phẩm theo slug (kèm ảnh, danh mục). Null nếu không có / chưa publish. */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
      published: { equals: true },
    },
    limit: 1,
    // depth 1 đủ để populate ảnh, danh mục, ogImage — không cần quan hệ lồng sâu hơn.
    depth: 1,
  })
  return res.docs[0] ?? null
}

/** Sản phẩm liên quan (cùng danh mục, khác chính nó). */
export const getRelatedProducts = async (
  product: Product,
  limit = 4,
): Promise<Product[]> => {
  const payload = await getPayloadClient()
  const categoryId =
    typeof product.category === 'object' && product.category
      ? product.category.id
      : product.category

  if (!categoryId) return []

  const res = await payload.find({
    collection: 'products',
    where: {
      published: { equals: true },
      category: { equals: categoryId },
      id: { not_equals: product.id },
    },
    sort: 'sortOrder',
    limit,
    depth: 1,
  })
  return res.docs
}
