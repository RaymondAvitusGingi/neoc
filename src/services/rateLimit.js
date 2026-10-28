// Best-effort client-side throttle for the public contact form. This is a
// courtesy limit, not a security boundary — the real spam defence
// (FR-PUB-05: honeypot + 5/hour/IP, or reCAPTCHA/Turnstile) belongs on the
// server once one exists (a Cloud Function in front of the `messages`
// write, or App Check).
const RATE_KEY = 'neoc_contact_rl'

export function checkRateLimit() {
  let hits = []
  try {
    hits = JSON.parse(localStorage.getItem(RATE_KEY) || '[]')
  } catch {
    hits = []
  }
  const hourAgo = Date.now() - 60 * 60 * 1000
  hits = hits.filter((t) => t > hourAgo)
  if (hits.length >= 5) throw new Error('Too many messages sent recently. Please try again later.')
  hits.push(Date.now())
  try {
    localStorage.setItem(RATE_KEY, JSON.stringify(hits))
  } catch {
    /* ignore */
  }
}
