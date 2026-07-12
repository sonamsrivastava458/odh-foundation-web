import type { CollectionSlug, Field } from 'payload'

/**
 * Reference blocks ka output-only field.
 *
 * `populateBlocks` afterRead hook isme resolved documents bhar deta hai —
 * auto mode me query se, manual mode me editor ki selection se. Frontend ko
 * dono case me ek hi field padhna hota hai: `block.items`.
 *
 * `virtual: true` -> DB me koi column nahi banta, isliye editor ke save karne par
 * ye value wapas likhi nahi ja sakti.
 */
export const resolvedItems = (relationTo: CollectionSlug): Field => ({
  name: 'items',
  type: 'relationship',
  relationTo,
  hasMany: true,
  virtual: true,
  admin: {
    hidden: true,
  },
})
