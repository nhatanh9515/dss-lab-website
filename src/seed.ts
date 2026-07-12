/**
 * Script seed dữ liệu mẫu: 2 danh mục + 3 sản phẩm + 1 tài khoản admin.
 * Chạy: npm run seed
 *
 * Có thể chạy lại nhiều lần — script tự kiểm tra theo slug/email,
 * cái nào có rồi thì cập nhật, chưa có thì tạo mới.
 */
import { loadEnvConfig } from '@next/env'

// Nạp biến môi trường (.env) TRƯỚC khi import payload.config,
// vì config đọc process.env ngay khi được nạp.
loadEnvConfig(process.cwd())

const run = async () => {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('./payload.config'),
  ])

  const payload = await getPayload({ config })

  // ---- 1. Tài khoản admin -------------------------------------------------
  const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@dsshomelab.vn'
  const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'DssHomelab@2026'

  const existingAdmins = await payload.find({
    collection: 'users',
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  })
  if (existingAdmins.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: 'Quản trị viên' },
    })
    payload.logger.info(`✓ Đã tạo admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  } else {
    payload.logger.info(`• Admin ${ADMIN_EMAIL} đã tồn tại, bỏ qua.`)
  }

  // ---- 2. Danh mục --------------------------------------------------------
  const categorySeed = [
    { name: 'Chăm sóc da', slug: 'cham-soc-da', sortOrder: 1 },
    { name: 'Trang điểm', slug: 'trang-diem', sortOrder: 2 },
  ]

  const categoryIdBySlug: Record<string, number> = {}
  for (const cat of categorySeed) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      categoryIdBySlug[cat.slug] = existing.docs[0].id
      payload.logger.info(`• Danh mục "${cat.name}" đã có, bỏ qua.`)
    } else {
      const created = await payload.create({ collection: 'categories', data: cat })
      categoryIdBySlug[cat.slug] = created.id
      payload.logger.info(`✓ Đã tạo danh mục: ${cat.name}`)
    }
  }

  // ---- 3. Sản phẩm --------------------------------------------------------
  // stock được đặt để minh hoạ đủ 3 trạng thái: còn / sắp hết / hết hàng.
  const productSeed = [
    {
      title: 'Serum dưỡng sáng da Vitamin C',
      slug: 'serum-duong-sang-da-vitamin-c',
      price: 590000,
      compareAtPrice: 690000,
      stock: 25, // in_stock
      categorySlug: 'cham-soc-da',
      sortOrder: 1,
      published: true,
      links: {
        shopee: 'https://shopee.vn/dss-homelab',
        tiktok: 'https://www.tiktok.com/@dsshomelab',
        zalo: 'https://zalo.me/0900000000',
        facebook: 'https://facebook.com/dsshomelab',
        hotline: '0900000000',
      },
      seo: {
        title: 'Serum Vitamin C dưỡng sáng da | DSS HOMELAB',
        description: 'Serum Vitamin C giúp da sáng đều màu, mờ thâm sau 4 tuần.',
      },
    },
    {
      title: 'Kem dưỡng ẩm ban đêm',
      slug: 'kem-duong-am-ban-dem',
      price: 420000,
      stock: 3, // low_stock
      categorySlug: 'cham-soc-da',
      sortOrder: 2,
      published: true,
      links: {
        shopee: 'https://shopee.vn/dss-homelab',
        zalo: 'https://zalo.me/0900000000',
        hotline: '0900000000',
      },
      seo: {
        title: 'Kem dưỡng ẩm ban đêm | DSS HOMELAB',
        description: 'Phục hồi da ban đêm, khoá ẩm suốt 8 giờ.',
      },
    },
    {
      title: 'Son kem lì DSS matte',
      slug: 'son-kem-li-dss-matte',
      price: 180000,
      stock: 0, // out_of_stock
      categorySlug: 'trang-diem',
      sortOrder: 3,
      published: true,
      links: {
        tiktok: 'https://www.tiktok.com/@dsshomelab',
        facebook: 'https://facebook.com/dsshomelab',
      },
      seo: {
        title: 'Son kem lì DSS matte | DSS HOMELAB',
        description: 'Son kem lì lên màu chuẩn, mềm môi, lâu trôi.',
      },
    },
  ]

  for (const p of productSeed) {
    const { categorySlug, ...rest } = p
    const data = { ...rest, category: categoryIdBySlug[categorySlug] }

    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        data,
      })
      payload.logger.info(`• Sản phẩm "${p.title}" đã có, đã cập nhật.`)
    } else {
      await payload.create({ collection: 'products', data })
      payload.logger.info(`✓ Đã tạo sản phẩm: ${p.title}`)
    }
  }

  payload.logger.info('🎉 Seed hoàn tất.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed lỗi:', err)
  process.exit(1)
})
