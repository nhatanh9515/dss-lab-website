import type { CollectionConfig } from 'payload'
import { formatSlugHook } from '../lib/formatSlug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Sản phẩm', plural: 'Sản phẩm' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'stockStatus', 'category', 'published'],
    group: 'Nội dung',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tên sản phẩm',
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      label: 'Đường dẫn (slug)',
      admin: {
        position: 'sidebar',
        description: 'Tự sinh từ tên, có thể sửa tay.',
      },
      hooks: {
        beforeValidate: [formatSlugHook('title')],
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Mô tả ngắn',
      admin: { description: 'Đoạn giới thiệu ngắn hiển thị gần tên sản phẩm.' },
    },
    {
      name: 'benefits',
      type: 'richText',
      label: 'Công dụng',
      admin: { description: 'Nội dung tab "Công dụng" ở trang chi tiết.' },
    },
    {
      name: 'ingredients',
      type: 'textarea',
      label: 'Thành phần (INCI)',
      admin: { description: 'Nội dung tab "Thành phần INCI". Liệt kê thành phần.' },
    },
    {
      name: 'howToUse',
      type: 'richText',
      label: 'Hướng dẫn sử dụng',
      admin: { description: 'Nội dung tab "HDSD" ở trang chi tiết.' },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Ảnh sản phẩm',
      labels: { singular: 'Ảnh', plural: 'Ảnh' },
      minRows: 0,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Giá bán (₫)',
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          min: 0,
          label: 'Giá gạch (₫)',
          admin: { description: 'Để trống nếu không giảm giá.' },
        },
      ],
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Tồn kho (số lượng)',
      admin: {
        description: 'Số này KHÔNG hiển thị ra web — chỉ dùng để tính trạng thái kho.',
      },
    },
    {
      name: 'stockStatus',
      type: 'select',
      label: 'Trạng thái kho',
      defaultValue: 'in_stock',
      options: [
        { label: 'Còn hàng', value: 'in_stock' },
        { label: 'Sắp hết hàng', value: 'low_stock' },
        { label: 'Hết hàng', value: 'out_of_stock' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Tự tính từ tồn kho: 0 = hết hàng, ≤5 = sắp hết, còn lại = còn hàng.',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const stock = Number(siblingData?.stock ?? 0)
            if (stock <= 0) return 'out_of_stock'
            if (stock <= 5) return 'low_stock'
            return 'in_stock'
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Danh mục',
      admin: { position: 'sidebar' },
    },
    {
      name: 'links',
      type: 'group',
      label: 'Link mua hàng',
      admin: {
        description: 'Tất cả đều không bắt buộc. Nút nào có link mới hiển thị ra web.',
      },
      fields: [
        { name: 'shopee', type: 'text', label: 'Shopee' },
        { name: 'tiktok', type: 'text', label: 'TikTok Shop' },
        { name: 'zalo', type: 'text', label: 'Zalo' },
        { name: 'facebook', type: 'text', label: 'Facebook' },
        { name: 'hotline', type: 'text', label: 'Hotline (số gọi điện)' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Tiêu đề SEO' },
        { name: 'description', type: 'textarea', label: 'Mô tả SEO' },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Ảnh chia sẻ mạng xã hội (OG)',
        },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Thứ tự sắp xếp',
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: 'Hiển thị trên web',
      admin: { position: 'sidebar' },
    },
  ],
}
