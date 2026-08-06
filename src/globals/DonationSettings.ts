import type { GlobalConfig, Validate } from 'payload'
import { isPublic, isSuperAdmin } from '../access'

const onlyOneHighlight: Validate = (value) => {
  if (!Array.isArray(value)) return true

  const highlighted = value.filter(
    (row) => (row as { highlight?: boolean })?.highlight === true,
  )

  if (highlighted.length > 1) {
    return 'Only one amount can be marked as “most popular”.'
  }
  return true
}
export const DonationSettings: GlobalConfig = {
  slug: 'donation-settings',
  label: 'Donation Settings',

  admin: {
    group: 'Settings',
    description:
      'Global donation configuration such as payment gateway, receipts and recurring donation settings.',
  },

  access: {
    read: isPublic,
    update: isSuperAdmin,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        // ---------------- General ----------------
        {
          label: 'General',
          fields: [
            {
              name: 'minAmount',
              type: 'number',
              label: 'Global Minimum Donation (₹)',
              required: true,
              defaultValue: 100,
              min: 1,
              admin: {
                description:
                  'Donations below this amount are rejected for all campaigns.',
              },
            },

            // {
            //   name: 'allowMonthly',
            //   type: 'checkbox',
            //   label: 'Allow Monthly Donations',
            //   defaultValue: true,
            // },
          ],
        },

        // ---------------- Receipt ----------------
        {
          label: 'Receipt',
          fields: [
            {
              name: 'receipt',
              type: 'group',
              fields: [
                {
                  name: 'signatoryName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'signatoryRole',
                  type: 'text',
                },
                {
                  name: 'signatureImage',
                  type: 'upload',
                  relationTo: 'graphics',
                },
                {
                  name: 'statement80G',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },

        // ---------------- Payment Gateway ----------------
        {
          label: 'Gateway',
          fields: [
            {
              name: 'gatewayMode',
              type: 'select',
              required: true,
              defaultValue: 'test',
              options: [
                {
                  label: 'Test',
                  value: 'test',
                },
                {
                  label: 'Live',
                  value: 'live',
                },
              ],
            },

            {
              name: 'gateway',
              type: 'select',
              required: true,
              defaultValue: 'payu',
              options: [
                {
                  label: 'PayU',
                  value: 'payu',
                },
                {
                  label: 'Razorpay',
                  value: 'razorpay',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
