import { formatPrice } from '@/lib/format'

export function Price({
  price,
  compareAtPrice,
  className = '',
  size = 'md',
}: {
  price: number
  compareAtPrice?: number | null
  className?: string
  size?: 'md' | 'lg'
}) {
  const hasDiscount = compareAtPrice != null && compareAtPrice > price
  const priceCls = size === 'lg' ? 'text-2xl' : 'text-[15px]'

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`font-semibold text-ink ${priceCls}`}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-2 line-through">
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  )
}
