export interface RateLimitPolicy {
  points: number
  duration: number
  blockDuration: number
}

export const RATE_LIMITS = {
  donation: {
    points: 5,
    duration: 60,
    blockDuration: 300,
  },

  form: {
    points: 5,
    duration: 60,
    blockDuration: 300,
  },

  sendOtp: {
    points: 3,
    duration: 300,
    blockDuration: 900,
  },

  verifyOtp: {
    points: 10,
    duration: 300,
    blockDuration: 900,
  },

  login: {
    points: 10,
    duration: 900,
    blockDuration: 1800,
  },

  search: {
    points: 60,
    duration: 60,
    blockDuration: 120,
  },
} satisfies Record<string, RateLimitPolicy>