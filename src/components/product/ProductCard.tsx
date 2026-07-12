import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/payload-types'
import { getImageUrl, getImageAlt } from '@/lib/format'
import { StockBadge } from './StockBadge'
import { Price } from './Price'

export function ProductCard({ product }: { product: Product }) {
  const firstImage = product.images?.[0]?.image
  const imageUrl = getImageUrl(firstImage, 'card')

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex flex-col gap-2 rounded-lg border border-line p-3 transition-shadow hover:shadow-sm"
    >
      <div className="relative aspect-square overflow-hidden rounded bg-surface">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={getImageAlt(firstImage) || product.title}
            fill
            sizes="(max-width: 768px) 50vw, 240px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted-3">
            Chưa có ảnh
          </div>
        )}
        <StockBadge status={product.stockStatus} className="absolute left-2 top-2" />
      </div>

      <h3 className="font-heading text-[15px] font-medium leading-snug text-ink line-clamp-2">
        {product.title}
      </h3>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <Price price={product.price} compareAtPrice={product.compareAtPrice} />
        <span className="whitespace-nowrap rounded-pill border border-ink px-3 py-1.5 text-[11px] text-ink">
          Chi tiết
        </span>
      </div>
    </Link>
  )
}
