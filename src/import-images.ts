/**
 * Upload ảnh sản phẩm từ thư mục "Ảnh sản phẩm" lên CMS (R2) và gán vào sản phẩm.
 * - Ảnh đặt tên theo sản phẩm; sản phẩm nhiều ảnh để trong thư mục tên sản phẩm.
 * - Ảnh không khớp tên sản phẩm sẽ bị bỏ qua.
 * Đồng thời cập nhật giá + hiển thị cho 3 SP body vừa có giá trong sheet.
 *
 * Chạy: npm run import:images
 */
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')
loadEnvConfig(process.cwd())

const IMG_DIR =
  '/Users/nhatanh/Documents/Coding Projects/Website DSS Homelab/Ảnh sản phẩm'

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const mimeOf = (ext: string) =>
  ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'

// slug sản phẩm -> nguồn ảnh (tên file hoặc tên thư mục trong IMG_DIR)
const imageMap: { slug: string; src: string }[] = [
  { slug: 'spotless', src: 'spotless.jpg' },
  { slug: 'spotless-glow', src: 'Spotless glow' },
  { slug: 'melanova', src: 'Melanova' },
  { slug: 'milky-glow', src: 'milky glow.JPG' },
  { slug: 'finewine', src: 'finewine.jpg' },
  { slug: 'retinolift', src: 'retinolift.jpg' },
  { slug: 'peel-sweet-poison', src: 'sweet poison.JPG' },
  { slug: 'mela-bleach', src: 'power bleach.JPG' },
]

// Cập nhật giá + hiển thị cho 3 SP body (sheet đã bổ sung giá)
const priceUpdates: { slug: string; price: number }[] = [
  { slug: 'mela-bleach', price: 1950000 },
  { slug: 'ultra-bright', price: 1250000 },
  { slug: 'butter-u-trang', price: 1500000 },
]

/** Liệt kê file ảnh của một nguồn (file đơn hoặc thư mục), sắp thứ tự hợp lý. */
const resolveFiles = (src: string): string[] => {
  const abs = path.join(IMG_DIR, src)
  if (!fs.existsSync(abs)) return []
  const stat = fs.statSync(abs)
  if (stat.isDirectory()) {
    return fs
      .readdirSync(abs)
      .filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()))
      .sort((a, b) => {
        // File có tên riêng (không phải IMG_...) lên trước để làm ảnh bìa
        const ai = /^img[_\d]/i.test(a) ? 1 : 0
        const bi = /^img[_\d]/i.test(b) ? 1 : 0
        if (ai !== bi) return ai - bi
        return a.localeCompare(b)
      })
      .map((f) => path.join(abs, f))
  }
  if (IMG_EXT.has(path.extname(abs).toLowerCase())) return [abs]
  return []
}

const run = async () => {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('./payload.config'),
  ])
  const payload = await getPayload({ config })

  const findBySlug = async (slug: string) => {
    const r = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    return r.docs[0] ?? null
  }

  // 1) Cập nhật giá + hiển thị cho 3 SP body
  for (const u of priceUpdates) {
    const p = await findBySlug(u.slug)
    if (!p) {
      payload.logger.warn(`• Không thấy SP "${u.slug}" để cập nhật giá`)
      continue
    }
    await payload.update({
      collection: 'products',
      id: p.id,
      data: { price: u.price, published: true },
    })
    payload.logger.info(
      `✓ Giá: ${p.title} = ${u.price.toLocaleString('vi-VN')}₫ (đã hiện)`,
    )
  }

  // 2) Upload ảnh & gán vào sản phẩm
  for (const { slug, src } of imageMap) {
    const product = await findBySlug(slug)
    if (!product) {
      payload.logger.warn(`• Không thấy SP "${slug}" — bỏ qua ảnh`)
      continue
    }
    const files = resolveFiles(src)
    if (files.length === 0) {
      payload.logger.warn(`• Không tìm thấy ảnh cho "${slug}" (nguồn: ${src})`)
      continue
    }

    const imageIds: number[] = []
    let idx = 1
    for (const filePath of files) {
      const ext = path.extname(filePath).toLowerCase()
      const buffer = fs.readFileSync(filePath)
      const media = await payload.create({
        collection: 'media',
        data: { alt: product.title },
        file: {
          data: buffer,
          mimetype: mimeOf(ext),
          name: `${slug}-${idx}${ext === '.jpeg' ? '.jpg' : ext}`,
          size: buffer.length,
        },
      })
      imageIds.push(media.id as number)
      idx++
    }

    await payload.update({
      collection: 'products',
      id: product.id,
      data: { images: imageIds.map((id) => ({ image: id })) },
    })
    payload.logger.info(`✓ Ảnh: ${product.title} — ${imageIds.length} ảnh`)
  }

  payload.logger.info('🎉 Upload ảnh hoàn tất.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Upload ảnh lỗi:', err)
  process.exit(1)
})
