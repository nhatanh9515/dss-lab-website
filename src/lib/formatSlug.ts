import type { FieldHook } from 'payload'

/** Chuẩn hoá chuỗi tiếng Việt thành slug: bỏ dấu, thường hoá, nối bằng "-". */
export const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '') // bỏ dấu thanh
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')

/**
 * Field hook: nếu người dùng nhập slug tay thì chuẩn hoá slug đó,
 * còn không thì tự sinh từ field `fallback` (vd: title / name).
 */
export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return formatSlug(value)
    }

    if (operation === 'create' || !value) {
      const fallbackData = data?.[fallback]
      if (typeof fallbackData === 'string' && fallbackData.length > 0) {
        return formatSlug(fallbackData)
      }
    }

    return value
  }
