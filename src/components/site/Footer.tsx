import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'
import { NAV_LINKS } from './nav-links'
import { externalHref } from '@/lib/format'

export function Footer({ settings }: { settings: SiteSetting }) {
  const social = settings.social || {}
  const socialLinks = [
    { key: 'facebook', label: 'Facebook', href: externalHref(social.facebook) },
    { key: 'instagram', label: 'Instagram', href: externalHref(social.instagram) },
    { key: 'tiktok', label: 'TikTok', href: externalHref(social.tiktok) },
    { key: 'zalo', label: 'Zalo', href: externalHref(social.zalo) },
    { key: 'shopee', label: 'Shopee', href: externalHref(social.shopee) },
    { key: 'youtube', label: 'YouTube', href: externalHref(social.youtube) },
  ].filter((s) => s.href)

  const year = new Date().getFullYear()
  const tagline =
    settings.footer?.tagline ||
    'Mỹ phẩm chăm sóc da lành tính, an toàn cho làn da Việt.'
  const copyright = settings.footer?.copyright || `${year} © DSS HOMELAB`

  return (
    <footer className="mt-16 border-t border-line-subtle bg-bg">
      <div className="mx-auto max-w-content px-4 py-10 md:px-9">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="font-heading text-lg font-semibold tracking-[3px]">
              DSS HOMELAB
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {tagline}
            </p>
            {settings.hotline && (
              <p className="mt-3 text-sm text-ink-soft">
                Hotline:{' '}
                <a href={`tel:${settings.hotline}`} className="text-ink">
                  {settings.hotline}
                </a>
              </p>
            )}
          </div>

          {/* Menu */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[1.5px] text-muted">
              Danh mục
            </div>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          {socialLinks.length > 0 && (
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[1.5px] text-muted">
                Kết nối
              </div>
              <ul className="flex flex-col gap-2">
                {socialLinks.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-xs text-muted-2">
          {copyright}
        </div>
      </div>
    </footer>
  )
}
