import { useEffect, useRef } from 'react'

/**
 * The boxed PIN entry. `length` shows only as many boxes as this member's PIN
 * needs; `value` is the joined digit string the parent verifies.
 */
export default function PinInput({ length = 4, value, onChange, onComplete, autoFocus = true }) {
  const refs = useRef([])
  const digits = String(value || '').split('')

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const setDigit = (i, d) => {
    const next = Array.from({ length }, (_, k) => digits[k] || '')
    next[i] = d
    const joined = next.join('')
    onChange(joined)
    return joined
  }

  const handleInput = (i, e) => {
    // Keep only the last typed digit so retyping over a filled box works.
    const raw = e.target.value.replace(/\D/g, '')
    const d = raw.slice(-1)
    const joined = setDigit(i, d)
    if (d && i < length - 1) refs.current[i + 1]?.focus()
    // Empty boxes contribute nothing to the join, so a full-length string
    // means every box is filled.
    if (joined.length === length) onComplete?.(joined)
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  return (
    <div className="pin-inputs">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="password"
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          className={'pin-digit' + (digits[i] ? ' filled' : '')}
          style={{ display: i < length ? '' : 'none' }}
          value={digits[i] || ''}
          onChange={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  )
}
