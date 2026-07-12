'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export function SearchBox({
  className = '',
  onSubmitted,
}: {
  className?: string
  onSubmitted?: () => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    router.push(q ? `/?q=${encodeURIComponent(q)}` : '/')
    onSubmitted?.()
  }

  return (
    <form
      onSubmit={submit}
      className={`flex items-center gap-2 rounded-pill border border-line-strong px-3 py-1.5 ${className}`}
    >
      <Search size={15} className="shrink-0 text-muted-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm sản phẩm…"
        className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-muted-3 focus:outline-none"
        aria-label="Tìm sản phẩm"
      />
    </form>
  )
}
