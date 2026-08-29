import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../context/AuthContext'
import { passwordProblem } from '../lib/validation'

/**
 * Where the emailed reset link lands. supabase-js has already exchanged the
 * token in the URL for a session by the time this renders, so updateUser()
 * is enough to set the new password.
 */
export default function ResetPassword() {
  const navigate = useNavigate()
  const { doSetNewPassword } = useAuth()

  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setErr('')
    const problem = passwordProblem(p1)
    if (problem) {
      setErr(problem)
      return
    }
    if (p1 !== p2) {
      setErr('The two passwords do not match.')
      return
    }

    setBusy(true)
    const result = await doSetNewPassword(p1)
    setBusy(false)

    if (!result.ok) {
      setErr(result.error)
      return
    }
    navigate('/portal')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div id="pg-reset-new" className="page active">
      <div
        style={{
          maxWidth: '470px',
          margin: '70px auto',
          padding: '38px 34px',
          background: '#242B36',
          border: '1px solid var(--border,#3B4451)',
          borderRadius: '8px',
        }}
      >
        <div className="lf-eyebrow">GTD Gold Members Portal</div>
        <h2 className="lf-title">Set a New Password</h2>
        <p className="pw-hint" style={{ marginBottom: '14px' }}>
          8&ndash;16 characters, with at least one number and one symbol.
        </p>
        <div className={'login-err' + (err ? ' show' : '')} id="resetnew-err">
          {err}
        </div>
        <div className="field">
          <label htmlFor="rs-pass">New Password</label>
          <PasswordField
            id="rs-pass"
            value={p1}
            onChange={setP1}
            maxLength={16}
            autoComplete="new-password"
            placeholder="New password"
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="field">
          <label htmlFor="rs-pass2">Confirm New Password</label>
          <PasswordField
            id="rs-pass2"
            value={p2}
            onChange={setP2}
            maxLength={16}
            autoComplete="new-password"
            placeholder="Re-enter new password"
            onKeyDown={onKeyDown}
          />
        </div>
        <button className="btn-login" onClick={submit} disabled={busy}>
          {busy ? 'Saving…' : 'Save New Password'}
        </button>
      </div>
    </div>
  )
}
