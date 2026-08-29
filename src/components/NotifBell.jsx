import { useEffect, useRef, useState } from 'react'
import { useAnnouncements } from '../context/AnnouncementsContext'
import { BellIcon } from './icons'

export default function NotifBell() {
  const { announcements, loading } = useAnnouncements()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Clicking anywhere else closes the dropdown.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  const n = announcements.length

  return (
    <div className={'notif-wrap' + (open ? ' open' : '')} ref={wrapRef}>
      <div
        className="notif-bell"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Notifications"
      >
        <BellIcon />
        <span className={'notif-badge' + (n > 0 ? ' show' : '')}>{n > 9 ? '9+' : String(n)}</span>
      </div>
      <div className="notif-dropdown">
        <div className="notif-head">Announcements</div>
        <div className="notif-list">
          {loading ? (
            <div className="notif-empty">Loading…</div>
          ) : n === 0 ? (
            <div className="notif-empty">No announcements right now.</div>
          ) : (
            announcements.map((a) => (
              <div className={'notif-item ' + (a.severity || '')} key={a.id}>
                <h4>{a.title}</h4>
                <p>{a.body}</p>
                <div className="t">
                  {new Date(a.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
