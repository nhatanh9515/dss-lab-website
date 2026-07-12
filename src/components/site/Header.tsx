import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import type { SiteSetting } from '@/payload-types'
import { getImageUrl } from '@/lib/format'
import { NAV_LINKS } from './nav-links'
import { MobileNav } from './MobileNav'

export function Header({ settings }: { settings: SiteSetting }) {
  const logoUrl = getImageUrl(settings.logo, 'thumbnail')

  return (
    <header className="sticky top-0 z-40 border-b border-line-subtle bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center gap-4 px-4 md:px-9">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="DSS HOMELAB"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-heading text-lg font-semibold tracking-[3px] md:text-xl">
              DSS HOMELAB
            </span>
          )}
        </Link>

        {/* Menu desktop — căn trái, sát logo */}
        <nav className="ml-8 mr-auto hidden items-center gap-7 md:flex">
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

        {/* Hotline desktop */}
        {settings.hotline && (
          <a
            href={`tel:${settings.hotline}`}
            className="ml-auto hidden items-center gap-2 rounded-pill border border-line-strong px-4 py-2 text-sm text-ink md:flex"
          >
            <Phone size={15} /> {settings.hotline}
          </a>
        )}

        {/* Mobile: đẩy hamburger sang phải */}
        <div className="ml-auto md:hidden">
          <MobileNav hotline={settings.hotline} />
        </div>
      </div>
    </header>
  )
}
