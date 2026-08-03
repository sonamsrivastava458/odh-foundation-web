import type { Block, Validate } from 'payload'
import { validateFieldKey, validateSlugValue } from '../fields/validators'


/**
 * Row-level rule (spec-equivalent of Navigation's headerItemsAreComplete /
 * donation-settings' onlyOneHighlight): `admin.condition` hides `options` in
 * the browser when type !== 'select', but does NOT enforce `required` on a
 * hidden field. Without this, a row can be saved as type "select" with zero
 * options — exactly the class of gap that let the CSR page's "Preferred focus
 * area" dropdown ship with a missing field. This is the explicit, parent-level
 * check spec'd out in ROADMAP.md §8.6.
 */
const selectFieldsHaveOptions: Validate = (value) => {
  if (!Array.isArray(value)) return true
  const badRow = value.find(
    (row) => row?.type === 'select' && (!Array.isArray(row.options) || row.options.length === 0),
  )
  if (badRow) {
    return `The field "${badRow.label || badRow.name || '(unnamed)'}" is set to Select but has no options.`
  }
  return true
}

type FormFieldRow = { type?: string; options?: Array<{ value?: string }> }

/** A default value that doesn't match any of its own row's options is a silent typo. */
const defaultValueMatchesOption: Validate = (value, { siblingData }: { siblingData?: FormFieldRow }) => {
  if (!value || siblingData?.type !== 'select') return true
  const opts = Array.isArray(siblingData?.options) ? siblingData.options : []
  const matches = opts.some((o) => o?.value === value)
  return matches ? true : `"${value}" does not match any option's Value below.`
}

export const FormBlock: Block = {
  slug: 'formBlock',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },



  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Volunteer', value: 'volunteer' },
        { label: 'CSR', value: 'csr' },
        { label: 'Career', value: 'career' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
      admin: {
        description: 'Tags the submission so it lands in the right place in Form Submissions and notifies the right staff address.',
      },
    },
    {
      name: 'fields',
      type: 'array',
      required: true,
      minRows: 1,
      validate: selectFieldsHaveOptions,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          validate: validateFieldKey,
          admin: { description: 'Key sent in the submission payload, e.g. "email". No spaces.' },
        },
        { name: 'label', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'tel' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Select (dropdown)', value: 'select' },
            { label: 'Date', value: 'date' },
            { label: 'File Upload', value: 'file' },

          ],
        },
        {
          name: 'accept',
          type: 'text',
          defaultValue: 'image/*',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'file',
            description: 'Allowed file types, e.g. image/*,.pdf',
          },
        },
        {
          name: 'maxFileSizeMB',
          type: 'number',
          defaultValue: 5,
          min: 1,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'file',
            description: 'Maximum file size in MB.',
          },
        },
        { name: 'required', type: 'checkbox', defaultValue: false },
        {
          name: 'placeholder',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type !== 'file',
          },
        },
        {
          name: 'helpText',
          type: 'text',
          admin: { description: 'Small note shown below the field, e.g. "We never share this."' },
        },
        {
          name: 'defaultValue',
          type: 'text',
          validate: defaultValueMatchesOption,
          admin: { description: "Pre-fills the field. For a select field, must match one option's Value exactly." },
        },
        {
          name: 'width',
          type: 'select',
          defaultValue: 'full',
          options: [
            { label: 'Full row', value: 'full' },
            { label: 'Half row (pairs with the next half-row field)', value: 'half' },
          ],
        },
        {
          name: 'rows',
          type: 'number',
          label: 'Textarea rows',
          defaultValue: 4,
          min: 2,
          max: 12,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'textarea',
            description: 'How tall the textarea renders.',
          },
        },
        {
          name: 'minLength',
          type: 'number',
          min: 0,
          admin: {
            condition: (_, siblingData) => siblingData?.type !== 'select' && siblingData?.type !== 'file' &&
              siblingData?.type !== 'date'
          },
        },
        {
          name: 'maxLength',
          type: 'number',
          min: 0,
          admin: { condition: (_, siblingData) => siblingData?.type !== 'select' && siblingData?.type !== 'file' && siblingData?.type !== 'date' },
        },
        {
          name: 'options',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'select',
            description: 'Only used when type = select.',
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            {
              name: 'value',
              type: 'text',
              required: true,
              validate: validateSlugValue,
              admin: {
                description:
                  'Stable machine value, e.g. "donation". Editing the Label later is safe — editing this breaks anything already stored against it.',
              },
            },
          ],
        },
      ],
    },
    { name: 'submitLabel', type: 'text', defaultValue: 'Submit' },
    {
      name: 'showResetButton',
      type: 'checkbox',
      label: 'Show Reset Button',
      defaultValue: false,
    },

    {
      name: 'resetLabel',
      type: 'text',
      defaultValue: 'Reset',
      admin: {
        condition: (_, siblingData) => siblingData?.showResetButton,
      },
    }

  ],
}
