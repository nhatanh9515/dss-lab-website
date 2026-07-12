import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import type { SiteSetting } from '@/payload-types'
import { getImageUrl } from '@/lib/format'
import { NAV_LINKS } from './nav-links'
import { MobileNav } from './MobileNav'
import { SearchBox } from './SearchBox'

export function Header({ settings }: { settings: SiteSetting }) {
  const logoUrl = getImageUrl(settings.logo, 'thumbnail')

  return (
    <header className="sticky top-0 z-40 border-b border-line-subtle bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center gap-3 px-4 md:gap-4 md:px-9">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="DSS HOMELAB"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-heading text-base font-semibold tracking-[2px] md:text-xl md:tracking-[3px]">
              DSS HOMELAB
            </span>
          )}
        </Link>

        {/* Desktop: menu + tìm kiếm bên phải */}
        <div className="ml-auto hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink transition-colors hover:text-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Suspense fallback={<div className="h-9 w-52" />}>
            <SearchBox className="w-52" />
          </Suspense>
        </div>

        {/* Mobile: ô tìm kiếm ở giữa + nút menu bên phải */}
        <div className="ml-auto flex flex-1 items-center gap-2 md:hidden">
          <Suspense fallback={<div className="h-9 flex-1" />}>
            <SearchBox className="flex-1" />
          </Suspense>
          <MobileNav hotline={settings.hotline} />
        </div>
      </div>
    </header>
  )
}
