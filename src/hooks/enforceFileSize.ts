import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

/**
 * Per-collection file size limit.
 *
 * Payload ka `upload.limits.fileSize` sirf top-level config par lagta hai — yaani saari
 * collections ke liye ek hi cap. Doc §10 alag-alag limits maangta hai (images 10MB, PDF 5MB),
 * isliye har collection apni limit yahan se lagati hai.
 *
 * @param maxBytes  is collection ke liye maximum file size
 */
export const enforceFileSize = (maxBytes: number): CollectionBeforeValidateHook =>
  ({ data, req, operation }) => {
    // Update par file dobara upload nahi hoti — sirf naye upload par check karo
    if (operation !== 'create') return data

    const size = req.file?.size

    if (typeof size === 'number' && size > maxBytes) {
      const toMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1)

      throw new APIError(
        `This file is ${toMb(size)} MB. The limit is ${toMb(maxBytes)} MB. ` +
          `Compress it and try again.`,
        400,
      )
    }

    return data
  }
