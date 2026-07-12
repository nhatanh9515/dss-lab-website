import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-content flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="font-heading text-5xl font-semibold tracking-[3px] text-muted-3">
        404
      </div>
      <h1 className="font-heading text-xl font-medium">Không tìm thấy trang</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Trang hoặc sản phẩm bạn tìm không tồn tại hoặc đã được gỡ.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-pill bg-ink px-6 py-3 text-sm text-white transition-opacity hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </main>
  )
}
