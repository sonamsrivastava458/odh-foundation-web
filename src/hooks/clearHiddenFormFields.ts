import type { CollectionBeforeChangeHook } from 'payload'

export const clearHiddenFormFields: CollectionBeforeChangeHook = ({ data }) => {
  if (!Array.isArray(data?.layout)) {
    return data
  }

  data.layout = data.layout.map((block: any) => {

    // ==========================
    // RichText
    // ==========================
    if (block.blockType === 'richText') {
      return {
        ...block,
        buttonLabel: block.showButton ? block.buttonLabel : null,
        buttonPage: block.showButton ? block.buttonPage : null,
      }
    }
    // ==========================
    // FormBlock
    // ==========================

    if (block.blockType !== 'formBlock' || !Array.isArray(block.fields)) {
      return block
    }

    return {
      ...block,
      fields: block.fields.map((field: any) => {
        const isFile = field.type === 'file'
        const isTextarea = field.type === 'textarea'
        const isSelect = field.type === 'select'

        return {
          ...field,

          accept: isFile ? field.accept : null,
          maxFileSizeMB: isFile ? field.maxFileSizeMB : null,

          rows: isTextarea ? field.rows : null,

          options: isSelect ? field.options : [],

          minLength:
            !isSelect && !isFile && field.type !== 'date'
              ? field.minLength
              : null,

          maxLength:
            !isSelect && !isFile && field.type !== 'date'
              ? field.maxLength
              : null,
        }
      }),
    }
  })

  return data
}