import { getPayload } from 'payload'
import config from '@payload-config'

export interface RateLimitLogData {
    ip: string
    endpoint: string
    method: string
    country?: string
    userAgent?: string
    reason: string
    duration?: string
    remainingPoints?: number
    retryAfter?: number
}

export async function logRateLimit(
    data: RateLimitLogData,
) {
    try {
        const payload = await getPayload({
            config,
        })

        const doc = await payload.create({
            collection: 'rate-limit-logs',
            overrideAccess: true,
            data,
        })
    }
    catch (err) {
        console.error(
            'Rate Limit Log Error',
            err,
        )
    }
}