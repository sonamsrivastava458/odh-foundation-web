import type { Field } from 'payload'

/** "Mobile Medical Van, Bihar!" -> "mobile-medical-van-bihar" */
const slugify = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // special chars hatao
    .replace(/\s+/g, '-') // spaces -> hyphen
    .replace(/-+/g, '-') // multiple hyphens -> ek
    .replace(/^-|-$/g, '') // shuru/aakhir ke hyphen hatao

export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'The page URL. Generated from the title — edit only if you need a different URL.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        // Editor ne slug khud likha hai -> usi ko saaf karke rakho.
        // Warna source field (title/name) se banao.
        const source =
          typeof value === 'string' && value.trim().length > 0
            ? value
            : (data?.[sourceField] as unknown)

        if (typeof source !== 'string') return value

        return slugify(source)
      },
    ],
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string' || value.length === 0) {
      // Title agar sirf special characters ka ho ("!!!") to slugify khaali lautata hai.
      // Chup-chaap toota hua URL save karne se behtar hai editor ko batana.
      return 'Could not build a URL from the title. Enter a slug manually.'
    }
    return true
  },
})
