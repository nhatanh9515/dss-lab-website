/**
 * Import danh mục + sản phẩm DSS HOMELAB từ bảng dữ liệu (Google Sheet).
 * XÓA toàn bộ sản phẩm & danh mục cũ rồi tạo mới.
 * KHÔNG đụng tới ảnh (media) — ảnh sẽ cập nhật sau.
 *
 * Chạy: npm run import:products
 */
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')
loadEnvConfig(process.cwd())

// ---- Helper tạo richText Lexical ------------------------------------------
const paragraph = (text: string) => ({
  type: 'paragraph',
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  textFormat: 0,
  children: [
    { type: 'text', format: 0, style: '', mode: 'normal', detail: 0, text, version: 1 },
  ],
})

const richFromParagraphs = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map(paragraph),
  },
})

/** Làm sạch text từ sheet (bỏ dấu \ escape, gộp khoảng trắng). */
const clean = (t: string) =>
  t
    .replace(/\\\./g, '.')
    .replace(/[ \t]+/g, ' ')
    .trim()

/** Tự tách 1 đoạn text dài thành nhiều paragraph: theo bullet • hoặc bước 1. 2. 3. */
const paragraphsOf = (text: string): string[] => {
  const c = clean(text)
  if (c.includes('•')) {
    return c
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => '• ' + s)
  }
  const steps = c
    .split(/(?=\b\d\.\s)/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (steps.length > 1) return steps
  return [c]
}

const richText = (text: string) => richFromParagraphs(paragraphsOf(text))
const richBenefits = (congDung: string, moTa: string) =>
  richFromParagraphs([clean(congDung), ...paragraphsOf(moTa)])

// ---- Dữ liệu danh mục ------------------------------------------------------
const categorySeed = [
  { name: 'Da mụn', slug: 'da-mun', sortOrder: 1 },
  { name: 'Da tăng sắc tố', slug: 'da-tang-sac-to', sortOrder: 2 },
  { name: 'Da lão hóa', slug: 'da-lao-hoa', sortOrder: 3 },
  { name: 'Da yếu', slug: 'da-yeu', sortOrder: 4 },
  { name: 'Da khô', slug: 'da-kho', sortOrder: 5 },
  { name: 'Mọi loại da', slug: 'moi-loai-da', sortOrder: 6 },
  { name: 'Da body', slug: 'da-body', sortOrder: 7 },
]

// ---- Dữ liệu sản phẩm ------------------------------------------------------
type P = {
  title: string
  short: string
  category: string
  congDung: string
  moTa: string
  hdsd: string
  thanhPhan: string
  luuY: string
  price: number
  volume: string
  published: boolean
  note?: string
}

