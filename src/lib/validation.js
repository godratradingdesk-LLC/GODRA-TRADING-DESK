// ─ Input validation ─
// Deliberately conservative: reject rather than try to clean up.
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
export const NAME_RE = /^[\p{L}\p{M}'\-. ]{2,60}$/u
export const PHONE_RE = /^[0-9+()\-. ]{7,24}$/

// ─ Password rules: 8–16 characters, at least one number and one symbol ─
export const PW_SYMBOLS = /[@#$%\-!?&*^+=_.,:;()[\]{}<>/\\|~`'"]/

export function passwordChecks(pw) {
  return {
    len: pw.length >= 8 && pw.length <= 16,
    num: /[0-9]/.test(pw),
    sym: PW_SYMBOLS.test(pw),
  }
}

export function passwordProblem(pw) {
  if (pw.length < 8) return 'Password must be at least 8 characters.'
  if (pw.length > 16) return 'Password must be no more than 16 characters.'
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.'
  if (!PW_SYMBOLS.test(pw))
    return 'Password must contain at least one symbol, such as @ # $ % or -'
  return null
}

export function passwordStrength(pw) {
  const c = passwordChecks(pw)
  const met = [c.len, c.num, c.sym].filter(Boolean).length
  if (met < 3) return met <= 1 ? 'weak' : 'fair'
  // All rules met — reward extra length and mixed case.
  let bonus = 0
  if (pw.length >= 12) bonus++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) bonus++
  return bonus >= 1 ? 'good' : 'fair'
}

/** 24h "HH:MM" → "H:MM AM/PM". */
export function formatSlotTime(t) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm
}
