/** URL gốc của website (dùng cho canonical, OG, sitemap). */
export const getBaseUrl = (): string => {
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  return url.replace(/\/$/, '')
}

export const SITE_NAME = 'DSS HOMELAB'
export const SITE_DESCRIPTION =
  'Mỹ phẩm chăm sóc da lành tính, an toàn cho làn da Việt.'
