import { redis } from '@/lib/redis'
import { BLOCK_POLICY } from './blockPolicy'

const BLOCK_PREFIX = 'blocked'
const VIOLATION_PREFIX = 'violations'
export interface BlockResult {
  violations: number
  blocked: boolean
  duration?: number
  label?: string
}

function blockKey(ip: string) {
  return `${BLOCK_PREFIX}:${ip}`
}

function violationKey(ip: string) {
  return `${VIOLATION_PREFIX}:${ip}`
}

export async function isBlocked(ip: string) {
  return (await redis.exists(blockKey(ip))) === 1
}

export async function getViolationCount(ip: string) {
  const value = await redis.get(violationKey(ip))

  return Number(value ?? 0)
}

export async function registerViolation(
  ip: string,
): Promise<BlockResult> {

  const key = violationKey(ip)

  const violations = await redis.incr(key)

  await redis.expire(key, 60 * 60 * 24)

  // 24 Hour Block
  if (
    violations >= BLOCK_POLICY.second.violations
  ) {

    await redis.set(
      blockKey(ip),
      '1',
      'EX',
      BLOCK_POLICY.second.duration,
    )

    return {
      violations,
      blocked: true,
      duration: BLOCK_POLICY.second.duration,
      label: BLOCK_POLICY.second.label,
    }
  }

  // 1 Hour Block
  if (
    violations >= BLOCK_POLICY.first.violations
  ) {

    await redis.set(
      blockKey(ip),
      '1',
      'EX',
      BLOCK_POLICY.first.duration,
    )

    return {
      violations,
      blocked: true,
      duration: BLOCK_POLICY.first.duration,
      label: BLOCK_POLICY.first.label,
    }
  }

  return {
    violations,
    blocked: false,
  }
}