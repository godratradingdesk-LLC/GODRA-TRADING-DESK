import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/gtd-logo.png'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../context/AuthContext'
import { EMAIL_RE, NAME_RE, PHONE_RE, passwordChecks, passwordProblem, passwordStrength } from '../lib/validation'

const PW_RULES = [
  ['len', '8 to 16 characters'],
  ['num', 'At least one number (0–9)'],
  ['sym', 'At least one symbol (@ # $ % - ! ? & *)'],
]

export default function Register() {
  const navigate = useNavigate()
  const { doRegister } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [busy, setBusy] = useState(false)

  const checks = passwordChecks(pass)

  const submit = async () => {
    setErr('')
    setOk('')

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.trim()
    const cleanPin = pin.trim()

    if (!NAME_RE.test(cleanName)) {
      setErr(
        'Please enter your real name — letters, spaces, hyphens and apostrophes only (2–60 characters).',
      )
      return
    }
    if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 254) {
      setErr('Please enter a valid email address.')
      return
    }
    if (cleanPhone && !PHONE_RE.test(cleanPhone)) {
      setErr('Please enter a valid phone number, or leave it blank.')
      return
    }
    const pwProblem = passwordProblem(pass)
    if (pwProblem) {
      setErr(pwProblem)
      return
    }
    if (pass !== pass2) {
      setErr('The two passwords do not match.')
      return
    }
    if (cleanPin && !/^\d{4,6}$/.test(cleanPin)) {
      setErr('PIN must be 4 to 6 digits, or leave it blank to skip.')
      return
    }
    if (cleanPin && pass.startsWith(cleanPin)) {
      setErr('Your PIN should not be the start of your password. Please choose a different PIN.')
      return
    }

    setBusy(true)
    const result = await doRegister({
      name: cleanName,
      email: cleanEmail,
      password: pass,
      phone: cleanPhone,
      pin: cleanPin,
    })
    setBusy(false)

    if (!result.ok) {
      setErr(result.error)
      return
    }
    if (result.needsManualSignIn) {
      setOk('Account created! Please sign in with your email and password.')
      setTimeout(() => navigate('/login'), 1400)
      return
    }
    setOk(`Account created! Welcome to GTD, ${cleanName} — you are now a Gold Member.`)
    // The gold-disclosures modal opens from AuthContext; it lands over the
    // portal once acknowledged.
    setTimeout(() => navigate('/portal'), 1200)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div id="pg-register" className="page active">
      <div className="auth-card">
        <div className="login-side">
          <div>
            <div className="ls-brand">
              <img src={logo} alt="GTD" />
              <div className="wm">
                <span>Godra</span> Trading Desk
              </div>
            </div>
            <h2 className="ls-h">Join GTD as a Gold Member</h2>
            <p className="ls-p">
              Create your account to access exclusive GTD autotrading bots, strategies, and
              indicators. Registration is instant.
            </p>
          </div>
          <ul className="ls-perks">
            <li>Access GTD HedgeAlgo — Flagship Bot</li>
            <li>GTD Capital Engine — HFT Live Orderflow</li>
            <li>GTD ICT Concepts pack</li>
            <li>Secure cart &amp; Stripe checkout</li>
            <li>Two-step sign-in: password + optional PIN</li>
          </ul>
        </div>
        <div className="login-form-panel">
          <button className="lf-back" onClick={() => navigate('/')}>
            ← Back to Site
          </button>
          <div className="lf-eyebrow">Create Your GTD Account</div>
          <h2 className="lf-title">Register</h2>

          <div className={'login-err' + (err ? ' show' : '')} id="reg-err">
            {err}
          </div>
          <div className={'login-success' + (ok ? ' show' : '')} id="reg-ok">
            {ok}
          </div>

          <div className="field">
            <label htmlFor="r-name">Full Name</label>
            <input
              type="text"
              id="r-name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="field">
            <label htmlFor="r-email">Email Address</label>
            <input
              type="email"
              id="r-email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="field">
            <label htmlFor="r-phone">Phone Number (optional)</label>
            <input
              type="tel"
              id="r-phone"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="field">
            <label htmlFor="r-pass">Password</label>
            <PasswordField
              id="r-pass"
              value={pass}
              onChange={setPass}
              autoComplete="new-password"
              maxLength={16}
              placeholder="8–16 characters"
              onKeyDown={onKeyDown}
            />
            <div className={'pw-meter' + (pass ? ' pw-' + passwordStrength(pass) : '')} id="r-pw-meter">
              <span></span>
            </div>
            <ul className="pw-rules" id="r-pw-rules">
              {PW_RULES.map(([key, text]) => (
                <li key={key} className={checks[key] && pass.length > 0 ? 'met' : ''}>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="field">
            <label htmlFor="r-pass2">Confirm Password</label>
            <PasswordField
              id="r-pass2"
              value={pass2}
              onChange={setPass2}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="field">
            <label htmlFor="r-pin">
              Security PIN<span className="pin-optional-tag">Optional</span>
            </label>
            <input
              type="password"
              id="r-pin"
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="4–6 digits (optional)"
              style={{ letterSpacing: '6px', fontSize: '1.2rem' }}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={onKeyDown}
            />
            <p className="pw-hint">
              Optional extra step. Set a <strong>4 to 6 digit</strong> PIN and you will be asked for
              it after your password at every sign-in. Leave it blank to sign in with your password
              alone.
            </p>
          </div>
          <button className="btn-login" onClick={submit} disabled={busy}>
            {busy ? 'Creating your account…' : 'Create Account & Become Gold Member'}
          </button>
          <p className="login-note">
            Already have an account? <button onClick={() => navigate('/login')}>Sign In</button>
          </p>
        </div>
      </div>
    </div>
  )
}
