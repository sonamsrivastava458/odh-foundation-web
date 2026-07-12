import type { CollectionConfig } from 'payload'
import { isSuperAdmin, isSuperAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles'],
  },
  auth: true,
  access: {
    // sirf super-admin naye admin bana / delete / list kar sake
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isSuperAdmin,
    // update: super-admin sabko, warna user sirf apni id edit kar sake
    update: ({ req: { user } }) => {
      if (user?.roles?.includes('super-admin')) return true
      return { id: { equals: user?.id } } // ye ek "filter query" hai
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Finance', value: 'finance' },
      ],
      saveToJWT: true,
      // field-level: roles ko sirf super-admin badal sake
      // (taaki editor khud ko super-admin na bana le)
      access: {
        update: isSuperAdminField,
      },
    },
  ],
}
