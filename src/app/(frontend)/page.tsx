export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1000px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-heading text-3xl font-semibold tracking-[3px]">
        DSS HOMELAB
      </h1>
      <p className="text-ink-soft">
        Website đang được xây dựng. Phần giao diện cho khách sẽ làm ở sprint sau.
      </p>
      <a
        href="/admin"
        className="rounded-pill bg-ink px-6 py-3 text-sm text-white transition-opacity hover:opacity-90"
      >
        Vào trang quản trị →
      </a>
    </main>
  )
}
