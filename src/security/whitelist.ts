const ips =
  process.env.WHITELISTED_IPS ?? ''

export const WHITELISTED_IPS =
  ips
    .split(',')
    .map(ip => ip.trim())
    .filter(Boolean)

export function isWhitelisted(ip: string) {
  return WHITELISTED_IPS.includes(ip)
}