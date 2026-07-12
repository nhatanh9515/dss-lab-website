import type { Config } from 'tailwindcss'

/*
 * Tailwind chỉ quét thư mục frontend — KHÔNG đụng vào admin của Payload.
 * Mọi màu/font/radius/shadow đều ánh xạ từ CSS variables trong globals.css.
 */
const config: Config = {
  content: [
    './src/app/(frontend)/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        accent: {
          DEFAULT: 'var(--accent)',
          strong: 'var(--accent-strong)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          2: 'var(--muted-2)',
          3: 'var(--muted-3)',
        },
        line: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          subtle: 'var(--border-subtle)',
        },
        brand: {
          blue: 'var(--brand-blue)',
          'blue-hover': 'var(--brand-blue-hover)',
        },
        badge: {
          in: 'var(--badge-in)',
          'in-text': 'var(--badge-in-text)',
          low: 'var(--badge-low)',
          'low-text': 'var(--badge-low-text)',
          out: 'var(--badge-out)',
          'out-text': 'var(--badge-out-text)',
        },
        channel: {
          shopee: 'var(--shopee)',
          tiktok: 'var(--tiktok)',
          zalo: 'var(--zalo)',
          facebook: 'var(--facebook)',
          call: 'var(--call)',
        },
      },
      fontFamily: {
        heading: ['var(--font-jost)', 'system-ui', 'sans-serif'],
        body: ['var(--font-mulish)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      maxWidth: {
        content: '1000px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
