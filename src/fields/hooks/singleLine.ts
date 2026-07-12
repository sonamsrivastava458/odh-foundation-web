import type { FieldHook } from 'payload'

// Newlines aur double-spaces ko ek space me badal deta hai
export const singleLine: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value
  return value.replace(/\s+/g, ' ').trim()
}