const products: P[] = [
  {
    title: 'Spotless',
    short: 'Serum trị mụn chuyên sâu',
    category: 'Da mụn',
    congDung: 'Đặc trị mụn chuyên sâu (mụn ẩn – viêm – mủ – nang)',
    moTa: 'Serum đặc trị mụn nồng độ cao, kết hợp bộ 3 cơ chế: Tretinoin đẩy nhanh chu trình sừng hoá, làm thông thoáng lỗ chân lông và đẩy nhân mụn ẩn; Clindamycin phosphate kháng khuẩn, ức chế vi khuẩn gây mụn viêm – mủ – nang; Glycolic acid 5% + Salicylic acid 0.5% xử lý bề mặt, tan dầu thừa trong lỗ chân lông, làm mịn da sần sùi. Chiết xuất Hoàng bá (Oubaku) hỗ trợ kháng viêm, làm dịu. Sau liệu trình, da sạch mụn, bề mặt mịn màng và khoẻ hơn.',
    hdsd: 'Dùng BUỔI TỐI, trên da sạch và khô hoàn toàn (chờ 5–10 phút sau rửa mặt). 1. Lấy 2–3 giọt, thoa mỏng đều toàn mặt hoặc chỉ vùng có mụn. 2. Chờ 10–15 phút cho sản phẩm thấm, sau đó thoa kem dưỡng ẩm phục hồi (Ultrasilky). Tần suất: bắt đầu 2–3 tối/tuần, sau 2–3 tuần da quen thì tăng dần lên hằng đêm. BUỔI SÁNG bắt buộc dùng kem chống nắng SPF 30+.',
    thanhPhan: 'Alcohol denat 10.9%, Salicylic acid 0.5%, Clindamycin phosphate 1%, Oubaku Liquid B (CX Hoàng bá) 0.3%, HC trị mụn 1%, Glycolic acid 5%, Propylene glycol 50%, Butylene glycol 14%, PEG-7 10%, Tretinoin 0.1%, Water 5%, EHGP 1%, Potassium Hydroxide (KOH), Polymer tạo đặc 1.2%',
    luuY: '• Các phản ứng đỏ, khô, rát nhẹ, bong tróc là bình thường trong 2–4 tuần đầu và sẽ giảm dần khi da thích nghi. • Giai đoạn đầu có thể xảy ra hiện tượng đẩy mụn (purging). • KHÔNG dùng cho phụ nữ mang thai và cho con bú (chứa Tretinoin). • Bắt buộc dùng kem chống nắng ban ngày. • Không dùng chung cùng lúc với các sản phẩm chứa retinoid, BHA/AHA nồng độ cao khác hoặc benzoyl peroxide. • Tránh vùng mắt, khoé mũi, khoé miệng và vùng da đang tổn thương hở.',
    price: 1150000,
    volume: '30ml',
    published: true,
  },
  {
    title: 'Spotless Glow',
    short: 'Serum dưỡng dành cho da mụn',
    category: 'Da mụn',
    congDung: 'Serum dưỡng ẩm cho da mụn',
    moTa: 'Serum dưỡng ẩm cho da mụn. Bộ đôi AHA (Glycolic 4% + Lactic 3.52%) làm sạch tế bào chết, thông thoáng lỗ chân lông và làm sáng da; Salicylic acid 0.49% thấm sâu vào lỗ chân lông làm tan bã nhờn, xử lý mụn ẩn; Zinc PCA 1% kiểm soát dầu, giảm viêm; 4-Terpineol (hoạt chất chính của tràm trà) kháng khuẩn tự nhiên, hỗ trợ giảm mụn viêm – mụn mủ. Da được làm khoẻ, giảm viêm đỏ và ít tái phát mụn hơn.',
    hdsd: 'Dùng BUỔI TỐI trên da sạch, khô. 1. Lấy 2–3 giọt, thoa đều toàn mặt. 2. Chờ thấm 5–10 phút rồi thoa kem dưỡng ẩm. Tần suất: 3–4 tối/tuần trong 2 tuần đầu, sau đó có thể dùng hằng đêm. Có thể dùng luân phiên hoặc thay thế cho Spotless nếu da đang yếu. Ban ngày dùng kem chống nắng SPF 30+.',
    thanhPhan: 'Glycolic acid 4%, Lactic acid 3.52%, Zinc PCA 1%, Salicylic acid 0.49%, 4-Terpineol 0.12%',
    luuY: '• Có thể châm chích nhẹ trong 1–2 phút đầu khi thoa – là phản ứng bình thường của AHA/BHA. • Bắt buộc dùng kem chống nắng ban ngày (sản phẩm chứa AHA làm da nhạy cảm hơn với nắng). • Không dùng chung cùng lúc với sản phẩm tẩy da chết hoá học khác trong cùng buổi.',
    price: 850000,
    volume: '30g',
    published: true,
  },
  {
    title: 'Clay Sulfur',
    short: 'Drying lotion chấm mụn sưng viêm',
    category: 'Da mụn',
    congDung: 'Chấm mụn – gom cồi, làm khô nhân mụn',
    moTa: 'Sản phẩm chấm mụn tại chỗ dạng lắng (bột + dung dịch). Lưu huỳnh (Sulfur) 10% kháng khuẩn, hút dầu và làm khô cồi mụn; BHA biogenic 6% + Glycolic acid 5% làm tan bã nhờn, phá vỡ lớp sừng bịt miệng nang lông giúp nhân mụn nhanh trồi lên; Pink clay hút dầu thừa, làm dịu và giảm sưng. Hiệu quả với cả mụn ẩn (gom cồi) lẫn mụn viêm – mụn mủ (giảm sưng, thúc đẩy nhân mụn chín và tự rụng).',
    hdsd: 'Dùng BUỔI TỐI, sau bước serum hoặc dùng riêng trên nốt mụn. 1. KHÔNG lắc chai. Để sản phẩm lắng tự nhiên thành 2 lớp (bột trắng ở đáy + dung dịch phía trên). 2. Dùng tăm bông/dụng cụ chuyên dụng chấm thẳng xuống ĐÁY chai để lấy phần bột hoạt chất. 3. Chấm một lớp thật mỏng lên đúng nốt mụn, để qua đêm và rửa sạch vào sáng hôm sau. Dùng hằng đêm cho đến khi nốt mụn xẹp.',
    thanhPhan: 'Sulfur 10%, BHA biogenic 6%, Glycolic acid 5%, Pink clay',
    luuY: '• Sản phẩm để lại vệt trắng trên da – chỉ nên dùng buổi tối. • Không lắc chai trước khi dùng. • Chỉ chấm đúng nốt mụn, không thoa toàn mặt. • Khô hoặc bong da nhẹ tại vị trí chấm là phản ứng bình thường. • Không dùng trên vùng da tổn thương hở, vết thương hoặc mụn đã nặn còn chảy dịch.',
    price: 280000,
    volume: '10ml',
    published: true,
  },
  {
    title: 'Morning Glow',
    short: 'Serum dưỡng ẩm, phục hồi, dưỡng sáng da',
    category: 'Mọi loại da',
    congDung: 'Dưỡng ẩm – làm dịu – mờ thâm, chống oxy hoá',
    moTa: 'Serum dưỡng ban ngày dạng lỏng, thấm nhanh. Niacinamide 5% củng cố hàng rào bảo vệ da, kiểm soát dầu, làm mờ thâm và đều màu da; Tranexamic acid 3% ức chế con đường viêm gây tăng sắc tố, hiệu quả trên cả thâm đen (sau mụn) lẫn thâm đỏ; Pentavitine (Saccharide Isomerate) giữ ẩm sâu và bền tới 72 giờ; Aquaxyl tăng dự trữ nước, giảm mất nước qua da; Levansaccharide làm dịu, chống oxy hoá. Kết quả: da căng bóng, ngậm nước, giảm đỏ và sáng dần đều màu.',
    hdsd: 'Dùng BUỔI SÁNG (và có thể dùng thêm buổi tối) trên da sạch. 1. Lấy 2–3 giọt, thoa đều toàn mặt và cổ. 2. Vỗ nhẹ cho thấm, sau đó thoa kem dưỡng ẩm và kem chống nắng. Dùng hằng ngày.',
    thanhPhan: 'Niacinamide 5%, Tranexamic acid 3%, Pentavitine, Aquaxyl, Levansaccharide',
    luuY: '• Da rất nhạy cảm với Niacinamide có thể hơi châm nhẹ trong vài lần đầu – nên bắt đầu cách ngày. • Có thể dùng chung với hầu hết các sản phẩm khác trong routine.',
    price: 880000,
    volume: '30ml',
    published: true,
  },
  {
    title: 'Ultrasilky',
    short: 'Kem dưỡng ẩm cho da khô nẻ',
    category: 'Da khô',
    congDung: 'Kem dưỡng ẩm – phục hồi hàng rào bảo vệ da',
    moTa: 'Kem dưỡng kết cấu mềm mượt, không bết dính, chuyên phục hồi da sau khi dùng hoạt chất mạnh (Tretinoin, AHA/BHA, peel). Dầu Macadamia 10% + Jojoba 5% + Bơ hạt mỡ (Shea butter) tái tạo lớp lipid, khoá ẩm và làm mềm da; Levan + Beta glucan cấp ẩm sâu, làm dịu và hỗ trợ phục hồi; Bisabolol (hoạt chất từ hoa cúc La Mã) giảm kích ứng, giảm đỏ; Silk protein tạo lớp màng mượt, mịn; D-panthenol (B5) làm lành da; Vitamin E chống oxy hoá. Phù hợp mọi loại da, kể cả da mụn đang điều trị và da nhạy cảm.',
    hdsd: 'Dùng SÁNG và TỐI, ở bước cuối cùng của routine dưỡng. 1. Lấy một lượng bằng hạt đậu, chấm 5 điểm trên mặt. 2. Tán đều và vỗ nhẹ cho thấm. Dùng ngay sau các sản phẩm đặc trị (Spotless, Retinolift, Melanova...) để giảm khô và kích ứng.',
    thanhPhan: 'Water 73.3%, Macadamia nut oil 10%, Jojoba oil 5%, Montanov 202 5%, Stearic acid 0.5%, Cetyl alcohol 1%, Shea butter 0.5%, Euxyl PE9010 1%, Levan 0.5%, Beta glucan 1%, Bisabolol 0.5%, Silk protein 0.5%, D-panthenol 1%, Tocopherols (Vitamin E) 0.2%',
    luuY: '• Da dầu nhiều nên dùng lượng vừa phải (bằng hạt đậu) để tránh cảm giác nặng mặt.',
    price: 480000,
    volume: '50g',
    published: true,
  },
  {
    title: 'Melanova',
    short: 'Serum dưỡng sáng, mờ thâm, sạm, nám',
    category: 'Da tăng sắc tố',
    congDung: 'Đặc trị sắc tố – nám, tàn nhang, thâm mụn',
    moTa: 'Serum đặc trị tăng sắc tố nồng độ cao, tác động đa tầng vào quá trình hình thành melanin. Phenylethyl Resorcinol (Symwhite 377) là một trong những chất ức chế tyrosinase mạnh nhất hiện nay; Kojic Dipalmitate 5% (dạng ester ổn định của kojic acid) ức chế tyrosinase bền vững, ít kích ứng; THDA 1% – dẫn xuất Vitamin C tan trong dầu, thấm sâu, chống oxy hoá và làm sáng; Tranexamic acid 1% cắt tín hiệu viêm gây nám và thâm; Safflower Seed Oil Piperonyl Esters (Sepiwhite MSH) ức chế α-MSH – tín hiệu kích hoạt tế bào sắc tố; Lactic acid 3% tăng thẩm thấu và làm đều màu bề mặt. Hiệu quả trên nám, tàn nhang, sạm da, thâm sau mụn và da không đều màu.',
    hdsd: 'Dùng BUỔI TỐI trên da sạch, khô. 1. Lấy 2–3 giọt, thoa đều toàn mặt hoặc tập trung vùng nám/thâm. 2. Chờ thấm rồi thoa kem dưỡng ẩm. Dùng hằng đêm, kiên trì tối thiểu 8–12 tuần để thấy kết quả rõ rệt. BAN NGÀY BẮT BUỘC dùng kem chống nắng SPF 50+, thoa lại mỗi 2–3 giờ khi ra ngoài.',
    thanhPhan: 'Phenylethyl Resorcinol, Safflower Seed Oil Piperonyl Esters, Kojic Dipalmitate 5%, THDA 1%, Tranexamic acid 1%, Lactic acid 3%',
    luuY: '• Chống nắng là điều kiện BẮT BUỘC – không chống nắng kỹ thì mọi liệu trình trị nám đều thất bại và nám có thể đậm hơn. • Có thể châm nhẹ trong vài phút đầu. • Nên test trên vùng da nhỏ (sau tai/quai hàm) trước khi dùng toàn mặt. • Kết quả trên nám sâu (nám chân đinh) cần thời gian dài hơn và nên kết hợp thêm liệu trình chuyên sâu.',
    price: 1150000,
    volume: '30g',
    published: true,
  },
  {
    title: 'Milky Glow',
    short: 'Serum dưỡng sáng da body',
    category: 'Da tăng sắc tố',
    congDung: 'Dưỡng sáng da – dưỡng ẩm dạng nhũ tương',
    moTa: 'Serum dạng nhũ tương (milky) êm dịu, vừa dưỡng sáng vừa cấp ẩm nên phù hợp dùng thường xuyên và cho da khô/da hỗn hợp. Alpha-Arbutin 4% ức chế tyrosinase, làm mờ thâm và đều màu; Kojic Acid Dipalmitate 2% làm sáng bền vững, ổn định; THDA 1% (Vitamin C tan trong dầu) chống oxy hoá, làm sáng; Glycolic acid 5% tẩy tế bào chết bề mặt giúp da mịn và tăng hấp thu hoạt chất; Chiết xuất Cam thảo (Licorice) làm dịu và giảm đỏ; Hydrojel CGKC + Propanediol cấp ẩm; Dầu gai dầu (Hempseed) + Jojoba oil nuôi dưỡng, giữ mềm da. Kết quả: da sáng mịn, đều màu, không khô căng — đồng thời tăng hiệu quả cho các liệu trình điều trị sắc tố.',
    hdsd: 'Dùng BUỔI TỐI (hoặc buổi sáng nếu chống nắng kỹ) trên da sạch. 1. Lấy 2–3 giọt, thoa đều toàn mặt. 2. Chờ thấm rồi thoa kem dưỡng ẩm. Dùng hằng ngày. Có thể luân phiên với Melanova hoặc dùng làm bước dưỡng sáng duy trì sau liệu trình đặc trị. Ban ngày dùng kem chống nắng SPF 50+.',
    thanhPhan: 'Water 62.72%, Glycolic acid 5%, KOH, Kojic acid dipalmitate 2%, Alpha-Arbutin 4%, Euxyl PE 9010 1%, Kiribirth 0.5%, Stress Zero 0.5%, Licorice extract 0.5%, Hydrojel CGKC 3%, Propanediol 3%, Solagum AX 0.5%, Dekansil 3%, Hempseed oil 1%, Jojoba oil 3%, IPM 3%, THDA 1%, Tocopherols 0.2%, Hương hoa quả 0.08%, Simulgel SMS 88 6%',
    luuY: '• Sản phẩm chứa AHA – bắt buộc dùng kem chống nắng ban ngày. • Có mùi hương hoa quả nhẹ, người dị ứng hương liệu nên cân nhắc.',
    price: 1150000,
    volume: '30ml',
    published: true,
  },
  {
    title: 'Finewine',
    short: 'Serum retinol chống lão hóa, dưỡng da sáng mịn',
    category: 'Da lão hóa',
    congDung: 'Chống lão hoá – trẻ hoá và làm sáng da',
    moTa: 'Serum chống lão hoá cao cấp kết hợp trẻ hoá và dưỡng sáng. Retinol bọc liposome 1% – công nghệ liposome giải phóng chậm giúp đạt nồng độ cao mà giảm tối đa kích ứng; kích thích tăng sinh collagen, cải thiện nếp nhăn li ti và nếp nhăn động, làm dày và săn chắc da. Butyl Resorcinol – hoạt chất ức chế tyrosinase mạnh, làm mờ nám và đốm nâu; Kojic acid 2% + Tranexamic acid 2% + Niacinamide 5% tạo bộ ba dưỡng sáng đa cơ chế, đồng thời củng cố hàng rào bảo vệ da và giảm viêm. Phù hợp cho da từ 25+ có dấu hiệu lão hoá kèm không đều màu.',
    hdsd: 'Dùng BUỔI TỐI trên da sạch, khô. 1. Lấy 2–3 giọt, thoa đều toàn mặt và cổ, tránh vùng quanh mắt. 2. Chờ thấm 10 phút rồi thoa kem dưỡng ẩm phục hồi. Tần suất: 2 tối/tuần trong 2 tuần đầu → 3 tối/tuần → tăng dần theo khả năng dung nạp của da. Ban ngày bắt buộc dùng kem chống nắng SPF 50+.',
    thanhPhan: 'Retinol bọc liposome 1%, Butyl Resorcinol, Tranexamic acid 2%, Kojic acid 2%, Niacinamide 5%',
    luuY: '• KHÔNG dùng cho phụ nữ mang thai và cho con bú (chứa Retinol). • Có thể khô, bong nhẹ trong giai đoạn da thích nghi. • Không dùng chung cùng buổi với Tretinoin (Spotless, Retinolift) hoặc AHA/BHA nồng độ cao. • Bắt buộc dùng kem chống nắng.',
    price: 1150000,
    volume: '30ml',
    published: true,
  },
  {
    title: 'Peptide Defense',
    short: 'Kem phục hồi da đồng peptide nồng độ cao',
    category: 'Da yếu',
    congDung: 'Phục hồi – trẻ hoá, tăng sinh collagen',
    moTa: 'Serum phục hồi và trẻ hoá chuyên sâu, an toàn cho cả da nhạy cảm. Copper GHK Peptide 3% (đồng peptide) — tín hiệu tái tạo mạnh: kích thích tăng sinh collagen và elastin, tăng độ dày tầng biểu bì và trung bì, tăng độ ẩm trung bì, giúp da dày, đàn hồi và khoẻ hơn; đồng thời hỗ trợ làm lành tổn thương và giảm giãn mao mạch. Tranexamic acid 3% giảm đỏ, giảm viêm, mờ thâm; Niacinamide 5% củng cố hàng rào bảo vệ da; Beta glucan 1% làm dịu, cấp ẩm và tăng miễn dịch da. Lý tưởng cho da mỏng yếu, da sau điều trị mụn/laser/peel, da đỏ và giãn mạch.',
    hdsd: 'Dùng SÁNG và/hoặc TỐI trên da sạch. 1. Lấy 2–3 giọt, thoa đều toàn mặt. 2. Vỗ nhẹ cho thấm rồi thoa kem dưỡng ẩm. Dùng hằng ngày, liên tục tối thiểu 8–12 tuần. Có thể dùng xen kẽ ngày với các sản phẩm đặc trị mạnh để da phục hồi.',
    thanhPhan: 'Copper GHK Peptide 3%, Tranexamic acid 3%, Niacinamide 5%, Beta glucan 1%',
    luuY: '• KHÔNG thoa cùng lúc (cùng một lớp) với Vitamin C dạng L-AA nồng độ cao hoặc AHA/BHA nồng độ cao – nên tách sáng/tối hoặc cách nhau ít nhất 30 phút để tránh giảm hiệu quả của peptide đồng. • Sản phẩm có màu xanh lam đặc trưng của đồng peptide – đây là màu tự nhiên, không phải hư hỏng.',
    price: 2850000,
    volume: '30ml / 15ml',
    published: true,
    note: 'Giá 2 phiên bản: 2.850.000₫ (30ml) / 1.850.000₫ (15ml). Đang để giá 30ml.',
  },
  {
    title: 'Retinolift',
    short: 'Serum trẻ hóa, xử lý bề mặt da',
    category: 'Da lão hóa',
    congDung: 'Trẻ hoá da – xử lý bề mặt, chống lão hoá',
    moTa: "Serum trẻ hoá với Tretinoin 0.02% – nồng độ thấp, phù hợp cho người mới bắt đầu hoặc dùng duy trì lâu dài: đẩy nhanh tái tạo tế bào, kích thích tăng sinh collagen, làm mờ nếp nhăn, se khít lỗ chân lông và ngăn hình thành mụn ẩn. Glycolic acid 4% xử lý bề mặt, làm mịn và sáng da. Pseudoalteromonas Ferment Extract – peptide sinh học từ vi sinh vật biển Nam Cực, cấp ẩm mạnh, làm dịu và giảm kích ứng do Tretinoin. Chiết xuất Hoàng bá kháng viêm, làm dịu. Kết hợp cùng serum 'Huyền thoại biển xanh' cho hiệu quả trẻ hoá tối ưu và hỗ trợ tốt cho các liệu trình dưỡng trắng.",
    hdsd: 'Dùng BUỔI TỐI trên da sạch và khô hoàn toàn. 1. Lấy 2–3 giọt, thoa mỏng đều toàn mặt, tránh vùng mắt và khoé mũi/miệng. 2. Chờ 10–15 phút rồi thoa kem dưỡng ẩm phục hồi. Tần suất: 2–3 tối/tuần trong 2–3 tuần đầu, sau đó tăng dần lên hằng đêm. Ban ngày bắt buộc dùng kem chống nắng SPF 50+.',
    thanhPhan: 'Tretinoin 0.02%, Glycolic acid 4%, Pseudoalteromonas Ferment Extract, CX Hoàng bá',
    luuY: '• Các phản ứng đỏ, khô rát, bong tróc là bình thường trong thời gian đầu và sẽ giảm dần. • KHÔNG dùng cho phụ nữ mang thai và cho con bú (chứa Tretinoin). • Không dùng chung cùng buổi với Retinol (Finewine) hay Tretinoin nồng độ cao (Spotless). • Bắt buộc dùng kem chống nắng ban ngày.',
    price: 1650000,
    volume: '15ml',
    published: true,
  },
  {
    title: 'Peel Sweet Poison',
    short: 'Peel sáng da, giảm dày sừng & làm đều màu da',
    category: 'Da tăng sắc tố',
    congDung: 'Peel da – tẩy da chết chuyên sâu, làm sáng đều màu',
    moTa: 'Dung dịch peel nồng độ cao dùng theo liệu trình. Hỗn hợp AHAs 25% (Glycolic + Lactic + Mandelic acid) tác động 3 tầng: Glycolic thấm sâu tái tạo, Lactic cấp ẩm và làm sáng, Mandelic phân tử lớn thấm chậm nên dịu hơn và có tính kháng khuẩn – cùng nhau loại bỏ lớp sừng già cỗi, làm da mịn, căng bóng, thu nhỏ lỗ chân lông và ngăn ngừa mụn ẩn. Alpha-Arbutin 4% + Kojic acid 5% ức chế tyrosinase, làm mờ thâm, nám và đều màu da. Phytic acid 5% – AHA dịu nhẹ có tính chelate, làm sáng và chống oxy hoá. Hỗ trợ chống lão hoá và trẻ hoá bề mặt da.',
    hdsd: 'Sản phẩm PEEL – dùng theo liệu trình, KHÔNG dùng hằng ngày. 1. Rửa mặt sạch, lau khô hoàn toàn. 2. Dùng bông tẩy trang hoặc cọ thoa một lớp mỏng đều toàn mặt (tránh vùng mắt, môi, cánh mũi). 3. LẦN ĐẦU chỉ để 1–3 phút, sau đó rửa sạch với nước mát. Các lần sau tăng dần thời gian, tối đa 5–10 phút tuỳ khả năng dung nạp. 4. Sau khi rửa, thoa kem dưỡng phục hồi (Ultrasilky / Peptide Defense). Tần suất: 1 lần/1–2 tuần. Luôn thực hiện vào BUỔI TỐI.',
    thanhPhan: 'Hỗn hợp AHAs 25% (Glycolic acid, Lactic acid, Mandelic acid), Alpha-Arbutin 4%, Kojic acid 5%, Phytic acid 5%',
    luuY: '• BẮT BUỘC test trên vùng da nhỏ (quai hàm/sau tai) trước lần đầu sử dụng. • Cảm giác châm chích, nóng rát trong khi peel là bình thường – nếu rát nhiều, khó chịu thì rửa ngay lập tức. • Ngưng toàn bộ hoạt chất mạnh (Tretinoin, Retinol, BHA) ít nhất 3–5 ngày trước và sau khi peel. • Da sẽ bong nhẹ 2–4 ngày sau peel – KHÔNG bóc/cạy da. • Chống nắng SPF 50+ nghiêm ngặt trong ít nhất 2 tuần sau peel. • Không dùng khi da đang viêm nhiễm, tổn thương hở hoặc cháy nắng.',
    price: 980000,
    volume: '30ml',
    published: true,
  },
  {
    title: 'Mela Bleach',
    short: 'Kem dưỡng trắng sáng da body',
    category: 'Da body',
    congDung: 'Dưỡng trắng body chuyên sâu – vùng da sạm, thâm',
    moTa: 'Kem dưỡng trắng body nồng độ cao dạng nhũ tương, chuyên xử lý các vùng da sạm màu và thâm (nách, bẹn, khuỷu tay, đầu gối, lưng, mông) cũng như da toàn thân xỉn màu. Bộ acid mạnh Glycolic 8% + Lactic 4% + Phytic 4% loại bỏ lớp sừng dày sạm, làm mịn và tăng thẩm thấu hoạt chất. Bộ dưỡng trắng đa cơ chế: Alpha-Arbutin 4% + Kojic Dipalmitate 4% ức chế tyrosinase; THDA 0.5% (Vitamin C tan trong dầu) chống oxy hoá và làm sáng. Nền dầu cám gạo + bơ hạt mỡ dưỡng mềm, hạn chế khô căng dù nồng độ acid cao. Kết quả: da body sáng, mịn, đều màu rõ rệt sau liệu trình.',
    hdsd: 'Dùng BUỔI TỐI, trên vùng da body cần cải thiện. 1. Tắm sạch, lau khô người hoàn toàn. 2. Lấy lượng vừa đủ, thoa đều lên vùng da cần dưỡng trắng, massage nhẹ tới khi thấm. 3. Để qua đêm, sáng hôm sau rửa sạch. Tần suất: bắt đầu 2–3 tối/tuần, sau khi da quen có thể dùng hằng đêm. Ban ngày cần che chắn/chống nắng body ở vùng đã bôi khi ra ngoài.',
    thanhPhan: 'Water, Chất tạo đặc (gel) 3%, Propanediol 3%, Dekansil 4%, White oil 0.5%, Rice Bran Oil 3%, IPM 7.5%, Kojic acid dipalmitate 4%, Nhũ phụ 6%, Stearic acid 1%, Shea butter 0.4%, Glycolic acid 8%, Phytic acid 4%, Lactic acid 4%, KOH, Bột làm trắng 2%, Alpha-Arbutin 4%, THDA 0.5%, Geogard ECT 1%, Spectrastat PHL 1%, Kiribirth 0.5%, STZ-K 0.5%, Tocopherols 0.2%, Hương liệu 0.1%',
    luuY: '• CHỈ DÙNG CHO BODY – không dùng cho vùng mặt. • Nồng độ acid cao: bắt buộc test trên vùng da nhỏ trước khi dùng diện rộng. • Châm chích nhẹ khi mới thoa là bình thường; nếu rát nhiều thì rửa lại và giảm tần suất. • Không dùng ngay sau khi tẩy lông/cạo/wax hoặc trên da đang trầy xước. • Chống nắng/che chắn kỹ vùng da đã dùng. • Không dùng cho phụ nữ mang thai mà không hỏi ý kiến chuyên gia.',
    price: 0,
    volume: '',
    published: false,
    note: 'Sheet chưa có giá & dung tích → để ẩn (chưa hiển thị), chờ bổ sung giá.',
  },
  {
    title: 'Ultra Bright',
    short: 'Lotion dưỡng sáng da body bản duy trì',
    category: 'Da body',
    congDung: 'Dưỡng trắng body – kết cấu nhẹ, dùng hằng ngày',
    moTa: 'Kem dưỡng trắng body kết cấu mỏng nhẹ, thấm nhanh, không bết – phù hợp dùng duy trì hằng ngày hoặc cho da nhạy cảm hơn Mela Bleach. Glycolic acid 5% tẩy tế bào chết, làm mịn và sáng bề mặt; Alpha-Arbutin 2% + Kojic Dipalmitate 2% ức chế tyrosinase làm mờ thâm sạm; Tranexamic acid 1% cắt tín hiệu viêm gây tăng sắc tố (hiệu quả với thâm sau viêm, thâm do ma sát); THDA 0.5% chống oxy hoá, làm sáng; Chiết xuất Rau má (Centella) + Cam thảo (Licorice) làm dịu, giảm đỏ và hỗ trợ phục hồi; Cyclopentasiloxane tạo lớp finish mượt, khô thoáng.',
    hdsd: 'Dùng BUỔI TỐI (hoặc buổi sáng nếu có che chắn), sau khi tắm. 1. Lau khô da hoàn toàn. 2. Thoa đều lên toàn thân hoặc vùng cần làm sáng, massage nhẹ tới khi thấm. Dùng hằng ngày. Có thể dùng luân phiên với Mela Bleach: Mela Bleach cho giai đoạn tấn công, Ultra Bright cho giai đoạn duy trì.',
    thanhPhan: 'Water, EDTA 0.1%, Gel tạo đặc 3%, Propanediol 3%, Bột tạo đặc 0.5%, Cyclopentasiloxane 0.5%, Dekansil 2%, White oil 0.5%, Rice Bran Oil 2%, THDA 0.5%, IPM 4%, Simulgel SMS 88 7%, Glycolic acid 5%, Tranexamic acid 1%, KOH, Alpha-Arbutin 2%, Kojic dipalmitate 2%, Geogard ECT 1%, CX Rau má 0.5%, Licorice extract 0.5%, Tocopherols 0.2%',
    luuY: '• Chỉ dùng cho body. • Sản phẩm chứa AHA – nên che chắn/chống nắng vùng da đã thoa khi ra ngoài. • Không thoa lên da vừa cạo/wax lông hoặc da đang trầy xước.',
    price: 0,
    volume: '',
    published: false,
    note: 'Sheet chưa có giá & dung tích → để ẩn (chưa hiển thị), chờ bổ sung giá.',
  },
  {
    title: 'Butter Ủ Trắng',
    short: 'Butter dưỡng sáng, nuôi dưỡng da body cho da khô',
    category: 'Da body',
    congDung: 'Ủ trắng body – dưỡng sáng và nuôi dưỡng chuyên sâu',
    moTa: 'Kem ủ trắng body kết cấu butter giàu dưỡng chất, vừa làm sáng vừa nuôi dưỡng da mềm mượt – không chứa acid nên rất dịu, phù hợp cho da khô, da nhạy cảm và có thể dùng thường xuyên. Niacinamide 10% ức chế vận chuyển melanosome lên tế bào sừng, làm sáng và đều màu rõ rệt, đồng thời củng cố hàng rào bảo vệ da; Tranexamic acid 4% giảm thâm sau viêm và thâm do ma sát; THDA 1% (Vitamin C tan trong dầu) chống oxy hoá, làm sáng; Beta glucan 1% cấp ẩm, làm dịu và tăng phục hồi; Sữa ong (men ong) + Bơ hạt mỡ + Dầu Jojoba nuôi dưỡng sâu, giúp da mềm mượt; Titan paste cho hiệu ứng sáng tức thì ngay sau khi thoa.',
    hdsd: 'Dùng như một bước Ủ TRẮNG, buổi tối sau khi tắm. 1. Lau khô da hoàn toàn. 2. Thoa một lớp dày lên vùng da cần dưỡng trắng, massage nhẹ 1–2 phút. 3. Ủ trong 20–30 phút rồi rửa sạch với nước ấm — HOẶC thoa lớp mỏng và để qua đêm như kem dưỡng thường. Tần suất: 3–4 lần/tuần, hoặc hằng ngày với lớp mỏng. Có thể dùng sau Mela Bleach/Ultra Bright để bổ sung dưỡng ẩm.',
    thanhPhan: 'Water 53.3%, Propylene glycol 7%, HEC 1%, BMTS 3%, Olivem 1000 3%, Jojoba oil 5%, Silksoft 4.5%, Shea butter 0.5%, Titan paste 0.5%, Geogard ECT 1%, Vitamin E 0.2%, Men ong (sữa ong) 5%, Niacinamide 10%, Tranexamic acid 4%, Beta glucan 1%, THDA 1%',
    luuY: '• Chỉ dùng cho body. • Sản phẩm có Titan paste tạo hiệu ứng sáng tức thì – có thể để lại vệt trắng nhẹ trên quần áo, nên đợi thấm hẳn trước khi mặc đồ. • Nồng độ Niacinamide 10% có thể gây châm nhẹ với da rất nhạy cảm – nên test trước và bắt đầu với tần suất thấp. • Người dị ứng sản phẩm từ ong nên cân nhắc trước khi dùng.',
    price: 0,
    volume: '',
    published: false,
    note: 'Sheet chưa có giá & dung tích → để ẩn (chưa hiển thị), chờ bổ sung giá.',
  },
]

