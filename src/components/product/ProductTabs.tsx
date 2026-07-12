'use client'

import { useState } from 'react'
import { RichTextBlock } from '@/components/RichTextBlock'

type Tab = {
  key: string
  label: string
  richText?: unknown
  text?: string | null
}

export function ProductTabs({
  benefits,
  ingredients,
  howToUse,
  cautions,
}: {
  benefits?: unknown
  ingredients?: string | null
  howToUse?: unknown
  cautions?: unknown
}) {
  const tabs: Tab[] = [
    { key: 'benefits', label: 'Công dụng', richText: benefits },
    { key: 'ingredients', label: 'Thành phần INCI', text: ingredients },
    { key: 'howToUse', label: 'HDSD', richText: howToUse },
    { key: 'cautions', label: 'Lưu ý', richText: cautions },
  ].filter((t) => (t.richText && typeof t.richText === 'object') || t.text)

  const [active, setActive] = useState(0)

  if (tabs.length === 0) return null

  const current = tabs[active]

  return (
    <div className="rounded-xl border border-line">
      {/* Tab headers */}
      <div className="flex gap-1 overflow-x-auto border-b border-line-subtle px-2">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(i)}
            className={`whitespace-nowrap px-4 py-3 text-[13px] font-medium tracking-[1px] transition-colors ${
              i === active
                ? 'border-b-2 border-ink text-ink'
                : 'border-b-2 border-transparent text-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Nội dung */}
      <div className="prose-sm px-5 py-5 text-sm leading-relaxed text-ink-soft [&_a]:text-brand-blue [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-ink [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-heading [&_h3]:text-ink [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-3 [&_ul]:mb-3">
        {current.text ? (
          <p className="whitespace-pre-line">{current.text}</p>
        ) : (
          <RichTextBlock data={current.richText} />
        )}
      </div>
    </div>
  )
}
