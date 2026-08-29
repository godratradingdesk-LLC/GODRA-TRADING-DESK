import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Guards the members area. Waits for the session-restore check before
 * redirecting, so a signed-in member who deep-links to /portal or refreshes
 * the page is not bounced to the sign-in screen while the session loads.
 *
 * This is a convenience gate, not a security boundary — the real protection is
 * server-side, where every RPC only ever reads the signed-in member's own row.
 */
export default function RequireAuth({ children }) {
  const { user, sessionChecked } = useAuth()
  const location = useLocation()

  if (!sessionChecked) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
