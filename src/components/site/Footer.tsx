import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'
import { NAV_LINKS } from './nav-links'

export function Footer({ settings }: { settings: SiteSetting }) {
  const social = settings.social || {}
  const socialLinks = [
    { key: 'facebook', label: 'Facebook', href: social.facebook },
    { key: 'instagram', label: 'Instagram', href: social.instagram },
    { key: 'tiktok', label: 'TikTok', href: social.tiktok },
    { key: 'zalo', label: 'Zalo', href: social.zalo },
    { key: 'shopee', label: 'Shopee', href: social.shopee },
    { key: 'youtube', label: 'YouTube', href: social.youtube },
  ].filter((s) => s.href)

  const year = new Date().getFullYear()

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
              Mỹ phẩm chăm sóc da lành tính, an toàn cho làn da Việt.
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
          {year} © DSS HOMELAB
        </div>
      </div>
    </footer>
  )
}
