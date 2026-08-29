import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/gtd-logo.png'
import { useAdmin } from '../../context/AdminContext'
import { useAnnouncements } from '../../context/AnnouncementsContext'
import { REGISTER_URL, sb } from '../../lib/supabase'
import { formatSlotTime } from '../../lib/validation'

const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']
const SEVERITIES = [
  ['info', 'Info', 'sel-info'],
  ['success', 'Success', 'sel-success'],
  ['warning', 'Warning', 'sel-warning'],
]

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

const SMALL_BTN = { margin: 0, padding: '6px 10px', fontSize: '.66rem' }

/** Renders a full-width message row inside a table body. */
function EmptyRow({ span, children }) {
  return (
    <tr>
      <td colSpan={span} className="admin-empty">
        {children}
      </td>
    </tr>
  )
}

function BookingsPanel({ active }) {
  const [rows, setRows] = useState(null) // null = loading
  const [failed, setFailed] = useState(false)

  const load = useCallback(async () => {
    if (!sb) {
      setFailed(true)
      return
    }
    try {
      const { data, error } = await sb.rpc('admin_get_bookings', { p_status: null })
      if (error) throw error
      setRows(data || [])
    } catch (e) {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    if (active) load()
  }, [active, load])

  const updateStatus = async (id, status) => {
    setRows((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    if (!sb) return
    try {
      await sb.rpc('admin_update_booking', { p_id: id, p_status: status, p_note: null })
    } catch (e) {
      console.warn('[admin] booking update failed', e)
    }
  }

  return (
    <div id="admin-panel-bookings" className={'admin-panel' + (active ? ' active' : '')}>
      <div className="admin-table-wrap">
        <table className="admin-table" id="admin-bookings-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Topic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {failed ? (
              <EmptyRow span={7}>{sb ? 'Could not load bookings.' : 'Not connected.'}</EmptyRow>
            ) : rows === null ? (
              <EmptyRow span={7}>Loading…</EmptyRow>
            ) : rows.length === 0 ? (
              <EmptyRow span={7}>No bookings yet.</EmptyRow>
            ) : (
              rows.map((b) => (
                <tr key={b.id}>
                  <td>{b.requested_date || '—'}</td>
                  <td>
                    {b.requested_time
                      ? formatSlotTime(String(b.requested_time).slice(0, 5))
                      : '—'}
                  </td>
                  <td>{b.full_name}</td>
                  <td>{b.email}</td>
                  <td>{b.phone || '—'}</td>
                  <td>
                    {b.topic || '—'}
                    {b.preferred_times ? (
                      <>
                        {' · '}
                        <em>Prefers: {b.preferred_times}</em>
                      </>
                    ) : null}
                  </td>
                  <td>
                    <select
                      className="admin-status-sel"
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option value={s} key={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MembersPanel({ active }) {
  const [rows, setRows] = useState(null)
  const [failed, setFailed] = useState(false)

  const load = useCallback(async () => {
    if (!sb) {
      setFailed(true)
      return
    }
    try {
      const { data, error } = await sb.rpc('admin_get_members')
      if (error) throw error
      setRows(data || [])
    } catch (e) {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    if (active) load()
  }, [active, load])

  // Reset links are sent by the site owner from here. Members clicking that
  // emailed link land on the set-new-password screen.
  const sendReset = async (email) => {
    if (!window.confirm('Email a password reset link to ' + email + '?')) return
    try {
      const r = await fetch(REGISTER_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'reset', email }),
      })
      const resp = await r.json()
      window.alert(
        resp && resp.ok
          ? 'Reset link sent to ' + email + '.'
          : 'Could not send the reset link. Try again in a few minutes.',
      )
    } catch (e) {
      window.alert('Could not reach the server. Please try again.')
    }
  }

  return (
    <div id="admin-panel-members" className={'admin-panel' + (active ? ' active' : '')}>
      <div className="admin-table-wrap">
        <table className="admin-table" id="admin-members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Owns</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {failed ? (
              <EmptyRow span={6}>{sb ? 'Could not load members.' : 'Not connected.'}</EmptyRow>
            ) : rows === null ? (
              <EmptyRow span={6}>Loading…</EmptyRow>
            ) : rows.length === 0 ? (
              <EmptyRow span={6}>No members yet.</EmptyRow>
            ) : (
              rows.map((m) => (
                <tr key={m.email}>
                  <td>{m.full_name || '—'}</td>
                  <td>{m.email}</td>
                  <td>{m.phone || '—'}</td>
                  <td>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td>{m.products && m.products.length ? m.products.join(', ') : '—'}</td>
                  <td>
                    <button
                      className="btn-back-portal"
                      style={SMALL_BTN}
                      onClick={() => sendReset(m.email)}
                    >
                      Send Reset
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AnnouncePanel({ active }) {
  const { loadAnnouncements } = useAnnouncements()
  const [rows, setRows] = useState(null)
  const [failed, setFailed] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [severity, setSeverity] = useState('info')
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    if (!sb) {
      setFailed(true)
      return
    }
    try {
      const { data, error } = await sb.rpc('admin_list_announcements')
      if (error) throw error
      setRows(data || [])
    } catch (e) {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    if (active) load()
  }, [active, load])

  const submit = async () => {
    setErr('')
    const t = title.trim()
    const b = body.trim()
    if (t.length < 2 || t.length > 120) {
      setErr('Title must be 2 to 120 characters.')
      return
    }
    if (b.length < 2 || b.length > 2000) {
      setErr('Message must be 2 to 2000 characters.')
      return
    }
    if (!sb) {
      setErr('Not connected.')
      return
    }
    try {
      const { error } = await sb.rpc('admin_create_announcement', {
        p_title: t,
        p_body: b,
        p_severity: severity,
        p_expires_at: null,
      })
      if (error) throw error
      setTitle('')
      setBody('')
      load()
      loadAnnouncements()
    } catch (e) {
      setErr('Could not post the announcement. Please try again.')
    }
  }

  const toggleActive = async (id, nextActive) => {
    if (!sb) return
    try {
      await sb.rpc('admin_set_announcement_active', { p_id: id, p_active: nextActive })
      load()
      loadAnnouncements()
    } catch (e) {
      console.warn('[admin] toggle failed', e)
    }
  }

  const remove = async (id) => {
    if (!sb) return
    try {
      await sb.rpc('admin_delete_announcement', { p_id: id })
      load()
      loadAnnouncements()
    } catch (e) {
      console.warn('[admin] delete failed', e)
    }
  }

  return (
    <div id="admin-panel-announce" className={'admin-panel' + (active ? ' active' : '')}>
      <div className="announce-form">
        <div className="field">
          <label htmlFor="an-title">Title</label>
          <input
            type="text"
            id="an-title"
            maxLength={120}
            placeholder="e.g. New Product Launching Soon"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="an-body">Message</label>
          <textarea
            id="an-body"
            rows={4}
            maxLength={2000}
            style={TEXTAREA_STYLE}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Type</label>
          <div className="severity-row">
            {SEVERITIES.map(([value, label, cls]) => (
              <div
                key={value}
                className={
                  'severity-opt ' + cls + (severity === value ? ' active' : '')
                }
                onClick={() => setSeverity(value)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        <div
          id="an-err"
          style={{
            display: err ? 'block' : 'none',
            color: 'var(--red)',
            fontSize: '.78rem',
            marginBottom: '12px',
          }}
        >
          {err}
        </div>
        <button className="btn-primary" onClick={submit}>
          Post Announcement
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table" id="admin-announce-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Posted</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {failed ? (
              <EmptyRow span={5}>
                {sb ? 'Could not load announcements.' : 'Not connected.'}
              </EmptyRow>
            ) : rows === null ? (
              <EmptyRow span={5}>Loading…</EmptyRow>
            ) : rows.length === 0 ? (
              <EmptyRow span={5}>No announcements yet.</EmptyRow>
            ) : (
              rows.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.severity}</td>
                  <td>{new Date(a.created_at).toLocaleDateString()}</td>
                  <td>{a.active ? 'Active' : 'Off'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button
                      className="btn-back-portal"
                      style={{ ...SMALL_BTN, margin: '0 6px 0 0' }}
                      onClick={() => toggleActive(a.id, !a.active)}
                    >
                      {a.active ? 'Turn Off' : 'Turn On'}
                    </button>
                    <button
                      className="btn-back-portal"
                      style={{ ...SMALL_BTN, color: 'var(--red)' }}
                      onClick={() => remove(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { adminUser, doAdminLogout } = useAdmin()
  const [tab, setTab] = useState('bookings')

  useEffect(() => {
    if (!adminUser) navigate('/admin', { replace: true })
  }, [adminUser, navigate])

  if (!adminUser) return null

  const signOut = async () => {
    await doAdminLogout()
    navigate('/')
  }

  return (
    <div id="pg-admin-dashboard" className="page active">
      <nav className="portal-nav">
        <a
          href="#"
          className="logo"
          onClick={(e) => e.preventDefault()}
        >
          <img src={logo} alt="GTD Logo" />
          <div>
            <div className="logo-text">
              <span>Godra</span> Trading Desk
            </div>
            <div className="logo-sub">Admin Panel</div>
          </div>
        </a>
        <div className="portal-right">
          <button className="btn-logout" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="admin-body">
        <div className="admin-head">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="admin-tabs">
          <button
            className={'admin-tab' + (tab === 'bookings' ? ' active' : '')}
            data-tab="bookings"
            onClick={() => setTab('bookings')}
          >
            Call Bookings
          </button>
          <button
            className={'admin-tab' + (tab === 'members' ? ' active' : '')}
            data-tab="members"
            onClick={() => setTab('members')}
          >
            Members
          </button>
          <button
            className={'admin-tab' + (tab === 'announce' ? ' active' : '')}
            data-tab="announce"
            onClick={() => setTab('announce')}
          >
            Announcements
          </button>
        </div>

        <BookingsPanel active={tab === 'bookings'} />
        <MembersPanel active={tab === 'members'} />
        <AnnouncePanel active={tab === 'announce'} />
      </div>
    </div>
  )
}
