import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/gtd-logo.png'
import { sb } from '../lib/supabase'
import { EMAIL_RE, NAME_RE, PHONE_RE } from '../lib/validation'

// ═══════════════════════════════════════════════════════════
//  BOOK A CALL — public, no account required
// ═══════════════════════════════════════════════════════════

const TEXTAREA_STYLE = {
  width: '100%',
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  color: 'var(--white)',
  padding: '11px',
  borderRadius: '3px',
  fontFamily: "'DM Sans',sans-serif",
  fontSize: '.86rem',
  resize: 'vertical',
}

export default function BookCall() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState('')
  const [pref, setPref] = useState('')
  const [err, setErr] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setErr('')
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.trim()

    if (!NAME_RE.test(cleanName)) {
      setErr('Please enter your full name.')
      return
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setErr('Please enter a valid email address.')
      return
    }
    if (cleanPhone && !PHONE_RE.test(cleanPhone)) {
      setErr('Please enter a valid phone number, or leave it blank.')
      return
    }
    if (!sb) {
      setErr('Requests are temporarily unavailable. Please refresh and try again.')
      return
    }

    setBusy(true)
    try {
      // The desk schedules the call — this only submits the request.
      const { data, error } = await sb.rpc('request_call', {
        p_full_name: cleanName,
        p_email: cleanEmail,
        p_phone: cleanPhone || null,
        p_topic: topic.trim() || null,
        p_preferred: pref.trim() || null,
      })
      if (error) throw error
      const result = data && data[0]
      if (!result || !result.ok) {
        setErr(
          result && result.reason === 'too_many'
            ? 'You already have a pending request — we will be in touch soon.'
            : 'Could not send your request. Please check your details and try again.',
        )
        return
      }
      setConfirmText(
        `Your request is in. The desk will email ${cleanEmail} shortly to arrange a time for your call.`,
      )
    } catch (e) {
      setErr('Something went wrong. Please try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  const submitted = !!confirmText

  return (
    <div id="pg-book-call" className="page active">
      <nav>
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          <img src={logo} alt="GTD Logo" />
          <div>
            <div className="logo-text">
              <span>Godra</span> Trading Desk
            </div>
            <div className="logo-sub">Book a Call</div>
          </div>
        </a>
        <button className="nav-cta" onClick={() => navigate('/')}>
          ← Back to Site
        </button>
      </nav>

      <div className="book-body">
        <div className="section-tag">Talk to the Desk</div>
        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '10px' }}>
          Book a Call
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '.86rem', maxWidth: '520px' }}>
          Tell us a little about you and what you'd like to discuss. The desk will review your
          request and email you to arrange a time that works.
        </p>

        <div id="book-step-2" className={'book-step' + (submitted ? '' : ' active')}>
          <div className="field">
            <label htmlFor="bc-name">Full Name</label>
            <input
              type="text"
              id="bc-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="bc-email">Email Address</label>
            <input
              type="email"
              id="bc-email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="bc-phone">Phone Number (optional)</label>
            <input
              type="tel"
              id="bc-phone"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="bc-topic">What would you like to discuss? (optional)</label>
            <textarea
              id="bc-topic"
              rows={3}
              style={TEXTAREA_STYLE}
              placeholder="e.g. GTD Hedge Algo setup questions"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="bc-pref">Preferred days &amp; times (optional)</label>
            <input
              type="text"
              id="bc-pref"
              maxLength={200}
              placeholder="e.g. Weekday evenings after 6 PM ET"
              value={pref}
              onChange={(e) => setPref(e.target.value)}
            />
          </div>
          <div
            id="bc-err"
            className="field-err"
            style={{
              display: err ? 'block' : 'none',
              color: 'var(--red)',
              fontSize: '.78rem',
              marginBottom: '14px',
            }}
          >
            {err}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={submit} disabled={busy}>
              {busy ? 'Sending…' : 'Request a Call'}
            </button>
          </div>
        </div>

        <div id="book-step-3" className={'book-step' + (submitted ? ' active' : '')}>
          <div
            className="red-banner"
            style={{ borderColor: 'rgba(53,190,120,.4)', background: 'rgba(53,190,120,.08)' }}
          >
            <div className="rb-head" style={{ color: 'var(--green)' }}>
              ✓ Request Received
            </div>
            <div className="rb-sub" id="bc-confirm-text">
              {confirmText || "We'll be in touch to confirm."}
            </div>
          </div>
          <button className="btn-outline" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
            Back to Site
          </button>
        </div>
      </div>
    </div>
  )
}
