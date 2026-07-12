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

/** Sản phẩm nổi bật cho trang chủ (đã publish). */
export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { published: { equals: true } },
    sort: 'sortOrder',
    limit,
    depth: 1,
  })
  return res.docs
}

/**
 * Danh sách sản phẩm cho trang /san-pham.
 * Có thể lọc theo slug danh mục.
 */
export const getProducts = async (opts?: {
  categorySlug?: string
}): Promise<Product[]> => {
  const payload = await getPayloadClient()

  const where: Where = { published: { equals: true } }

  if (opts?.categorySlug) {
    const cat = await payload.find({
      collection: 'categories',
      where: { slug: { equals: opts.categorySlug } },
      limit: 1,
      depth: 0,
    })
    if (cat.docs.length === 0) return []
    where.category = { equals: cat.docs[0].id }
  }

  const res = await payload.find({
    collection: 'products',
    where,
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
    depth: 2,
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
