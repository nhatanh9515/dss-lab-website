/**
 * Upload ảnh sản phẩm từ thư mục "Ảnh sản phẩm" lên CMS (R2) và gán vào sản phẩm.
 *
 * Xử lý orientation: nhiều ảnh chụp điện thoại có cờ EXIF orientation bị sai
 * khiến ảnh nằm ngang khi hiển thị. Script chuẩn hoá bằng cách:
 *   - Bỏ cờ EXIF (không auto-rotate theo cờ), giữ pixel gốc.
 *   - Nếu ảnh gốc nằm ngang (rộng > cao) → xoay 90° theo chiều kim đồng hồ để về dọc.
 * Nhờ đó ảnh lưu lên đã đúng chiều và Payload không xoay lại (cờ đã bị bỏ).
 *
 * Chạy: npm run import:images
 */
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')
loadEnvConfig(process.cwd())

const IMG_DIR =
  '/Users/nhatanh/Documents/Coding Projects/Website DSS Homelab/Ảnh sản phẩm'

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

// slug sản phẩm -> nguồn ảnh (tên file hoặc tên thư mục trong IMG_DIR)
const imageMap: { slug: string; src: string }[] = [
  { slug: 'spotless', src: 'spotless.jpg' },
  { slug: 'spotless-glow', src: 'Spotless glow' },
  { slug: 'melanova', src: 'Melanova' },
  { slug: 'morning-glow', src: 'Morning glow' },
  { slug: 'ultrasilky', src: 'ultra silky.JPG' },
  { slug: 'milky-glow', src: 'milky glow.JPG' },
  { slug: 'finewine', src: 'finewine.jpg' },
  { slug: 'retinolift', src: 'retinolift.jpg' },
  { slug: 'peel-sweet-poison', src: 'sweet poison.JPG' },
  { slug: 'mela-bleach', src: 'mela bleach.jpg' },
  { slug: 'butter-u-trang', src: 'butter ủ trắng.jpg' },
]

/** Liệt kê file ảnh của một nguồn (file đơn hoặc thư mục), sắp thứ tự hợp lý. */
const resolveFiles = (src: string): string[] => {
  const abs = path.join(IMG_DIR, src)
  if (!fs.existsSync(abs)) return []
  if (fs.statSync(abs).isDirectory()) {
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

/** Chuẩn hoá chiều ảnh + bỏ EXIF orientation, trả buffer JPEG đã đúng chiều. */
const normalizeImage = async (filePath: string): Promise<Buffer> => {
  const input = fs.readFileSync(filePath)
  // metadata trả về kích thước pixel GỐC (chưa áp cờ EXIF)
  const meta = await sharp(input).metadata()
  const isLandscape = (meta.width ?? 0) > (meta.height ?? 0)
  let img = sharp(input) // KHÔNG .rotate() → bỏ qua cờ EXIF, giữ pixel gốc
  if (isLandscape) img = img.rotate(90) // ảnh ngang → xoay về dọc
  // toBuffer không kèm withMetadata => EXIF (gồm orientation) bị loại bỏ
  return img.jpeg({ quality: 90 }).toBuffer()
}

const run = async () => {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('./payload.config'),
  ])
  const payload = await getPayload({ config })

  for (const { slug, src } of imageMap) {
    const found = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const product = found.docs[0]
    if (!product) {
      payload.logger.warn(`• Không thấy SP "${slug}" — bỏ qua`)
      continue
    }

    const files = resolveFiles(src)
    if (files.length === 0) {
      payload.logger.warn(`• Không tìm thấy ảnh cho "${slug}" (nguồn: ${src})`)
      continue
    }

    // Xoá media cũ của sản phẩm để tránh rác (ảnh cũ sai chiều)
    const oldImages = (product.images || []) as { image?: number | { id: number } }[]
    for (const it of oldImages) {
      const id = typeof it.image === 'object' ? it.image?.id : it.image
      if (id) {
        try {
          await payload.delete({ collection: 'media', id })
        } catch {
          /* bỏ qua nếu đã bị xoá */
        }
      }
    }

    // Upload ảnh đã chuẩn hoá
    const imageIds: number[] = []
    let idx = 1
    for (const filePath of files) {
      const buffer = await normalizeImage(filePath)
      const media = await payload.create({
        collection: 'media',
        data: { alt: product.title },
        file: {
          data: buffer,
          mimetype: 'image/jpeg',
          name: `${slug}-${idx}.jpg`,
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
    payload.logger.info(`✓ ${product.title} — ${imageIds.length} ảnh (đã chuẩn hoá chiều)`)
  }

  payload.logger.info('🎉 Upload ảnh hoàn tất.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Upload ảnh lỗi:', err)
  process.exit(1)
})
