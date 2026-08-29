import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/gtd-logo.png'
import PinInput from '../components/PinInput'
import { useAuth } from '../context/AuthContext'

export default function PinStep() {
  const navigate = useNavigate()
  const { pendingLogin, doPin, cancelPinStep } = useAuth()

  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  // The PIN is step 2, not a shortcut. Without a verified password there is
  // nothing to verify a PIN against.
  useEffect(() => {
    if (!pendingLogin) navigate('/login', { replace: true })
  }, [pendingLogin, navigate])

  if (!pendingLogin) return null

  const len = pendingLogin.pinLen || 4

  const submit = async (candidate) => {
    const value = candidate ?? pin
    setErr('')

    if (value.length !== len || !/^\d+$/.test(value)) {
      setErr(`Enter all ${len} digits.`)
      return
    }

    setBusy(true)
    const result = await doPin(value)
    setBusy(false)

    if (result.ok) {
      navigate('/portal')
      return
    }
    if (result.error === 'locked') {
      setErr(
        'Too many incorrect attempts. This account is temporarily locked — please try again in 15 minutes.',
      )
      setTimeout(() => navigate('/login'), 1800)
      return
    }
    if (result.error === 'no-pending') {
      setErr('Please sign in with your email and password first.')
      setTimeout(() => navigate('/login'), 1400)
      return
    }
    setErr(result.error)
    setPin('')
  }

  const cancel = async () => {
    await cancelPinStep()
    navigate('/login')
  }

  return (
    <div id="pg-pin" className="page active">
      <div className="pin-card">
        <div className="pin-logo">
          <img src={logo} alt="GTD Logo" />
          <div>
            <div className="pin-logo-text">
              <span>Godra</span> Trading Desk
            </div>
          </div>
        </div>
        <div className="step-dots">
          <span className="step-dot on"></span>
          <span className="step-dot on"></span>
        </div>
        <div className="step-label">Step 2 of 2 &middot; PIN Verification</div>
        <span className="pin-crown">👑</span>
        <h2 className="pin-title">Enter Your PIN</h2>
        <div className="pin-asemail" id="pin-as-email">
          {pendingLogin.email}
        </div>
        <p className="pin-sub" id="pin-sub">
          Password accepted. Now enter your {len}-digit PIN to finish signing in.
        </p>

        <PinInput length={len} value={pin} onChange={setPin} onComplete={submit} />

        <div
          className="login-err"
          id="pin-err"
          style={{ display: err ? 'block' : 'none', textAlign: 'center' }}
        >
          {err}
        </div>
        <button className="btn-pin-enter" onClick={() => submit()} disabled={busy}>
          {busy ? 'Verifying…' : 'Enter Members Area'}
        </button>
        <button className="pin-back" onClick={cancel}>
          ← Cancel and start over
        </button>
      </div>
    </div>
  )
}
