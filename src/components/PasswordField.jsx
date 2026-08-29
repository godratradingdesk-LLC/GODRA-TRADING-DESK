import { useRef, useState } from 'react'

const TOGGLE_STYLE = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#8A94A3',
  fontSize: '1rem',
  padding: '4px',
  lineHeight: 1,
}

/** A password input with the show/hide eye toggle used across every auth form. */
export default function PasswordField({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  maxLength,
  onKeyDown,
}) {
  const [shown, setShown] = useState(false)
  const inputRef = useRef(null)

  const toggle = () => {
    setShown((s) => !s)
    inputRef.current?.focus()
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type={shown ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        style={{ paddingRight: '46px', width: '100%' }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={shown ? 'Hide password' : 'Show password'}
        title={shown ? 'Hide password' : 'Show password'}
        style={TOGGLE_STYLE}
      >
        {shown ? '🙈' : '👁'}
      </button>
    </div>
  )
}
