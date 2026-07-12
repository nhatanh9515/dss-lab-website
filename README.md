# DSS HOMELAB — Website giới thiệu sản phẩm mỹ phẩm

Website catalogue sản phẩm mỹ phẩm (không giỏ hàng, không thanh toán). Khách xem
sản phẩm rồi bấm nút chuyển sang Shopee / TikTok Shop / Zalo / Facebook / Gọi điện.
Chủ shop tự quản lý sản phẩm qua trang quản trị (CMS).

## Công nghệ

- **Next.js 16** (App Router, TypeScript) — giao diện cho khách
- **Payload CMS 3** nhúng chung repo — trang quản trị ở `/admin`
- **Postgres (Neon)** — cơ sở dữ liệu
- **Cloudflare R2** — lưu ảnh sản phẩm
- **Tailwind CSS** — giao diện
- **Vercel** — hosting

---

## 1. Chạy trên máy (local)

Cần cài sẵn **Node.js 20 trở lên**.

```bash
# 1. Cài thư viện
npm install

# 2. Tạo file cấu hình từ mẫu rồi điền giá trị thật
cp .env.example .env
#    → mở .env, điền DATABASE_URI, PAYLOAD_SECRET, các biến R2...

# 3. (Lần đầu) nạp dữ liệu mẫu
npm run seed

# 4. Chạy web
npm run dev
```

- Web cho khách: http://localhost:3000
- Trang quản trị: http://localhost:3000/admin

### Các lệnh khác

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy chế độ phát triển (tự tải lại khi sửa) |
| `npm run build` | Build bản production (kiểm tra lỗi) |
| `npm run seed` | Nạp dữ liệu mẫu (1 admin + danh mục + sản phẩm) |
| `npm run import:products` | Nhập sản phẩm hàng loạt từ file `src/import-products.ts` |
| `npm run import:images` | Upload ảnh hàng loạt từ thư mục `Ảnh sản phẩm/` |
| `npm run generate:types` | Sinh lại kiểu TypeScript sau khi đổi collection |

> **Lưu ý về iCloud:** dự án nằm trong `~/Documents` (bị iCloud đồng bộ). Thư mục
> cache build dùng tên `.next.nosync` để iCloud bỏ qua, tránh chậm. Đừng đổi tên này.

---

## 2. Thêm / sửa sản phẩm (dành cho chủ shop)

Không cần biết code. Làm hết trong trang quản trị:

1. Vào **`/admin`**, đăng nhập.
2. Menu trái → **Sản phẩm** → **Create New** (tạo mới) hoặc bấm vào sản phẩm có sẵn để sửa.
3. Điền các trường:
   - **Tên sản phẩm**, **Mô tả ngắn** (hiện ở thẻ sản phẩm), **Mô tả / Công dụng / Thành phần / HDSD / Lưu ý** (các tab ở trang chi tiết).
   - **Giá bán**, **Giá gạch** (nếu giảm giá), **Dung tích**.
   - **Tồn kho**: gõ số lượng — hệ thống tự tính badge "Còn hàng / Sắp hết / Hết hàng"
     (0 = hết, ≤5 = sắp hết). **Số tồn kho không hiển thị ra web.**
   - **Danh mục**, **Ảnh sản phẩm** (kéo-thả nhiều ảnh, ảnh đầu là ảnh bìa).
   - **Link mua hàng**: dán link Shopee / TikTok / Zalo / Facebook / số hotline
     (không cần gõ `https://`, hệ thống tự thêm). Nút nào có link mới hiện ra.
   - **Hiển thị trên web**: tích vào thì sản phẩm mới xuất hiện.
4. Bấm **Save**. Web cập nhật ngay, không cần deploy lại.

**Cấu hình chung** (logo, hotline, banner trang chủ, mạng xã hội, nút liên hệ nổi,
chân trang): menu trái → **Cấu hình website**.

---

## 3. Sao lưu (backup) cơ sở dữ liệu

Dữ liệu (sản phẩm, cấu hình) nằm trên **Neon**. Ảnh nằm trên **Cloudflare R2**.

### Cách 1 — Neon tự động (khuyến nghị, không cần làm gì)
Neon tự giữ lịch sử thay đổi (Point-in-time restore). Vào dashboard Neon →
project → **Branches / Restore** để khôi phục về thời điểm trước.

### Cách 2 — Tự tải file backup định kỳ
Cần cài PostgreSQL client (có sẵn lệnh `pg_dump`). Lấy connection string ở Neon rồi:

```bash
pg_dump "postgresql://user:pass@host/dbname?sslmode=require" -Fc -f backup-2026-07.dump
```

Khôi phục khi cần:

```bash
pg_restore --clean --no-owner -d "postgresql://user:pass@host/dbname?sslmode=require" backup-2026-07.dump
```

> Nên backup trước mỗi lần thay đổi lớn. Đặt tên file kèm ngày để dễ tìm.

**Ảnh (R2):** ảnh đã upload nằm an toàn trên Cloudflare R2. Muốn backup thêm, dùng
công cụ như `rclone` để đồng bộ bucket về máy.

---

## 4. Deploy lên production

Xem hướng dẫn chi tiết từng bước trong **[DEPLOY.md](./DEPLOY.md)**:
push GitHub → import Vercel → điền biến môi trường → trỏ tên miền → kiểm tra sau deploy.

---

## Cấu trúc thư mục chính

```
src/
  app/(frontend)/     # Giao diện cho khách (trang chủ, chi tiết, giới thiệu, liên hệ)
  app/(payload)/      # Trang quản trị /admin + API
  app/sitemap.ts      # Tự sinh sitemap.xml
  app/robots.ts       # Tự sinh robots.txt
  collections/        # Định nghĩa dữ liệu: Products, Categories, Media, Users
  globals/            # SiteSettings (cấu hình website)
  components/         # Các thành phần giao diện
  lib/                # Hàm dùng chung (truy vấn dữ liệu, format...)
  payload.config.ts   # Cấu hình Payload CMS
```
