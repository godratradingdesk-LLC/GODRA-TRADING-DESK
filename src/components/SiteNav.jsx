import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/gtd-logo.png'
import { useAuth } from '../context/AuthContext'
import NotifBell from './NotifBell'

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, enterPortal } = useAuth()

  // A valid session already exists (restored on page load, or never signed
  // out) — no need to make them type their password again.
  const goToLogin = () => {
    setMenuOpen(false)
    if (user) enterPortal()
    else navigate('/login')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav>
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <img src={logo} alt="GTD Logo" />
          <div>
            <div className="logo-text">
              <span>Godra</span> Trading Desk
            </div>
            <div className="logo-sub">GTD Indicators &amp; Strategies</div>
          </div>
        </a>
        <ul className="nav-links">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#platforms">Platforms</a>
          </li>
          <li>
            <a href="#disclaimer">Disclaimer</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <div className="nav-right">
          <NotifBell />
          <button className="nav-cta" onClick={goToLogin}>
            Member Login
          </button>
          <button
            className={'nav-burger' + (menuOpen ? ' open' : '')}
            id="nav-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={'mobile-menu' + (menuOpen ? ' open' : '')} id="mobile-menu">
        <a href="#services" onClick={closeMenu}>
          Services
        </a>
        <a href="#about" onClick={closeMenu}>
          About
        </a>
        <a href="#platforms" onClick={closeMenu}>
          Platforms &amp; Partners
        </a>
        <a href="#disclaimer" onClick={closeMenu}>
          Disclaimer
        </a>
        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
        <button className="mm-login" onClick={goToLogin}>
          👑 &nbsp;Member Login
        </button>
      </div>
    </>
  )
}
