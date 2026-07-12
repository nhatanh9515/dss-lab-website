import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép Next tối ưu ảnh phục vụ từ Cloudflare R2 (public bucket)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
}

export default withPayload(nextConfig)
