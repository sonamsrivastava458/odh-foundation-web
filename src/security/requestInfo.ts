export function getCountry(
  request: Request,
) {
  return (
    request.headers.get('CF-IPCountry') ??
    'Unknown'
  )
}

export function getUserAgent(
  request: Request,
) {
  return (
    request.headers.get('user-agent') ??
    'Unknown'
  )
}