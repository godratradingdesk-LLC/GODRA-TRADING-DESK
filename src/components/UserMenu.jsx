import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserMenu() {
  const { user, doLogout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  const name = (user && user.name) || 'Member'
  const email = (user && user.email) || ''
  const initial = (name.trim()[0] || 'G').toUpperCase()
  const first = name.trim().split(/\s+/)[0]

  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  const signOut = async () => {
    setOpen(false)
    await doLogout()
    navigate('/')
  }

  return (
    <div className={'user-menu' + (open ? ' open' : '')} ref={menuRef}>
      <div
        className="user-menu-btn"
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
      >
        <div className="user-avatar">{initial}</div>
        <span className="user-menu-name">{first}</span>
        <span className="user-menu-caret">▼</span>
      </div>
      <div className="user-dropdown">
        <div className="user-dd-head">
          <div className="n">{name}</div>
          <div className="e">{email}</div>
        </div>
        <button className="user-dd-item" onClick={() => go('/profile')}>
          <span className="ic">👤</span> Profile Account
        </button>
        <button className="user-dd-item" onClick={() => go('/library')}>
          <span className="ic">📥</span> Premium Library
        </button>
        <button className="user-dd-item" onClick={() => go('/portal')}>
          <span className="ic">🧰</span> Browse GTD Tools
        </button>
        <div className="user-dd-sep"></div>
        <button
          className="user-dd-item"
          onClick={() => window.open('https://discord.gg/AHHMM9tA6x', '_blank', 'noopener')}
        >
          <span className="ic">💬</span> Join GTD Discord
        </button>
        <button className="user-dd-item" onClick={() => go('/terms')}>
          <span className="ic">📄</span> Terms &amp; Privacy
        </button>
        <div className="user-dd-sep"></div>
        <button className="user-dd-item danger" onClick={signOut}>
          <span className="ic">⏻</span> Sign Out
        </button>
      </div>
    </div>
  )
}
