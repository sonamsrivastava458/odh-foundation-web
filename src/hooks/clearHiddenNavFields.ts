import type { GlobalBeforeChangeHook } from 'payload'

type HeaderItem = {
  style?: string
  children?: unknown[] | null
  featuredProject?: unknown
}

/**
 * UI sirf fields hide karta hai.
 * Ye hook ensure karta hai ki database me sirf relevant data hi save ho.
 */
export const clearHiddenNavFields: GlobalBeforeChangeHook = ({ data }) => {
  const items = data?.headerItems

  if (!Array.isArray(items)) return data

  data.headerItems = items.map((item: HeaderItem) => {
    const isDropdown =
      item.style === 'dropdown' ||
      item.style === 'campaignDropdown' ||
      item.style === 'volunteerDropdown' ||
      item.style === 'mediaDropdown'

    const isProjectMegaMenu = item.style === 'projectMegaMenu'

    return {
      ...item,

      // Sirf dropdown menus ke liye children rakho
      children: isDropdown ? item.children : [],

      // Sirf Project Mega Menu ke liye featured project rakho
      featuredProject: isProjectMegaMenu ? item.featuredProject : null,
    }
  })

  return data
}