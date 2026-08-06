import { NextResponse } from 'next/server'

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

export function setRateLimitHeaders(
  response: NextResponse,
  info: RateLimitInfo,
): NextResponse {
  response.headers.set(
    'X-RateLimit-Limit',
    String(info.limit),
  )

  response.headers.set(
    'X-RateLimit-Remaining',
    String(Math.max(info.remaining, 0)),
  )

  response.headers.set(
    'X-RateLimit-Reset',
    String(info.reset),
  )

  if (info.retryAfter !== undefined) {
    response.headers.set(
      'Retry-After',
      String(info.retryAfter),
    )
  }

  return response
}