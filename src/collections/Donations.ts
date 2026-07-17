import type { CollectionConfig } from 'payload'
import { isFinance, isSuperAdmin } from '../access'
import { validatePan, validatePhone, validateUrl } from '../fields/validators'
import { clearHiddenFields } from '../hooks/clearHiddenFields'
import { generateReceipt } from '../hooks/generateReceipt'
import { updateRaisedAmount } from '../hooks/updateRaisedAmount'



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
