import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PinInput from '../../components/PinInput'
import { useAdmin } from '../../context/AdminContext'

export default function AdminPin() {
  const navigate = useNavigate()
  const { pendingAdmin, doAdminPin, cancelAdminPinStep } = useAdmin()

  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!pendingAdmin) navigate('/admin', { replace: true })
  }, [pendingAdmin, navigate])

  if (!pendingAdmin) return null

  const len = pendingAdmin.pinLength || 4

  const submit = async (candidate) => {
    const value = candidate ?? pin
    setErr('')

    setBusy(true)
    const result = await doAdminPin(value)
    setBusy(false)

    if (result.ok) {
      navigate('/admin/dashboard')
      return
    }
    if (result.error === 'locked') {
      setErr('Too many incorrect attempts. Locked for 30 minutes.')
      setTimeout(() => navigate('/admin'), 1800)
      return
    }
    if (result.error === 'no-pending') {
      setErr('Please sign in again.')
      setTimeout(() => navigate('/admin'), 1200)
      return
    }
    setErr(result.error)
    setPin('')
  }

  const cancel = async () => {
    await cancelAdminPinStep()
    navigate('/admin')
  }

  return (
    <div id="pg-admin-pin" className="page active">
      <div className="pin-card">
        <div className="step-dots">
          <span className="step-dot on"></span>
          <span className="step-dot on"></span>
        </div>
        <div className="step-label">Step 2 of 2 &middot; Admin PIN</div>
        <span className="pin-crown">🔑</span>
        <h2 className="pin-title">Enter Admin PIN</h2>
        <p className="pin-sub" id="admin-pin-sub">
          Enter your {len}-digit admin PIN to continue.
        </p>

        <PinInput length={len} value={pin} onChange={setPin} onComplete={submit} />

        <div
          id="admin-pin-err"
          className={'login-err' + (err ? ' show' : '')}
          style={{ textAlign: 'left' }}
        >
          {err}
        </div>
        <button className="btn-pin-enter" onClick={() => submit()} disabled={busy}>
          {busy ? 'Verifying…' : 'Enter'}
        </button>
        <button className="pin-back" onClick={cancel}>
          ← Cancel and start over
        </button>
      </div>
    </div>
  )
}
