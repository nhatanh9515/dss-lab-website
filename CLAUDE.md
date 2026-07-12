# DỰ ÁN: Website giới thiệu sản phẩm mỹ phẩm DSS HOMELAB

## Mục tiêu
Website catalogue sản phẩm. KHÔNG có giỏ hàng, KHÔNG thanh toán.
Khách xem sản phẩm -> bấm nút chuyển sang Shopee / TikTok Shop / Zalo / Facebook / Gọi điện.
Có CMS để chủ shop tự CRUD sản phẩm.

## Stack (KHÔNG được đổi nếu không hỏi tôi)
- Next.js (App Router, TypeScript)
- Payload CMS 3 nhúng chung repo (route /admin)
- Database: Postgres (Neon)
- Storage ảnh: Cloudflare R2
- UI: Tailwind + shadcn/ui
- Deploy: Vercel

## Design system
Phong cách: tối giản (minimal), nền trắng, nhiều khoảng trắng, điểm nhấn xanh pastel.
Trích từ bản hi-fi trong wireframe (trắng / xám #F2F2F2 / xanh nhạt #EFF9FF).
Mọi màu/font phải khai báo thành CSS variable trong globals.css + tailwind config.
KHÔNG hardcode màu trong component.

### Font
- Heading / tiêu đề / logo / giá tiền: **Jost** (weight 500, 600). Tiêu đề section viết HOA + letter-spacing 2–3px.
- Body / mô tả / nút / text thường: **Mulish** (weight 300–600).
- Nạp qua `next/font/google`. Fallback: `system-ui, sans-serif`.

### Bảng màu (CSS variables đặt trong globals.css)
Nền & bề mặt
- `--bg`            #FFFFFF   (nền trang, nền card)
- `--surface`      #F2F2F2   (nền ảnh placeholder / vùng trung tính)
- `--accent`       #EFF9FF   (xanh pastel: thanh khuyến mãi, nền hero, nút Zalo, chip nổi bật)
- `--accent-strong`#E6F3FD   (xanh đậm hơn 1 nấc, dùng cho hover/hoạ tiết)

Chữ
- `--ink`          #1A1A1A   (chữ chính + nền nút primary)
- `--ink-soft`     #666666   (mô tả, đoạn văn phụ)
- `--muted`        #888888   (chú thích)
- `--muted-2`      #999999   ("Xem tất cả", breadcrumb, caption mờ)
- `--muted-3`      #AAAAAA   (placeholder input, text rất mờ)

Viền & đường kẻ
- `--border`       #E4E4E4   (viền card sản phẩm)
- `--border-strong`#D9D9D9   (viền input, nút icon tròn)
- `--border-subtle`#EEEEEE   (đường kẻ ngăn trong accordion)

Link / chữ tương tác
- `--brand-blue`      #2A78D6
- `--brand-blue-hover`#1A5CB0

### Màu badge tình trạng kho (stockStatus) — bắt buộc, KHÔNG hiện số tồn
Suy ra từ bộ pastel của wireframe, khai thành variable:
- Còn hàng:     nền `--badge-in`  #D9ECD9, chữ #2F6B3D
- Sắp hết hàng: nền `--badge-low` #FBE8C8, chữ #8A5A12
- Hết hàng:     nền `--badge-out` #F2F2F2, chữ #999999

### Màu thương hiệu nút mua (khai thành variable, KHÔNG hardcode)
Đây là màu chính thức của từng kênh, dùng cho icon/viền nút:
- `--shopee`   #EE4D2D
- `--tiktok`   #000000
- `--zalo`     #0068FF  (nhưng nút Zalo trong UI dùng nền `--accent` #EFF9FF cho nhã)
- `--facebook` #1877F2
- `--call`     #1A1A1A  (dùng `--ink`)

### Bo góc (radius)
- `--radius-sm`  10px  (thumbnail ảnh)
- `--radius`     12px  (card nhỏ, popover, ô liên hệ)
- `--radius-lg`  14px  (card sản phẩm, hero, banner)
- `--radius-xl`  16px  (container lớn / khối chính)
- `--radius-pill`22px  (nút CTA dạng viên thuốc)
- Nút icon / avatar: bo tròn 50% (`rounded-full`)

### Đổ bóng (shadow)
- `--shadow-sm`  0 1px 3px rgba(0,0,0,.06)    (card thường)
- `--shadow-md`  0 4px 12px rgba(0,0,0,.08)   (nút nổi quick-contact)
- `--shadow-lg`  0 6px 20px rgba(0,0,0,.07)   (card popover nổi trên ảnh)

### Spacing & layout
- Padding ngang khung nội dung: 36px (desktop) / 16–18px (mobile).
- Khoảng cách grid sản phẩm: gap 16px. Desktop 4 cột, mobile cuộn ngang hoặc 1–2 cột.
- Gap nội bộ trong card: 8px. Nhịp dọc giữa các section: 24–34px.
- Khung nội dung tối đa ~1000px, căn giữa.

### Style nút (button)
- **Primary / CTA** ("Mua ngay", "Liên hệ đặt hàng"): nền `--ink`, chữ trắng, `--radius-pill`,
  padding ~11px 24px, Mulish 14px, letter-spacing .3px, thường kèm mũi tên "→".
  Hover: giảm nhẹ độ đậm (opacity ~.9).
- **Secondary** ("Chi tiết", "Xem tất cả"): nền trong suốt, viền 1px `--ink`, chữ `--ink`,
  bo pill ~16px, cỡ 11.5–12px.
- **Accent / Zalo**: nền `--accent`, chữ `--ink`.
- **Nút icon tròn** (♡ yêu thích, mũi tên slider, nav): viền 1px `--border-strong`, tròn 50%,
  kích thước 28–46px, nền trắng.
- **Hàng nút liên hệ nhanh** (Gọi / Nhắn tin / Zalo): viền 1px `--border`, `--radius`,
  ô Zalo tô nền `--accent`.
- **Quick-contact nổi** (góc phải, cố định): các nút tròn 42–46px, nền trắng, `--shadow-md`,
  riêng Zalo nền `--accent`.

## Data model
Product: title, slug, images[], price, compareAtPrice?, stock(number),
se, category(rel), sortOrder, published(bool),
  links{shopee, tiktok, zalo, facebook, hotline}, seo{title, description, ogImage}
Category: name, slug, sortOrder
SiteSettings (global): logo, hotline, các link social, SEO mặc định, banner trang chủ

## Quy tắc bắt buộc
- Mobile-first. 80% traffic là mobile.
- KHÔNG hiển thị con số tồn kho ra frontend. Chỉ hiện badge theo stockStatus.
- Ngôn ngữ giao diện: tiếng Việt.
- Mọi nút mua hàng phải bắn GA4 event: click_shopee / click_tiktok / click_zalo / click_facebook / click_call, kèm product slug.
- Sau mỗi tính năng: chạy `npm run build`, tự sửa hết lỗi, rồi git commit với message rõ ràng.
- Không tự cài thêm thư viện lớn nếu chưa hỏi tôi.
- Tôi là PM không biết code. Giải thích ngắn gọn bằng tiếng Việt, luôn nói rõ tôi cần tự tay làm gì (tạo tài khoản, lấy API key, dán biến môi trường...).

## Trạng thái
Sprint 1: ✅ HOÀN THÀNH (backend/CMS, chưa làm frontend cho khách)
- Next.js 16 + Payload 3.86 nhúng chung repo, admin ở /admin, adapter Postgres (Neon)
- Collections: Products, Categories, Media, Users; Global: SiteSettings
- stockStatus tự tính từ stock (readonly); slug tự sinh (bỏ dấu tiếng Việt), sửa tay được
- Upload ảnh lên Cloudflare R2 + resize 4 size (thumbnail/card/feature/og)
- Design tokens (globals.css + tailwind.config) theo mục Design system ở trên
- Đã thêm field `description` (richText) cho Product ngoài data model gốc
- Seed: 1 admin + 2 danh mục + 3 sản phẩm (npm run seed)

Sprint 2: ✅ HOÀN THÀNH (frontend cho khách, mobile-first)
- Lấy dữ liệu bằng Payload Local API trong server component (src/lib/queries.ts), không gọi REST
- Layout chung: Header (logo/menu/hotline + MobileNav drawer), Footer (brand/menu/social), nút Zalo+Call nổi góc phải
- Trang chủ (/): banner từ SiteSettings (có fallback), chip danh mục, grid SP nổi bật
- Danh sách (/san-pham): grid, lọc theo ?category=slug, sắp theo sortOrder
- Chi tiết (/san-pham/[slug]): gallery, giá + giá gạch, badge kho, mô tả, tabs Công dụng/Thành phần INCI/HDSD, khối nút mua, SP liên quan
- <BuyButtons/>: chỉ render nút có link; nút gọi dùng tel:; hết hàng → disable nút mua + hiện "Tạm hết hàng"; bắn GA4 event click_*
- Trang /gioi-thieu (tĩnh) và /lien-he (từ SiteSettings)
- Loading skeleton qua <Suspense> trong trang (KHÔNG dùng loading.tsx vì nó làm notFound() trả 200 thay vì 404), empty state, not-found (404 chuẩn)
- GA4 nạp qua NEXT_PUBLIC_GA4_ID (tuỳ chọn); thêm 3 field cho Product: benefits(richText), ingredients(textarea), howToUse(richText)
- LƯU Ý cho sprint sau: không đặt loading.tsx ở gốc (frontend) hay ở san-pham/ vì sẽ phá HTTP 404 của trang chi tiết

Sprint 3: ✅ HOÀN THÀNH (SEO + Analytics + tối ưu tốc độ)
- generateMetadata động mọi trang (title/description/OG/canonical), fallback SiteSettings; metadataBase
- sitemap.xml + robots.txt tự sinh từ Payload (src/app/sitemap.ts, robots.ts)
- JSON-LD: Organization (layout), Product (offers + availability map từ stockStatus), BreadcrumbList (trang chi tiết)
- Analytics: GA4 qua @next/third-parties + Meta Pixel (next/script); ID từ NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_META_PIXEL_ID
- Event click_shopee/tiktok/zalo/facebook/call kèm { channel, product_slug } cho cả GA4 và Meta Pixel
- Ảnh: next/image + sizes khắp nơi, priority cho banner/gallery hero, lazy dưới màn hình; CLS = 0
- Lighthouse mobile (bản production, cache ấm): Trang chủ perf 92-94, Chi tiết LCP 2.4s;
  SEO 100, a11y 94-96, best-practices 96. Dao động điểm perf local là do tải máy (Chrome nhiều tab),
  production trên Vercel (CDN) sẽ ổn định ≥90.
