import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Về thương hiệu mỹ phẩm DSS HOMELAB',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:px-9">
      <h1 className="font-heading text-2xl font-medium tracking-[2px] md:text-3xl">
        Về DSS HOMELAB
      </h1>

      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-ink-soft">
        <p>
          DSS HOMELAB là thương hiệu mỹ phẩm chăm sóc da hướng tới sự lành tính và
          an toàn cho làn da Việt. Chúng tôi chọn lọc bảng thành phần rõ ràng,
          minh bạch, phù hợp với khí hậu và đặc điểm da của người Việt.
        </p>
        <p>
          Mỗi sản phẩm đều được nghiên cứu để mang lại hiệu quả thật, dịu nhẹ và
          dễ sử dụng hằng ngày. Chúng tôi tin rằng chăm sóc da nên đơn giản, hiệu
          quả và bền vững.
        </p>
        <p>
          Cảm ơn bạn đã tin tưởng và đồng hành cùng DSS HOMELAB.
        </p>
      </div>
    </main>
  )
}
