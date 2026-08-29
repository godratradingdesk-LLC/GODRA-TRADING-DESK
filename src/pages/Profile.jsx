import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNav from '../components/PortalNav'
import RiskNote from '../components/RiskNote'
import { useAuth } from '../context/AuthContext'

/**
 * Manage PIN from the Profile page — the only route to a PIN if email
 * confirmation delayed setting one at registration, and how to change or
 * remove one later.
 */
function PinManager() {
  const { entitlements, user, setMyPin } = useAuth()
  const [pin, setPin] = useState('')
  const [msg, setMsg] = useState(null) // { text, tone }

  const hasPin = !!(entitlements && entitlements.email === user?.email && entitlements.has_pin)

  const save = async () => {
    const value = pin.trim()
    if (value && !/^\d{4,6}$/.test(value)) {
      setMsg({ text: 'PIN must be 4 to 6 digits, or leave blank to remove it.', tone: 'error' })
      return
    }
    const result = await setMyPin(value)
    if (!result.ok) {
      setMsg({ text: result.error, tone: 'error' })
      return
    }
    setPin('')
    setMsg({
      text: value
        ? '✓ PIN updated.'
        : '✓ PIN removed — you will sign in with your password only.',
      tone: 'success',
    })
  }

  return (
    <div
      style={{ borderTop: '1px solid var(--edge)', marginTop: '26px', paddingTop: '22px' }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '.6rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--gold-lt)',
          marginBottom: '12px',
        }}
      >
        Security PIN
      </div>
      <div id="pf-pin-box">
        <p className="pw-hint" style={{ marginBottom: '10px' }}>
          {hasPin
            ? 'A PIN is active on this account. Enter a new 4–6 digit PIN to replace it, or leave blank and save to remove it.'
            : 'No PIN set. Add an optional 4–6 digit PIN for a second step at sign-in.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <input
            type="password"
            id="pf-pin-input"
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={hasPin ? 'New PIN (optional)' : '4–6 digit PIN'}
            style={{ maxWidth: '180px', letterSpacing: '4px' }}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          />
          <button
            className="btn-back-portal"
            style={{
              margin: 0,
              border: '1px solid var(--border)',
              padding: '12px 20px',
              borderRadius: '3px',
            }}
            onClick={save}
          >
            {hasPin ? 'Update PIN' : 'Set PIN'}
          </button>
        </div>
      </div>
      <p
        id="pf-pin-msg"
        style={{
          fontSize: '.7rem',
          marginTop: '10px',
          display: msg ? 'block' : 'none',
          color: msg?.tone === 'success' ? 'var(--green)' : 'var(--red)',
        }}
      >
        {msg?.text}
      </p>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, entitlements, purchases, refreshEntitlements } = useAuth()

  useEffect(() => {
    refreshEntitlements()
  }, [refreshEntitlements])

  const name = (user && user.name) || 'Member'
  const initial = (name.trim()[0] || 'G').toUpperCase()
  const memberSince = entitlements?.member_since
    ? new Date(entitlements.member_since).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  return (
    <div id="pg-profile" className="page active">
      <PortalNav />
      <div className="profile-body">
        <button className="btn-back-portal" onClick={() => navigate('/portal')}>
          ← Back to Members Area
        </button>

        <div className="profile-card">
          <div className="profile-head">
            <div className="profile-avatar" id="pf-avatar">
              {initial}
            </div>
            <div>
              <div className="profile-name" id="pf-name">
                {name}
              </div>
              <span className="profile-badge">👑 GTD Gold Member · Account Verified</span>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-row">
              <span className="k">Email Address</span>
              <span className="v" id="pf-email">
                {user?.email || '—'}
              </span>
            </div>
            <div className="profile-row">
              <span className="k">Phone Contact</span>
              <span className="v" id="pf-phone">
                {entitlements?.phone || 'None registered'}
              </span>
            </div>
            <div className="profile-row">
              <span className="k">Member Since</span>
              <span className="v" id="pf-since">
                {memberSince}
              </span>
            </div>
            <div className="profile-row">
              <span className="k">Licences Owned</span>
              <span className="v gold" id="pf-owned">
                {purchases.length} product{purchases.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="btn-add-cart"
              style={{ width: 'auto', padding: '13px 26px' }}
              onClick={() => navigate('/library')}
            >
              📥 &nbsp;Open Premium Library
            </button>
            <button
              className="btn-back-portal"
              style={{
                margin: 0,
                border: '1px solid var(--border)',
                padding: '13px 26px',
                borderRadius: '3px',
              }}
              onClick={() => navigate('/portal')}
            >
              Browse GTD Tools
            </button>
          </div>

          <PinManager />
        </div>

        <RiskNote style={{ marginTop: '26px' }} />

        <div className="red-note" style={{ marginTop: '14px' }}>
          <span className="red-note-title">⚠ Security Reminder</span>
          Redistribution, resale, or hosting of compiled GTD script assemblies is strictly
          prohibited under our Gold Membership licensing terms. Licences are pinned uniquely to your
          registered member details and are monitored.
        </div>
      </div>
    </div>
  )
}
