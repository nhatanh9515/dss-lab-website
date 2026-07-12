import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Thư mục build cache.
  // - Trên máy (Documents bị iCloud đồng bộ): dùng ".next.nosync" — iCloud bỏ qua
  //   thư mục có đuôi .nosync, tránh việc iCloud liên tục upload cache gây treo dev.
  // - Trên Vercel/CI: giữ ".next" mặc định.
  distDir: process.env.VERCEL ? '.next' : '.next.nosync',
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
