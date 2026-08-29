import { useNavigate } from 'react-router-dom'
import logo from '../assets/gtd-logo.png'

/** Shared header for the Terms and Privacy pages. `current` marks which one. */
export default function LegalNav({ current }) {
  const navigate = useNavigate()

  return (
    <nav className="legal-nav">
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
          <div className="logo-sub">Legal</div>
        </div>
      </a>
      <div className="legal-nav-links">
        <button className="legal-nav-btn" onClick={() => navigate('/')}>
          ← Back to Site
        </button>
        {current === 'terms' ? (
          <button className="legal-nav-btn is-current" aria-current="page">
            Terms of Service
          </button>
        ) : (
          <button className="legal-nav-btn" onClick={() => navigate('/terms')}>
            Terms of Service
          </button>
        )}
        {current === 'privacy' ? (
          <button className="legal-nav-btn is-current" aria-current="page">
            Privacy Policy
          </button>
        ) : (
          <button className="legal-nav-btn" onClick={() => navigate('/privacy')}>
            Privacy Policy
          </button>
        )}
      </div>
    </nav>
  )
}
