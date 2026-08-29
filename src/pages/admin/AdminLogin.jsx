import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../../components/PasswordField'
import { useAdmin } from '../../context/AdminContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { doAdminLogin } = useAdmin()

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setErr('')
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !pass) {
      setErr('Please enter your email and password.')
      return
    }

    setBusy(true)
    const result = await doAdminLogin({ email: cleanEmail, password: pass })
    setBusy(false)

    if (!result.ok) {
      setErr(result.error)
      return
    }
    navigate(result.needsSetPin ? '/admin/set-pin' : '/admin/pin')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div id="pg-admin-login" className="page active">
      <div
        className="auth-card"
        style={{ maxWidth: '460px', margin: '80px auto', gridTemplateColumns: '1fr' }}
      >
        <div className="login-form-panel">
          <button className="lf-back" onClick={() => navigate('/')}>
            ← Back to Site
          </button>
          <div className="lf-eyebrow">Restricted Access</div>
          <h2 className="lf-title">Admin Login</h2>
          <div className={'login-err' + (err ? ' show' : '')} id="admin-login-err">
            {err}
          </div>
          <div className="field">
            <label htmlFor="ad-email">Admin Email</label>
            <input
              type="email"
              id="ad-email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="field">
            <label htmlFor="ad-pass">Password</label>
            <PasswordField
              id="ad-pass"
              value={pass}
              onChange={setPass}
              autoComplete="off"
              onKeyDown={onKeyDown}
            />
          </div>
          <button className="btn-login" onClick={submit} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
