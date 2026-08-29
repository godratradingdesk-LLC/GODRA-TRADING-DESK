import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/gtd-logo.png'
import { useCart } from '../context/CartContext'
import NotifBell from './NotifBell'
import UserMenu from './UserMenu'

/** The shared members-area header: portal, profile, library and cart all use it. */
export default function PortalNav() {
  const { count } = useCart()
  const navigate = useNavigate()

  return (
    <nav className="portal-nav">
      <Link to="/portal" className="logo">
        <img src={logo} alt="GTD Logo" />
        <div>
          <div className="logo-text">
            <span>Godra</span> Trading Desk
          </div>
          <div className="logo-sub">Members Portal</div>
        </div>
      </Link>
      <div className="portal-right">
        <NotifBell />
        <div className="portal-member-badge">👑 Gold Member</div>
        <button className="btn-cart" onClick={() => navigate('/cart')}>
          🛒 Cart <span className={'cart-count' + (count > 0 ? ' has-items' : '')}>{count}</span>
        </button>
        <UserMenu />
      </div>
    </nav>
  )
}
