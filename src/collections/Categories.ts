import type { CollectionConfig } from 'payload'
import { formatSlugHook } from '../lib/formatSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Danh mục', plural: 'Danh mục' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: 'Nội dung',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên danh mục',
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
        beforeValidate: [formatSlugHook('name')],
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Thứ tự sắp xếp',
      admin: { position: 'sidebar' },
    },
  ],
}
