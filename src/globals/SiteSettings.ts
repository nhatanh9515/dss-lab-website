import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cấu hình website',
  admin: { group: 'Nội dung' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'hotline',
      type: 'text',
      label: 'Số hotline',
    },
    {
      name: 'social',
      type: 'group',
      label: 'Link mạng xã hội',
      fields: [
        { name: 'facebook', type: 'text', label: 'Facebook' },
        { name: 'instagram', type: 'text', label: 'Instagram' },
        { name: 'zalo', type: 'text', label: 'Zalo' },
        { name: 'tiktok', type: 'text', label: 'TikTok' },
        { name: 'shopee', type: 'text', label: 'Shopee' },
        { name: 'youtube', type: 'text', label: 'YouTube' },
      ],
    },
    {
      name: 'defaultSeo',
      type: 'group',
      label: 'SEO mặc định',
      fields: [
        { name: 'title', type: 'text', label: 'Tiêu đề mặc định' },
        { name: 'description', type: 'textarea', label: 'Mô tả mặc định' },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Ảnh chia sẻ mặc định (OG)',
        },
      ],
    },
    {
      name: 'floatingContact',
      type: 'group',
      label: 'Nút liên hệ nổi (góc phải màn hình)',
      admin: {
        description:
          'Chọn hiển thị nút nào. Tick "Hiện" và điền link/số tương ứng. Bỏ tick để ẩn.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'messengerEnabled',
              type: 'checkbox',
              label: 'Hiện Messenger',
              defaultValue: false,
            },
            {
              name: 'messengerUrl',
              type: 'text',
              label: 'Link Messenger (vd: https://m.me/tenpage)',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'zaloEnabled',
              type: 'checkbox',
              label: 'Hiện Zalo',
              defaultValue: true,
            },
            {
              name: 'zaloUrl',
              type: 'text',
              label: 'Link Zalo (vd: https://zalo.me/0900000000)',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'callEnabled',
              type: 'checkbox',
              label: 'Hiện Gọi điện',
              defaultValue: true,
            },
            {
              name: 'callPhone',
              type: 'text',
              label: 'Số điện thoại',
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Chân trang (Footer)',
      fields: [
        {
          name: 'tagline',
          type: 'textarea',
          label: 'Mô tả thương hiệu',
          defaultValue: 'Mỹ phẩm chăm sóc da lành tính, an toàn cho làn da Việt.',
          admin: { description: 'Dòng chữ dưới tên thương hiệu ở chân trang.' },
        },
        {
          name: 'copyright',
          type: 'text',
          label: 'Dòng bản quyền',
          admin: {
            description:
              'Để trống sẽ tự hiển thị "<năm hiện tại> © DSS HOMELAB". Nhập gì thì hiện đúng như vậy.',
          },
        },
      ],
    },
    {
      name: 'homeBanners',
      type: 'array',
      label: 'Banner trang chủ',
      labels: { singular: 'Banner', plural: 'Banner' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Ảnh banner',
        },
        { name: 'heading', type: 'text', label: 'Tiêu đề' },
        { name: 'subheading', type: 'text', label: 'Mô tả ngắn' },
        { name: 'link', type: 'text', label: 'Link khi bấm vào banner' },
      ],
    },
  ],
}
