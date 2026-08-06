import { RateLimiterRedis } from 'rate-limiter-flexible'
import { redis } from '../lib/redis'
import { RATE_LIMITS } from './rateLimitConfig'

function createLimiter(
  keyPrefix: string,
  config: {
    points: number
    duration: number
    blockDuration: number
  },
) {
  return new RateLimiterRedis({
    storeClient: redis,

    keyPrefix,

    points: config.points,

    duration: config.duration,

    blockDuration: config.blockDuration,
  })
}

export const donationLimiter = createLimiter(
  'donation',
  RATE_LIMITS.donation,
)

export const formLimiter = createLimiter(
  'forms',
  RATE_LIMITS.form,
)

export const otpLimiter = createLimiter(
  'otp',
  RATE_LIMITS.sendOtp,
)

export const verifyOtpLimiter = createLimiter(
  'verify-otp',
  RATE_LIMITS.verifyOtp,
)

export const loginLimiter = createLimiter(
  'login',
  RATE_LIMITS.login,
)

export const searchLimiter = createLimiter(
  'search',
  RATE_LIMITS.search,
)