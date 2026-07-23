import type { CollectionConfig } from 'payload'
import { isFinance, isSuperAdmin } from '../access'
import { validatePan, validatePhone, validateUrl } from '../fields/validators'
import { clearHiddenFields } from '../hooks/clearHiddenFields'
import { generateReceipt } from '../hooks/generateReceipt'
import { updateRaisedAmount } from '../hooks/updateRaisedAmount'
import { APIError } from 'payload'


type DonationData = { frequency?: string }

export const Donations: CollectionConfig = {
  slug: 'donations',
  labels: {
    singular: 'Donation',
    plural: 'Donations',
  },
  admin: {
    useAsTitle: 'receiptNumber',
    defaultColumns: ['donorName', 'amount', 'frequency', 'internalStatus', 'createdAt'],
    group: 'Finance',
    description:
      'Written by the donation API. Manual entries here are only for reconciling an offline UPI or bank transfer.',
  },
  access: {
    read: isFinance,
    create: isFinance,
    update: isFinance,
    delete: isSuperAdmin, // financial records — deletion kept tighter than everyday edits
  },
  timestamps: true,
   hooks: {
    beforeChange: [
      clearHiddenFields<DonationData>({
        subscriptionId: (d) => d.frequency === 'monthly',
      }),
      generateReceipt,
    ],
    afterChange: [updateRaisedAmount],
  },

    endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        const isAuthorized =
          req.user?.roles?.includes('finance') || req.user?.roles?.includes('super-admin')

        if (!isAuthorized) {
          throw new APIError('Unauthorized.', 401)
        }

        const url = new URL(req.url)
        const from = url.searchParams.get('from')
        const to = url.searchParams.get('to')

        const where: Record<string, unknown> = { internalStatus: { equals: 'success' } }
        if (from || to) {
          where.createdAt = {
            ...(from ? { greater_than_equal: from } : {}),
            ...(to ? { less_than_equal: `${to}T23:59:59.999Z` } : {}),
          }
        }

        const result = await req.payload.find({
          collection: 'donations',
          where,
          limit: 0,
          depth: 1,
          sort: 'createdAt',
          overrideAccess: true,
        })

        const header = [
          'Receipt Number', 'Date', 'Donor Name', 'Email', 'Phone', 'PAN',
          'Amount', 'Frequency', 'Campaign', 'Project', 'Gateway', 'Gateway Txn ID',
        ]

        const escapeCsv = (value: unknown): string => {
          const str = value === null || value === undefined ? '' : String(value)
          return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
        }

        const rows = result.docs.map((d) => [
          d.receiptNumber ?? '',
          new Date(d.createdAt).toLocaleDateString('en-IN'),
          d.donorName,
          d.email,
          d.phone,
          d.pan ?? '',
          d.amount,
          d.frequency,
          typeof d.campaign === 'object' ? d.campaign?.title : '',
          typeof d.project === 'object' ? d.project?.title : '',
          d.gateway,
          d.gatewayTxnId ?? '',
        ])

        const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')

        return new Response(csv, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="donations-${from ?? 'all'}-${to ?? 'all'}.csv"`,
          },
        })
      },
    },
  ],


  fields: [
    // ---- Donor ----
    { name: 'donorName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true, validate: validatePhone },
    {
      name: 'pan',
      type: 'text',
      label: 'PAN',
      validate: validatePan,
      admin: { description: 'Optional — required only if the donor wants an 80G receipt.' },
    },
    {
      name: 'address',
      type: 'textarea',
      admin: { custom: { multiline: true } }, // keeps line breaks, opts out of sanitizePlainText
    },

    // ---- Donation ----
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 100,
      admin: {
        description:
          'In rupees. This min is a UI guard only — the donate API independently rejects anything below ₹100 server-side (spec §7).',
      },
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'INR',
      options: [{ label: 'INR', value: 'INR' }],
    },
    {
      name: 'frequency',
      type: 'select',
      required: true,
      defaultValue: 'one-time',
      options: [
        { label: 'One-time', value: 'one-time' },
        { label: 'Monthly', value: 'monthly' },
      ],
    },
    {
      name: 'subscriptionId',
      type: 'text',
      label: 'Gateway Subscription/Mandate ID',
      admin: {
        condition: (_, siblingData) => siblingData?.frequency === 'monthly',
        description: 'Set when a monthly mandate is created. Links to the matching row in Subscriptions.',
      },
    },
    { name: 'campaign', type: 'relationship', relationTo: 'campaigns' },
    { name: 'project', type: 'relationship', relationTo: 'projects' },

    // ---- Gateway ----
    {
      name: 'gateway',
      type: 'select',
      required: true,
      options: [
        { label: 'PayU', value: 'payu' },
        { label: 'Razorpay', value: 'razorpay' },
        { label: 'Manual UPI / Bank transfer', value: 'upi-manual' },
      ],
    },
    {
      name: 'gatewayTxnId',
      type: 'text',
      label: 'Gateway Transaction ID',
      unique: true,
      index: true,
      admin: {
        description:
          'Used by the webhook to detect and ignore duplicate retries (spec §7 idempotency rule). Blank until the gateway assigns one.',
      },
    },
    {
      name: 'gatewayStatus',
      type: 'text',
      admin: { description: 'Raw status string as returned by the gateway — for support/debugging, never shown to donors.' },
    },
    {
      name: 'internalStatus',
      type: 'select',
      required: true,
      defaultValue: 'initiated',
      options: [
        { label: 'Initiated', value: 'initiated' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description:
          'The only status the rest of the system trusts. Set by the verified webhook — never by the redirect URL (spec §7).',
      },
    },

    // ---- Receipt (system-generated — Phase 3 automation hooks fill these) ----
    {
      name: 'receiptNumber',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Auto-generated (e.g. ODH/2026-27/0001) once Internal Status becomes Success.',
      },
    },
    {
      name: 'receiptPdfUrl',
      type: 'text',
      label: 'Receipt PDF URL',
      validate: validateUrl,
      admin: { readOnly: true, position: 'sidebar', description: 'Set automatically once the receipt PDF is generated.' },
    },

    // ---- Consent ----
    {
      name: 'consent',
      type: 'group',
      fields: [
        { name: 'termsAccepted', type: 'checkbox', required: true, defaultValue: false },
        { name: 'contactPermission', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
