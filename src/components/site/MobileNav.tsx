'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { NAV_LINKS } from './nav-links'

export function MobileNav({ hotline }: { hotline?: string | null }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Khoá cuộn trang nền khi mở menu
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const overlay = (
    <div className="fixed inset-0 z-[60]">
      {/* Nền mờ */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />
      {/* Panel — nền trắng đục */}
      <nav className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-heading text-lg font-semibold tracking-[2px]">
            DSS HOMELAB
          </span>
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center text-ink"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded py-3 text-[15px] text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {hotline && (
          <a
            href={`tel:${hotline}`}
            className="mt-auto flex items-center gap-2 rounded-pill bg-accent px-4 py-3 text-sm font-medium text-ink"
          >
            <Phone size={16} /> {hotline}
          </a>
        )}
      </nav>
    </div>
  )

  return (
    <>
      <button
        type="button"
        aria-label="Mở menu"
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 shrink-0 place-items-center text-ink"
      >
        <Menu size={22} />
      </button>

      {mounted && open && createPortal(overlay, document.body)}
    </>
  )
}
