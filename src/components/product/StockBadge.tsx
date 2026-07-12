import type { Product } from '@/payload-types'

const MAP: Record<
  NonNullable<Product['stockStatus']>,
  { label: string; cls: string }
> = {
  in_stock: { label: 'Còn hàng', cls: 'bg-badge-in text-badge-in-text' },
  low_stock: { label: 'Sắp hết hàng', cls: 'bg-badge-low text-badge-low-text' },
  out_of_stock: { label: 'Tạm hết hàng', cls: 'bg-badge-out text-badge-out-text' },
}

export function StockBadge({
  status,
  className = '',
}: {
  status?: Product['stockStatus']
  className?: string
}) {
  const item = MAP[status || 'in_stock']
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${item.cls} ${className}`}
    >
      {item.label}
    </span>
  )
}
