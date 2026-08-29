import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/gtd-logo.png'
import PasswordField from '../components/PasswordField'
import RiskNote from '../components/RiskNote'
import { useAuth } from '../context/AuthContext'
import { EMAIL_RE } from '../lib/validation'

export default function Login() {
  const navigate = useNavigate()
  const { user, enterPortal, doLogin, resendConfirmation } = useAuth()

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(null) // string | 'unconfirmed'
  const [busy, setBusy] = useState(false)

  // A valid session already exists (restored on page load, or never signed
  // out) — no need to make them type their password again.
  useEffect(() => {
    if (user) enterPortal()
  }, [user, enterPortal])

  const submit = async () => {
    setErr(null)
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail || !pass) {
      setErr('Please enter your email and password.')
      return
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setErr('Incorrect email or password.')
      return
    }

    setBusy(true)
    const result = await doLogin({ email: cleanEmail, password: pass })
    setBusy(false)

    if (!result.ok) {
      setErr(result.error)
      return
    }
    if (result.needsPin) {
      navigate('/pin')
      return
    }
    // Signed in with no PIN — the disclosures modal opens over the portal.
    navigate('/portal')
  }

  const doResend = async () => {
    const message = await resendConfirmation(email.trim().toLowerCase())
    if (message) setErr(message)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div id="pg-login" className="page active">
      <div className="auth-card">
        <div className="login-side">
          <div>
            <div className="ls-brand">
              <img src={logo} alt="GTD" />
              <div className="wm">
                <span>Godra</span> Trading Desk
              </div>
            </div>
            <h2 className="ls-h">Gold Member Access</h2>
            <p className="ls-p">
              Sign in with your email and password to access the GTD Gold Members Portal — your
              exclusive hub for autotrading bots and strategies.
            </p>
          </div>
          <ul className="ls-perks">
            <li>GTD Hedge Algo — Flagship Bundle</li>
            <li>GTD Capital Engine — HFT Orderflow</li>
            <li>GTD ICT Concepts indicator pack</li>
            <li>Secure Stripe checkout — Credit, Debit &amp; Crypto</li>
            <li>Two-step sign-in: password + optional PIN</li>
          </ul>
          <RiskNote className="ls-risk" />
        </div>
        <div className="login-form-panel">
          <button className="lf-back" onClick={() => navigate('/')}>
            ← Back to Site
          </button>
          <div className="lf-eyebrow">GTD Gold Members Portal</div>
          <h2 className="lf-title">Sign In</h2>

          <div className={'login-err' + (err ? ' show' : '')} id="login-err">
            {err === 'unconfirmed' ? (
              <>
                Please confirm your email first — check your inbox for the link.{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    doResend()
                  }}
                  style={{ color: '#F0D68C', textDecoration: 'underline' }}
                >
                  Resend the email
                </a>
              </>
            ) : (
              err
            )}
          </div>

          <div className="field">
            <label htmlFor="l-email">Email Address</label>
            <input
              type="email"
              id="l-email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="field">
            <label htmlFor="l-pass">Password</label>
            <PasswordField
              id="l-pass"
              value={pass}
              onChange={setPass}
              autoComplete="current-password"
              placeholder="Your password"
              onKeyDown={onKeyDown}
            />
          </div>
          <p className="pw-hint" style={{ marginBottom: '4px' }}>
            If you set a PIN, you will be asked for it after your password.
          </p>
          <button className="btn-login" onClick={submit} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign In to Members Area'}
          </button>
          <p className="login-note">
            No account yet? <button onClick={() => navigate('/register')}>Create Free Account</button>
          </p>
          <RiskNote className="lf-risk" />
        </div>
      </div>
    </div>
  )
}
