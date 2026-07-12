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
    description: 'Preset amounts, impact cards, receipts and the payment gateway mode.',
  },
  access: {
    read: isPublic,
    update: isSuperAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Amounts',
          fields: [
            {
              name: 'presetAmounts',
              type: 'array',
              label: 'Suggested Amounts (₹)',
              required: true,
              minRows: 2,
              maxRows: 6,
                validate: onlyOneHighlight,     

              admin: {
                description: 'Shown as buttons on the donate page, in this order.',
              },
              fields: [
                { name: 'amount', type: 'number', required: true, min: 100 },
                {
                  name: 'highlight',
                  type: 'checkbox',
                  label: 'Mark as “most popular”',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'minAmount',
              type: 'number',
              label: 'Minimum Donation (₹)',
              required: true,
              defaultValue: 100,
              min: 100,
              admin: {
                description: 'Donations below this amount are rejected by the server.',
              },
            },
            {
              name: 'allowMonthly',
              type: 'checkbox',
              label: 'Allow monthly (recurring) donations',
              defaultValue: true,
            },
          ],
        },

        {
          label: 'Impact Cards',
          fields: [
            {
              name: 'impactCards',
              type: 'array',
              label: false,
              maxRows: 4,
              admin: {
                description:
                  'Shown beside the donation form, for example “₹500 = a school kit for one child”.',
              },
              fields: [
                { name: 'amount', type: 'number', required: true, min: 1 },
                {
                  name: 'description',
                  type: 'text',
                  required: true,
                  admin: { description: 'What this amount pays for.' },
                },
                { name: 'icon', type: 'upload', relationTo: 'graphics' },
              ],
            },
          ],
        },

        {
          label: 'Receipt',
          fields: [
            {
              name: 'receipt',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'signatoryName',
                  type: 'text',
                  required: true,
                  admin: { description: 'Name printed on the 80G receipt.' },
                },
                { name: 'signatoryRole', type: 'text' },
                {
                  name: 'signatureImage',
                  type: 'upload',
                  relationTo: 'graphics',
                  admin: { description: 'Scanned signature, transparent PNG.' },
                },
                {
                  name: 'statement80G',
                  type: 'textarea',
                  label: '80G Statement',
                  required: true,
                  admin: {
                    description:
                      'Legal text printed on every receipt, quoting the 80G registration.',
                  },
                },
              ],
            },
          ],
        },

        {
          label: 'Gateway',
          fields: [
            {
              name: 'gatewayMode',
              type: 'select',
              required: true,
              defaultValue: 'test',
              options: [
                { label: 'Test — no real money moves', value: 'test' },
                { label: 'Live — real donations are charged', value: 'live' },
              ],
              admin: {
                description:
                  'Switch to Live only after the full test checklist has passed. In Live mode every donation charges a real card.',
              },
            },
            {
              name: 'gateway',
              type: 'select',
              required: true,
              defaultValue: 'payu',
              options: [
                { label: 'PayU', value: 'payu' },
                { label: 'Razorpay', value: 'razorpay' },
              ],
              admin: {
                description: 'Which payment provider handles checkout.',
              },
            },
            {
              name: 'upiQr',
              type: 'upload',
              relationTo: 'graphics',
              label: 'UPI QR Code',
              admin: { description: 'For donors who prefer to transfer directly.' },
            },
          ],
        },
      ],
    },
  ],
}
