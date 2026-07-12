import type { CollectionBeforeChangeHook, GlobalBeforeChangeHook } from 'payload'

/**
 * `admin.condition` sirf browser me field chhupata hai — purani value DB me padi rehti hai.
 * Editor "Video" se "News" par switch karta hai aur `videoUrl` DB me bacha reh jaata hai,
 * jiske baad frontend news post par video embed kar sakta hai.
 *
 * Ye hook save se pehle un fields ko khaali kar deta hai jinki condition ab poori nahi hoti,
 * yaani DB me wahi rehta hai jo editor ne sach me chuna.
 *
 * @param rules  field ka naam -> function jo batata hai ki wo field rakhni hai ya nahi
 * @param empty  kis field ki khaali value kya ho (arrays ke liye `[]`, default `null`)
 */
export const clearHiddenFields = <T extends Record<string, unknown>>(
  rules: Record<string, (data: T) => boolean>,
  empty: Record<string, unknown> = {},
): CollectionBeforeChangeHook & GlobalBeforeChangeHook =>
  (({ data }: { data: Record<string, unknown> }) => {
    const typed = data as T

    for (const [field, keep] of Object.entries(rules)) {
      if (!keep(typed)) {
        // `undefined` mat do — Payload usse "field bheja hi nahi" samajh kar purani
        // value rakh leta hai. Khaali value explicit honi chahiye.
        data[field] = field in empty ? empty[field] : null
      }
    }

    return data
  }) as CollectionBeforeChangeHook & GlobalBeforeChangeHook
