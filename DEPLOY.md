# Hướng dẫn đưa website lên production (Vercel)

Làm theo đúng thứ tự. Chỗ nào cần **bạn tự tay làm** đều ghi rõ.

---

## 0. Checklist biến môi trường (env) cho production

Đây là toàn bộ biến cần điền trên Vercel. Dấu ✅ = bắt buộc, ⚪ = tuỳ chọn.

| Biến | Bắt buộc | Lấy ở đâu / Ghi chú |
|---|:---:|---|
| `DATABASE_URI` | ✅ | Neon → **Connection string dạng POOLED** (host có `-pooler`). Xem mục 1. |
| `PAYLOAD_SECRET` | ✅ | Chuỗi bí mật ngẫu nhiên. **Tạo mới cho production** (xem mục 1). |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | URL production, vd `https://yourdomain.com` (hoặc link `.vercel.app` nếu chưa có domain). |
| `R2_BUCKET` | ✅ | Tên bucket R2 (đang dùng: `dss-homelab-media`). |
| `R2_ENDPOINT` | ✅ | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` (KHÔNG kèm tên bucket). |
| `R2_ACCESS_KEY_ID` | ✅ | R2 API token. |
| `R2_SECRET_ACCESS_KEY` | ✅ | R2 API token. |
| `R2_PUBLIC_URL` | ✅ | URL công khai của bucket, vd `https://pub-xxxx.r2.dev`. |
| `NEXT_PUBLIC_GA4_ID` | ⚪ | Mã GA4 `G-XXXX`. Trống thì không đo Google Analytics. |
| `NEXT_PUBLIC_META_PIXEL_ID` | ⚪ | Mã Meta Pixel (chuỗi số). Trống thì không đo Facebook. |

> Các biến `.env` trên máy đã có sẵn — bạn chỉ cần **copy y nguyên sang Vercel**,
> RIÊNG 3 biến sau phải chỉnh cho production:
> - `DATABASE_URI` → đổi sang chuỗi **pooled** của Neon.
> - `NEXT_PUBLIC_SERVER_URL` → đổi sang domain thật (không để `localhost`).
> - `PAYLOAD_SECRET` → nên tạo chuỗi mới (khác với máy local).

---

## 1. Chuẩn bị trước khi deploy (bạn tự làm)

### a) Lấy chuỗi kết nối Neon dạng POOLED
Trang serverless (Vercel) mở/đóng kết nối liên tục → phải dùng bản pooled để không tràn giới hạn.
1. Vào https://console.neon.tech → chọn project.
2. Nút **Connect** (góc phải) → ở ô connection string, **bật "Connection pooling"**.
3. Copy chuỗi (host sẽ có dạng `...-pooler.ap-southeast-1.aws.neon.tech`).
4. Đảm bảo cuối chuỗi có `?sslmode=verify-full`. Đây là giá trị dán vào `DATABASE_URI` trên Vercel.

### b) Tạo PAYLOAD_SECRET mới cho production
Mở Terminal, chạy lệnh này rồi copy kết quả:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### c) Cấu hình CORS cho bucket R2 (để upload ảnh trên /admin chạy được)
Website upload ảnh **thẳng từ trình duyệt lên R2** (tránh giới hạn dung lượng của Vercel),
nên bucket R2 phải cho phép domain của bạn gọi tới.
1. Vào Cloudflare → **R2** → chọn bucket → tab **Settings** → mục **CORS Policy** → **Edit / Add**.
2. Dán đoạn JSON sau (thay domain cho đúng — thêm cả link vercel.app tạm thời):
```json
[
  {
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://www.yourdomain.com",
      "https://ten-du-an.vercel.app"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```
3. Lưu lại. (Sau khi biết link `.vercel.app` thật ở bước 3, quay lại thêm vào đây.)

---

## 2. Push code lên GitHub (bạn tự làm)

1. Tạo repo mới **private** ở https://github.com/new (vd tên `dss-homelab`). **Không** tích thêm README/gitignore (repo đã có sẵn).
2. Ở Terminal, trong thư mục dự án, chạy (thay `<user>` bằng tài khoản GitHub của bạn):
```bash
git remote add origin https://github.com/<user>/dss-homelab.git
git push -u origin main
```
> Nếu bị hỏi đăng nhập: dùng GitHub CLI `gh auth login`, hoặc tạo Personal Access Token làm mật khẩu.
> File `.env` **không** bị đẩy lên (đã nằm trong `.gitignore`) — an toàn.

Kiểm tra: mở repo trên GitHub, thấy code là được.

---

## 3. Import vào Vercel & deploy (bạn tự làm)

1. Vào https://vercel.com → đăng nhập bằng GitHub.
2. **Add New… → Project** → chọn repo `dss-homelab` → **Import**.
3. Ở màn hình cấu hình:
   - **Framework Preset**: để Vercel tự nhận (Next.js).
   - **Build/Output**: **để mặc định**, không cần sửa.
   - Mở **Environment Variables** → thêm **từng biến** trong checklist mục 0
     (dán tên + giá trị). Nhớ dùng `DATABASE_URI` pooled và `NEXT_PUBLIC_SERVER_URL`
     là domain thật (nếu chưa có domain, tạm điền link `.vercel.app` — sẽ có sau bước deploy đầu).
