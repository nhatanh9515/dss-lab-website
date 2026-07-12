import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Người dùng', plural: 'Người dùng' },
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Hệ thống',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tên hiển thị',
    },
  ],
}
