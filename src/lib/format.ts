import type { Media } from '@/payload-types'

/** 590000 -> "590.000₫" */
export const formatPrice = (value?: number | null): string => {
  if (value == null) return ''
  return `${new Intl.NumberFormat('vi-VN').format(value)}₫`
}

type MediaLike = number | Media | null | undefined
type SizeName = 'thumbnail' | 'card' | 'feature' | 'og'

/** Lấy URL ảnh theo size mong muốn, có fallback về ảnh gốc. */
export const getImageUrl = (
  media: MediaLike,
  size: SizeName = 'card',
): string | null => {
  if (!media || typeof media !== 'object') return null
  const sized = media.sizes?.[size]?.url
  return sized || media.url || null
}

/** Lấy alt của ảnh (fallback rỗng). */
export const getImageAlt = (media: MediaLike): string => {
  if (!media || typeof media !== 'object') return ''
  return media.alt || ''
}

/** Kích thước gốc của ảnh (để dùng cho next/image khi cần). */
export const getImageDimensions = (
  media: MediaLike,
): { width: number; height: number } => {
  if (media && typeof media === 'object' && media.width && media.height) {
    return { width: media.width, height: media.height }
  }
  return { width: 800, height: 800 }
}
