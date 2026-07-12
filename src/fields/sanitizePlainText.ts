import type { Config, Field } from 'payload'
import { singleLine } from './hooks/singleLine'

/**
 * Har `text` aur `textarea` field par `singleLine` hook lagata hai — recursively,
 * har collection, global, block, array, group, row aur tab ke andar.
 *
 * Kyun: har field par haath se hook lagana matlab ek din bhoolna, aur us din editor
 * ka copy-paste ek `\n` DB me daal dega — jo meta description, receipt PDF ya card
 * layout tod dega. Ek jagah lagane se bhoolna mumkin hi nahi rehta.
 *
 * Opt-out: jis field me sach me newlines chahiye (jaise postal address), uspar
 * `admin: { custom: { multiline: true } }` laga do.
 */
const walk = (field: Field): Field => {
  switch (field.type) {
    case 'text':
    case 'textarea': {
      if (field.admin?.custom?.multiline === true) return field

      const existing = field.hooks?.beforeValidate ?? []
      // Idempotent — dobara lagane par duplicate nahi hoga
      if (existing.includes(singleLine)) return field

      return {
        ...field,
        hooks: {
          ...field.hooks,
          beforeValidate: [...existing, singleLine],
        },
      }
    }

    case 'group':
    case 'array':
    case 'collapsible':
    case 'row':
      return { ...field, fields: field.fields.map(walk) }

    case 'blocks':
      return {
        ...field,
        blocks: field.blocks.map((block) => ({
          ...block,
          fields: block.fields.map(walk),
        })),
      }

    case 'tabs':
      return {
        ...field,
        tabs: field.tabs.map((tab) => ({ ...tab, fields: tab.fields.map(walk) })),
      }

    default:
      return field
  }
}

export const sanitizePlainText = (config: Config): Config => ({
  ...config,
  collections: config.collections?.map((collection) => ({
    ...collection,
    fields: collection.fields.map(walk),
  })),
  globals: config.globals?.map((global) => ({
    ...global,
    fields: global.fields.map(walk),
  })),
})
