import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/lib/queries'
import { getImageUrl, getImageAlt } from '@/lib/format'
import { Gallery, type GalleryImage } from '@/components/product/Gallery'
import { Price } from '@/components/product/Price'
import { StockBadge } from '@/components/product/StockBadge'
import { BuyButtons } from '@/components/product/BuyButtons'
import { ProductTabs } from '@/components/product/ProductTabs'
import { ProductGrid } from '@/components/product/ProductGrid'
import { RichTextBlock } from '@/components/RichTextBlock'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Không tìm thấy sản phẩm' }

  const ogUrl = getImageUrl(product.seo?.ogImage, 'og') || getImageUrl(product.images?.[0]?.image, 'og')

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || undefined,
    openGraph: ogUrl ? { images: [{ url: ogUrl }] } : undefined,
  }
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product, 4)

  const galleryImages = (product.images || [])
    .map((it): GalleryImage | null => {
      const url = getImageUrl(it.image, 'feature')
      return url ? { url, alt: getImageAlt(it.image) } : null
    })
    .filter((x): x is GalleryImage => x !== null)

  const isOutOfStock = product.stockStatus === 'out_of_stock'
  const category =
    typeof product.category === 'object' && product.category ? product.category : null

  return (
    <main className="mx-auto max-w-content px-4 py-5 md:px-9 md:py-7">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-muted-2">
        <Link href="/" className="hover:text-ink">
          Trang chủ
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/san-pham" className="hover:text-ink">
          Sản phẩm
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-[440px_1fr] md:gap-9">
        {/* Gallery */}
        <Gallery images={galleryImages} title={product.title} />

        {/* Thông tin */}
        <div className="flex flex-col gap-4">
          {category && (
            <Link
              href={`/san-pham?category=${category.slug}`}
              className="text-xs uppercase tracking-[1.5px] text-muted-2 hover:text-ink"
            >
              {category.name}
            </Link>
          )}

          <h1 className="font-heading text-2xl font-medium leading-tight md:text-3xl">
            {product.title}
          </h1>

          <div className="flex items-center gap-3">
            <Price
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size="lg"
            />
            <StockBadge status={product.stockStatus} />
          </div>

          {product.description && (
            <div className="text-sm leading-relaxed text-ink-soft [&_p]:mb-2">
              <RichTextBlock data={product.description} />
            </div>
          )}

          <div className="mt-1">
            <BuyButtons
              links={product.links}
              slug={product.slug!}
              isOutOfStock={isOutOfStock}
            />
          </div>

          {/* Tabs */}
          <div className="mt-3">
            <ProductTabs
              benefits={product.benefits}
              ingredients={product.ingredients}
              howToUse={product.howToUse}
            />
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-heading text-lg font-medium tracking-[2px]">
            CÓ THỂ BẠN SẼ THÍCH
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  )
}
