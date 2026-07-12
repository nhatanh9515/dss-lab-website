'use client'

import { useState } from 'react'
import Image from 'next/image'

export type GalleryImage = { url: string; alt: string }

export function Gallery({
  images,
  title,
}: {
  images: GalleryImage[]
  title: string
}) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="grid aspect-square place-items-center rounded-lg bg-surface text-sm text-muted-3">
        Chưa có ảnh
      </div>
    )
  }

  const current = images[active] ?? images[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
        <Image
          src={current.url}
          alt={current.alt || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 440px"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded bg-surface ring-1 transition ${
                i === active ? 'ring-ink' : 'ring-transparent hover:ring-line-strong'
              }`}
              aria-label={`Ảnh ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