4. Bấm **Deploy**. Chờ 2–5 phút.
5. Xong, Vercel cho một link dạng `https://ten-du-an.vercel.app`.
   - Nếu lúc nãy chưa biết link này để điền `NEXT_PUBLIC_SERVER_URL`: vào
     **Settings → Environment Variables**, sửa `NEXT_PUBLIC_SERVER_URL` thành link vừa nhận,
     rồi **Redeploy** (tab Deployments → dấu … → Redeploy).
   - Đồng thời thêm link `.vercel.app` này vào CORS của R2 (mục 1c).

---

## 4. Trỏ tên miền về Vercel (bạn tự làm)

> Thay `yourdomain.com` bằng tên miền thật của bạn. Nếu chưa mua tên miền, có thể
> bỏ qua bước này và dùng tạm link `.vercel.app`.

1. Trong Vercel: **Project → Settings → Domains** → gõ `yourdomain.com` → **Add**.
2. Vercel sẽ hiện các bản ghi DNS cần tạo. Đăng nhập vào **nhà cung cấp tên miền**
   (nơi bạn mua domain: Namecheap, GoDaddy, Mắt Bão, iNET…) → phần **DNS Management**,
   thêm các bản ghi:

   **Cho tên miền gốc (apex) `yourdomain.com`:**
   | Type | Name/Host | Value |
   |---|---|---|
   | A | `@` | `76.76.21.21` |

   **Cho `www.yourdomain.com`:**
   | Type | Name/Host | Value |
   |---|---|---|
   | CNAME | `www` | `cname.vercel-dns.com` |

   > ⚠️ Lấy giá trị **chính xác theo màn hình Vercel hiển thị** (đôi khi Vercel đưa IP/CNAME
   > khác) — con số ở trên là mặc định phổ biến của Vercel, nhưng luôn ưu tiên cái Vercel chỉ.
3. Lưu, chờ DNS cập nhật (vài phút đến vài giờ). Vercel tự cấp **HTTPS** (chứng chỉ SSL) khi domain đã trỏ đúng.
4. Sau khi domain chạy: quay lại **Vercel → Env** đổi `NEXT_PUBLIC_SERVER_URL` = `https://yourdomain.com`
   và thêm domain vào **CORS R2** (mục 1c) → **Redeploy**.

---

## 5. Kiểm tra sau khi deploy (làm cùng nhau)

Mở lần lượt và xác nhận:

- [ ] **Trang chủ** `https://yourdomain.com` — hiện sản phẩm, có ổ khoá **HTTPS** ở thanh địa chỉ.
- [ ] **Trang chi tiết** một sản phẩm — ảnh hiện đúng, nút mua bấm được.
- [ ] **`/admin`** — đăng nhập được bằng tài khoản admin (email/mật khẩu đã tạo).
- [ ] **Upload ảnh**: vào một sản phẩm trong /admin → thêm ảnh → **Save** → ảnh hiện lên
      (đây là bước kiểm tra R2 + CORS). Nếu lỗi upload → kiểm tra lại CORS R2 ở mục 1c.
- [ ] **`/sitemap.xml`** — mở được, thấy danh sách URL sản phẩm.
- [ ] **`/robots.txt`** — mở được, có dòng `Sitemap: https://yourdomain.com/sitemap.xml`.

> Nếu trang trắng / lỗi 500: vào **Vercel → Deployments → (bản mới nhất) → Logs** xem lỗi.
> Thường do thiếu env hoặc `DATABASE_URI` chưa dùng pooled.

---

## 6. Submit sitemap lên Google Search Console (bạn tự làm)

Giúp Google tìm và index sản phẩm nhanh hơn.

1. Vào https://search.google.com/search-console → **Add property**.
2. Chọn kiểu **URL prefix** → nhập `https://yourdomain.com` → **Continue**.
3. **Xác minh sở hữu** — cách dễ nhất:
   - Chọn phương thức **HTML tag**, copy đoạn `<meta name="google-site-verification" ...>`.
   - Gửi đoạn đó cho tôi (hoặc dán mã vào biến env) → tôi thêm vào website → bạn Redeploy → bấm Verify.
   - *(Hoặc)* nếu domain mua ở nhà cung cấp hỗ trợ, dùng phương thức **Domain / DNS TXT record**.
4. Xác minh xong → menu trái **Sitemaps** → ô "Add a new sitemap" gõ `sitemap.xml` → **Submit**.
5. Vài ngày sau kiểm tra mục **Pages** để xem Google đã index bao nhiêu trang.

> Gợi ý: khai báo thêm ở **Google Merchant / Business** nếu muốn sản phẩm lên Google Shopping —
> nhưng đó là bước nâng cao, làm sau cũng được.

---

## Tóm tắt việc BẠN cần chuẩn bị

1. Chuỗi Neon **pooled** (mục 1a).
2. `PAYLOAD_SECRET` mới (mục 1b).
3. Cấu hình **CORS R2** (mục 1c).
4. Tài khoản **GitHub** + **Vercel** (đăng nhập bằng GitHub cho nhanh).
5. (Tuỳ chọn) **Tên miền** đã mua + quyền vào DNS.
6. (Tuỳ chọn) Mã **GA4** và **Meta Pixel** nếu muốn đo lường.