// ---- Chạy ------------------------------------------------------------------
const run = async () => {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('./payload.config'),
  ])
  const payload = await getPayload({ config })

  // 1) Xóa toàn bộ sản phẩm & danh mục cũ (KHÔNG đụng media)
  const oldProducts = await payload.find({ collection: 'products', limit: 1000, depth: 0 })
  for (const p of oldProducts.docs) {
    await payload.delete({ collection: 'products', id: p.id })
  }
  payload.logger.info(`🗑  Đã xóa ${oldProducts.docs.length} sản phẩm cũ`)

  const oldCats = await payload.find({ collection: 'categories', limit: 1000, depth: 0 })
  for (const c of oldCats.docs) {
    await payload.delete({ collection: 'categories', id: c.id })
  }
  payload.logger.info(`🗑  Đã xóa ${oldCats.docs.length} danh mục cũ`)

  // 2) Tạo danh mục
  const catIdByName: Record<string, number> = {}
  for (const cat of categorySeed) {
    const created = await payload.create({ collection: 'categories', data: cat })
    catIdByName[cat.name] = created.id as number
    payload.logger.info(`✓ Danh mục: ${cat.name}`)
  }

  // 3) Tạo sản phẩm
  let order = 1
  for (const p of products) {
    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        description: richText(p.short),
        benefits: richBenefits(p.congDung, p.moTa),
        ingredients: clean(p.thanhPhan),
        howToUse: richText(p.hdsd),
        cautions: richText(p.luuY),
        price: p.price,
        volume: p.volume || undefined,
        stock: 100,
        category: catIdByName[p.category],
        sortOrder: order,
        published: p.published,
        seo: {
          title: `${p.title} | DSS HOMELAB`,
          description: p.short,
        },
      },
    })
    payload.logger.info(
      `✓ SP ${order}: ${p.title}${p.published ? '' : ' (ẩn — thiếu giá)'}`,
    )
    order++
  }

  payload.logger.info('🎉 Import hoàn tất.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Import lỗi:', err)
  process.exit(1)
})
