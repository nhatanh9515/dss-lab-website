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

/** Trích text thuần từ nội dung richText (Lexical) — dùng cho mô tả ngắn ở card. */
export const richTextToPlain = (data: unknown): string => {
  if (!data || typeof data !== 'object') return ''
  const root = (data as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { text?: string; children?: unknown[] }
    if (typeof n.text === 'string') return n.text
    if (Array.isArray(n.children)) return n.children.map(walk).join('')
    return ''
  }
  return root.children
    .map(walk)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
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
