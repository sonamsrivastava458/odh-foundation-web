export const BLOCK_POLICY = {
  first: {
    violations: 10,
    duration: 60 * 60, // 1 hour
    label: '1h',
  },

  second: {
    violations: 50,
    duration: 60 * 60 * 24, // 24 hours
    label: '24h',
  },
}