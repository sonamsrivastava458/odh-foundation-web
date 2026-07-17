import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Graphics } from './collections/Graphics'
import { Documents } from './collections/Documents'
import { Pages } from './collections/Pages'
import { ProjectCategories } from './collections/ProjectCategories'
import { Projects } from './collections/Projects'
import { TeamMembers } from './collections/TeamMembers'
import { Testimonials } from './collections/Testimonials'
import { Campaigns } from './collections/Campaigns'
import { MediaPosts } from './collections/MediaPosts'
import { Careers } from './collections/Careers'
import { Donations } from './collections/Donations'
import { Subscriptions } from './collections/Subscriptions'
import { FormSubmissions } from './collections/FormSubmissions'



import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { DonationSettings } from './globals/DonationSettings'

import { sanitizePlainText } from './fields/sanitizePlainText'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig(
  // Har text/textarea field par `singleLine` hook lagata hai — ek jagah, taaki kisi
  // field par lagana bhoolna mumkin hi na rahe. Opt-out ke liye field par
  // `admin: { custom: { multiline: true } }` (jaise postal address).
  sanitizePlainText({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [
      Users,
      Media,
      Graphics,
      Documents,
      Pages,
      ProjectCategories,
      Projects,
      // TeamMembers, MediaPosts se pehle — uska `author` isse relate karta hai
      TeamMembers,
      Testimonials,
      Campaigns,
      MediaPosts,
      Careers,
      Donations,
      Subscriptions,
      FormSubmissions,
    ],
    globals: [SiteSettings, Navigation, DonationSettings],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URL || '',
      },
    }),
    // Server-level cap. Per-collection limits (images 10MB, PDF 5MB — doc §10)
    // `enforceFileSize` hook se lagti hain; ye uske upar ki aakhri deewar hai,
    // taaki 500MB ki file server ki memory hi na khaaye.
    upload: {
      limits: { fileSize: 10 * 1024 * 1024 },
      abortOnLimit: true,
      responseOnLimit: 'File is too large. The maximum upload size is 10 MB.',
    },
    sharp,
    // Donations.afterChange (generateReceipt hook) ka atomic receipt-number counter —
    // yeh ek plain SQL table hai, Payload collection nahi (koi admin-panel UI nahi
    // chahiye isko). IF NOT EXISTS se idempotent hai — har boot pe safe hai, chahe
    // local dev ho ya production ka pehla deploy.
    onInit: async (payload) => {
      await payload.db.pool.query(`
        CREATE TABLE IF NOT EXISTS receipt_counters (
          fiscal_year text PRIMARY KEY,
          last_number integer NOT NULL DEFAULT 0
        )
      `)
    },
    plugins: [],
  }),
)
