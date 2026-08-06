import type { GlobalConfig } from 'payload'
import { isPublic, isSuperAdmin } from '../access'
import { validateInternalPath, validatePan, validatePhone, validateUrl } from '../fields/validators'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Logo, contact details, registration numbers and the announcement bar.',
  },
  access: {
    read: isPublic,
    update: isSuperAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ---------- Brand ----------
        {
          label: 'Brand',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'ODH Foundation',
            },

            {
              name: 'logo',
              type: 'upload',
              relationTo: 'graphics',
              required: true,
              admin: {
                description: 'Shown in the website header.',
              },
            },

            {
              name: 'logoLight',
              type: 'upload',
              relationTo: 'graphics',
              admin: {
                description: 'Shown in the footer on dark backgrounds.',
              },
            },

            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'graphics',
              admin: {
                description: 'Browser tab icon.',
              },
            },

            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default Social Share Image',
              admin: {
                description:
                  'Used when a page does not have its own Open Graph image.',
              },
            },

            // ---------------- Newsletter ----------------

            {
              name: 'newsletter',
              type: 'group',
              label: 'Newsletter Section',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                  defaultValue: 'Sign Up For Latest Updates',
                },

                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  defaultValue:
                    'To keep yourself updated on latest news and programs at ODH Foundation, drop in your E-mail ID',
                },

                {
                  name: 'placeholder',
                  type: 'text',
                  defaultValue: 'Your Email',
                },

                {
                  name: 'buttonLabel',
                  type: 'text',
                  defaultValue: 'Subscribe',
                },
              ],
            },
          ],
        },

        // ---------- Contact ----------
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'address',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description:
                      'Legacy footer address. Keep this until the footer is migrated to use Registered Office.',
                    custom: {
                      multiline: true,
                    },
                  },
                },

                {
                  name: 'phone',
                  label: 'Phone (Landline)',
                  type: 'text',
                  admin: {
                    description:
                      'Office landline number. Example: 0512-2220000',
                  },
                },

                {
                  name: 'mobile',
                  label: 'Mobile Number',
                  type: 'text',
                  required: true,
                  validate: validatePhone,
                  admin: {
                    description:
                      'Primary mobile number shown on the website.',
                  },
                },

                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  admin: {
                    description:
                      'Primary contact email.',
                  },
                },
              
                {
                  name: 'hours',
                  label: 'Office Hours',
                  type: 'text',
                  admin: {
                    description:
                      'Example: Monday – Friday, 10:00 AM – 6:00 PM',
                  },
                },

                {
                  name: 'mapUrl',
                  label: 'Google Maps URL',
                  type: 'text',
                  validate: validateUrl,
                  admin: {
                    description:
                      'Google Maps link opened from the Contact page.',
                  },
                },

                {
                  name: 'qrCode',
                  label: 'Donation QR Code',
                  type: 'upload',
                  relationTo: 'graphics',
                  admin: {
                    description:
                      'QR code displayed in the website footer.',
                  },
                },

                {
                  name: 'qrCaption',
                  label: 'QR Caption',
                  type: 'text',
                  defaultValue: 'Scan to Donate',
                  admin: {
                    description:
                      'Short text displayed below the QR code.',
                  },
                },
                {
                  name: 'registeredOffice',
                  label: 'Registered Office',
                  type: 'group',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      defaultValue: 'Registered Office',
                    },
                    {
                      name: 'organization',
                      type: 'text',
                      defaultValue: 'ODH Foundation',
                    },
                    {
                      name: 'address',
                      type: 'textarea',
                      admin: {
                        custom: {
                          multiline: true,
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'headOffice',
                  label: 'Head Office',
                  type: 'group',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      defaultValue: 'Head Office',
                    },
                    {
                      name: 'organization',
                      type: 'text',
                      defaultValue: 'ODH Foundation',
                    },
                    {
                      name: 'address',
                      type: 'textarea',
                      admin: {
                        custom: {
                          multiline: true,
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp Number',
                  type: 'text',
                  validate: validatePhone,
                },
                {
                  name: 'emailDescription',
                  type: 'textarea',
                  defaultValue:
                    'For any enquiries or information, drop in a mail to',
                }

              ],
            },
          ],
        },

        // ---------- Registrations ----------
        {
          label: 'Registrations',
          fields: [
            {
              name: 'registrations',
              type: 'group',
              label: false,
              admin: {
                description:
                  'Official organisation registration numbers displayed across the website.',
              },
              fields: [
                {
                  name: 'pan',
                  type: 'text',
                  label: 'PAN Number',
                  validate: validatePan,
                  admin: {
                    description:
                      'Permanent Account Number of the organisation.',
                  },
                },

                {
                  name: 'reg80G',
                  type: 'text',
                  label: '80G Registration Number',
                  admin: {
                    description:
                      'Registration number used for tax exemption under Section 80G.',
                  },
                },

                {
                  name: 'reg12A',
                  type: 'text',
                  label: '12A Registration Number',
                  admin: {
                    description:
                      'Registration number under Section 12A.',
                  },
                },

                {
                  name: 'csr1',
                  type: 'text',
                  label: 'CSR-1 Registration Number',
                  admin: {
                    description:
                      'CSR-1 registration number of the organisation.',
                  },
                },

                {
                  name: 'certificates',
                  type: 'array',
                  labels: {
                    singular: 'Certificate',
                    plural: 'Certificates',
                  },
                  admin: {
                    description:
                      'Upload registration certificates that visitors can download from the website.',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },

                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'documents',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ---------- Social ----------
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Profiles',
              maxRows: 6,
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'X (Twitter)', value: 'x' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: validateUrl,
                },
              ],
            },
          ],
        },
        // ----------- Top Header ------------
        {
          label: 'Top Header',
          fields: [
            {
              name: 'topHeader',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show Top Header',
                  defaultValue: true,
                },

                {
                  name: 'items',
                  type: 'array',
                  labels: {
                    singular: 'Item',
                    plural: 'Items',
                  },
                  admin: {
                    description:
                      'Drag and drop to change the display order.',
                  },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      options: [
                        {
                          label: 'Email',
                          value: 'email',
                        },
                        {
                          label: 'PAN',
                          value: 'pan',
                        },
                        {
                          label: '80G',
                          value: '80g',
                        },
                        {
                          label: 'CSR-1',
                          value: 'csr1',
                        },
                        {
                          label: 'Careers',
                          value: 'careers',
                        },
                        {
                          label: 'Login',
                          value: 'login',
                        },
                        {
                          label: 'Custom Link',
                          value: 'custom',
                        },
                      ],
                    },

                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },

                    {
                      name: 'url',
                      type: 'text',
                      validate: validateInternalPath,
                      admin: {
                        condition: (_, siblingData) =>
                          ['careers', 'login', 'custom'].includes(
                            siblingData?.type,
                          ),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // ---------- Bank Details ----------
        {
          label: 'Bank Details',
          fields: [
            {
              name: 'bankDetails',
              type: 'group',
              label: false,
              admin: {
                description:
                  'Direct bank transfer details shown on the Donate / Contact page.',
              },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Bank Details',
                },

                {
                  name: 'subHeading',
                  type: 'text',
                  defaultValue:
                    'Direct Bank Transfer through Net Banking, QR Code or Cheque',
                },

                {
                  name: 'accounts',
                  type: 'array',
                  labels: {
                    singular: 'Bank Account',
                    plural: 'Bank Accounts',
                  },
                  admin: {
                    description:
                      'Add one entry per bank account (e.g. ICICI Bank, Punjab National Bank).',
                  },
                  fields: [
                    {
                      name: 'bankLogo',
                      label: 'Bank Logo',
                      type: 'upload',
                      relationTo: 'graphics',
                      admin: {
                        description: 'Bank logo shown above the account details table.',
                      },
                    },

                    {
                      name: 'bankName',
                      type: 'text',
                      admin: {
                        description: 'Example: ICICI Bank',
                      },
                    },

                    {
                      name: 'beneficiaryAccountName',
                      label: 'Beneficiary Account Name',
                      type: 'text',
                      required: true,
                      defaultValue: 'ODH FOUNDATION',
                    },

                    {
                      name: 'accountNumber',
                      type: 'text',
                      required: true,
                    },

                    {
                      name: 'accountType',
                      type: 'select',
                      required: true,
                      defaultValue: 'current',
                      options: [
                        { label: 'Current Account', value: 'current' },
                        { label: 'Savings Account', value: 'savings' },
                      ],
                    },

                    {
                      name: 'ifscCode',
                      label: 'IFSC Code',
                      type: 'text',
                      required: true,
                    },
                  ],
                },

                {
                  name: 'qr',
                  label: 'Donation QR Section',
                  type: 'group',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      defaultValue: 'Scan QR Code to Donate',
                    },

                    {
                      name: 'qrImage',
                      label: 'QR Code Image',
                      type: 'upload',
                      relationTo: 'graphics',
                    },

                    {
                      name: 'organizationName',
                      type: 'text',
                      defaultValue: 'ODH FOUNDATION',
                    },

                    {
                      name: 'instructions',
                      type: 'textarea',
                      defaultValue:
                        'In case you have donated directly through Bank Transfer, QR Code or Cheque, kindly WhatsApp your details such as Name, Full address, Pan and Aadhar for Tax Exemption receipt on +91-9795505106 Or Email us on contactus@odhfoundation.org',
                      admin: {
                        custom: {
                          multiline: true,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // ---------- Analytics ----------
        {
          label: 'Analytics',
          fields: [
            {
              name: 'ga4Id',
              type: 'text',
              label: 'Google Analytics 4 Measurement ID',
              admin: { description: 'For example: G-XXXXXXXXXX' },
            },
            {
              name: 'clarityId',
              type: 'text',
              label: 'Microsoft Clarity Project ID',
            },
          ],
        },
      ],
    },
  ],
}