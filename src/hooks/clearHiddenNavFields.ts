import type { GlobalBeforeChangeHook } from 'payload'

type HeaderItem = {
  style?: string
  children?: unknown[] | null
  featuredProject?: unknown
}

/**
 * `admin.condition` sirf UI me field chhupata hai — purani value DB me padi rehti hai.
 * Editor "Dropdown" se "Plain link" par switch karta hai, aur dropdown links DB me bache
 * reh jaate hain. Frontend unhe dekhkar galat menu render kar sakta hai.
 *
 * Ye hook save se pehle un fields ko khaali kar deta hai jo current `style` ke liye
 * relevant nahi hain — yaani DB me wahi rehta hai jo editor ne sach me chuna.
 */
export const clearHiddenNavFields: GlobalBeforeChangeHook = ({ data }) => {
  const items = data?.headerItems

  if (!Array.isArray(items)) return data

  data.headerItems = items.map((item: HeaderItem) => ({
    ...item,
    children: item.style === 'dropdown' ? item.children : [],
    featuredProject: item.style === 'megaMenu' ? item.featuredProject : null,
  }))

  return data
}
