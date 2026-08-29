import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

/** First admin sign-in only — adds the second step for every sign-in after. */
export default function AdminSetPin() {
  const navigate = useNavigate()
  const { pendingAdmin, saveAdminSetupPin } = useAdmin()

  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!pendingAdmin) navigate('/admin', { replace: true })
  }, [pendingAdmin, navigate])

  if (!pendingAdmin) return null

  const submit = async () => {
    setErr('')
    setBusy(true)
    const result = await saveAdminSetupPin(pin.trim())
    setBusy(false)
    if (!result.ok) {
      setErr(result.error)
      return
    }
    navigate('/admin/dashboard')
  }

  return (
    <div id="pg-admin-setpin" className="page active">
      <div className="pin-card">
        <span className="pin-crown">🔑</span>
        <h2 className="pin-title">Set an Admin PIN</h2>
        <p className="pin-sub">
          Add a 4–6 digit PIN as a second step for future admin sign-ins.
        </p>
        <input
          type="password"
          id="admin-setpin-input"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="4–6 digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
          style={{
            maxWidth: '200px',
            letterSpacing: '5px',
            textAlign: 'center',
            margin: '18px auto',
            display: 'block',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            color: 'var(--white)',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '1.1rem',
          }}
        />
        <div
          id="admin-setpin-err"
          className={'login-err' + (err ? ' show' : '')}
          style={{ textAlign: 'left' }}
        >
          {err}
        </div>
        <button className="btn-pin-enter" onClick={submit} disabled={busy}>
          {busy ? 'Saving…' : 'Save PIN & Continue'}
        </button>
      </div>
    </div>
  )
}
