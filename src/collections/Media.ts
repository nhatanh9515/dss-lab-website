import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Ảnh', plural: 'Thư viện ảnh' },
  admin: { group: 'Nội dung' },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Tự resize nhiều size khi upload (sharp xử lý, rồi đẩy lên R2)
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 640, position: 'centre' },
      { name: 'feature', width: 1024 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Mô tả ảnh (alt)',
      admin: { description: 'Giúp SEO và người khiếm thị. Nên điền ngắn gọn.' },
    },
  ],
}
