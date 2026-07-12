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
