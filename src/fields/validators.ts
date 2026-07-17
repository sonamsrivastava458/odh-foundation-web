import type { Validate } from 'payload'

/** Poora URL (https://... ke saath) */
export const validateUrl: Validate = (value) => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'string') return 'Enter a valid URL.'

  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'URL must start with https://'
    }
    return true
  } catch {
    return 'Enter a full URL, including https://'
  }
}

/** Site ke andar ka link — "/donate", "/projects/xyz" */
export const validateInternalPath: Validate = (value) => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'string') return 'Enter a valid path.'

  if (!value.startsWith('/')) {
    return 'Internal links must start with a slash, for example /donate'
  }
  return true
}

/** Indian PAN — AAAAA9999A */
export const validatePan: Validate = (value) => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'string') return 'Enter a valid PAN.'

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.toUpperCase())) {
    return 'PAN must be in the format AAAAA9999A.'
  }
  return true
}

/** Indian phone — +91 ke saath ya bina */
export const validatePhone: Validate = (value) => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'string') return 'Enter a valid phone number.'

  const digits = value.replace(/[\s\-()+]/g, '')
  if (!/^(91)?[6-9][0-9]{9}$/.test(digits)) {
    return 'Enter a valid 10-digit Indian mobile number.'
  }
  return true
}

/**
 * A safe object key — used for FormBlock.fields[].name, which becomes a JS/JSON
 * key once form submissions are wired up. No spaces, no punctuation — a space
 * here (e.g. "company name") silently breaks that key later. This exists
 * because that exact mistake already happened once on the CSR page.
 */
export const validateFieldKey: Validate = (value) => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'string') return 'Enter a valid field key.'

  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
    return 'Use one camelCase word, no spaces or punctuation — for example "companyName".'
  }
  return true
}

/** A safe select-option value — lowercase slug, e.g. "under-5-lakh" */
export const validateSlugValue: Validate = (value) => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'string') return 'Enter a valid value.'

  if (!/^[a-z0-9-]+$/.test(value)) {
    return 'Use lowercase letters, numbers and hyphens only — for example "under-5-lakh".'
  }
  return true
}
