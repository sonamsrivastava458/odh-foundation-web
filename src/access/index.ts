import type { Access, FieldAccess } from 'payload'
import type { User } from '../payload-types'

/**
 * Roles generated types se aate hain — nayi role add karoge to TypeScript khud
 * bata dega ki kahan-kahan handle karni hai.
 */
type Role = NonNullable<User['roles']>[number]

const hasRole = (user: User | null | undefined, ...roles: Role[]): boolean => {
  const userRoles = user?.roles
  if (!userRoles) return false
  return roles.some((role) => userRoles.includes(role))
}

// ---- Collection / Global level access ----

/** Sirf super-admin — users, settings, gateway mode */
export const isSuperAdmin: Access = ({ req: { user } }) => hasRole(user, 'super-admin')

/** Content edit kar sakne wale — super-admin ya editor */
export const isEditor: Access = ({ req: { user } }) => hasRole(user, 'super-admin', 'editor')

/** Donations dekh sakne wale — super-admin ya finance */
export const isFinance: Access = ({ req: { user } }) => hasRole(user, 'super-admin', 'finance')

/** Koi bhi logged-in admin */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Website ko dikhna chahiye — media, globals */
export const isPublic: Access = () => true

/**
 * Public ko sirf published content. Logged-in staff ko drafts bhi.
 *
 * Anonymous ke liye ek filter query lautata hai, jise Payload har query me jodta hai —
 * isliye draft content API se kabhi leak nahi hota.
 */
export const readPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: { equals: 'published' },
  }
}

// ---- Field level access (sirf true/false, query nahi) ----

/** Roles field — editor khud ko super-admin na bana le */
export const isSuperAdminField: FieldAccess = ({ req: { user } }) => hasRole(user, 'super-admin')

/** Paise wale fields — jaise campaigns.raisedAmount */
export const isFinanceField: FieldAccess = ({ req: { user } }) =>
  hasRole(user, 'super-admin', 'finance')
