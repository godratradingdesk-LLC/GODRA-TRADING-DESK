import { createContext, useCallback, useContext, useState } from 'react'
import { sb, AUTH_UNAVAILABLE } from '../lib/supabase'

// ═══════════════════════════════════════════════════════════
//  ADMIN — separate identity check from member login. Signing in
//  successfully only proves a valid Supabase account; am_i_admin()
//  is what actually gates access, checked server-side every time.
// ═══════════════════════════════════════════════════════════

const AdminContext = createContext(null)

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>')
  return ctx
}

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null)
  const [pendingAdmin, setPendingAdmin] = useState(null)

  const doAdminLogin = useCallback(async ({ email, password }) => {
    if (!sb) return { ok: false, error: AUTH_UNAVAILABLE }

    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: 'Incorrect email or password.' }

    const { data: adminRows, error: adminErr } = await sb.rpc('am_i_admin')
    const info = adminErr ? null : adminRows && adminRows[0]

    if (!info || !info.is_admin) {
      // A real account, but not an admin — sign out immediately rather than
      // leaving a non-admin session sitting active on this page.
      await sb.auth.signOut()
      return { ok: false, error: 'This account does not have admin access.' }
    }

    if (info.pin_locked) {
      await sb.auth.signOut()
      return {
        ok: false,
        error: 'Too many incorrect PIN attempts. Please try again in 30 minutes.',
      }
    }

    setPendingAdmin({ email, pinLength: info.pin_length || 4 })
    return { ok: true, needsSetPin: !info.has_pin, pinLength: info.pin_length || 4 }
  }, [])

  const saveAdminSetupPin = useCallback(async (pin) => {
    if (!/^\d{4,6}$/.test(pin)) return { ok: false, error: 'PIN must be 4 to 6 digits.' }
    if (!sb) return { ok: false, error: AUTH_UNAVAILABLE }
    try {
      const { error } = await sb.rpc('set_admin_pin', { p_pin: pin })
      if (error) throw error
      setAdminUser(pendingAdmin)
      setPendingAdmin(null)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: 'Could not save your PIN. Please try again.' }
    }
  }, [pendingAdmin])

  const doAdminPin = useCallback(
    async (pin) => {
      if (!pendingAdmin) return { ok: false, error: 'no-pending' }
      if (!/^\d{4,6}$/.test(pin)) return { ok: false, error: 'Enter all digits.' }
      if (!sb) return { ok: false, error: AUTH_UNAVAILABLE }

      const { data, error } = await sb.rpc('verify_admin_pin', { p_pin: pin })
      if (error) return { ok: false, error: 'Something went wrong. Please try again.' }

      const result = data && data[0]
      if (!result || !result.ok) {
        if (result && result.reason === 'locked') {
          await sb.auth.signOut()
          setPendingAdmin(null)
          return { ok: false, error: 'locked' }
        }
        return { ok: false, error: 'Incorrect PIN.' }
      }

      setAdminUser(pendingAdmin)
      setPendingAdmin(null)
      return { ok: true }
    },
    [pendingAdmin],
  )

  const cancelAdminPinStep = useCallback(async () => {
    setPendingAdmin(null)
    try {
      if (sb) await sb.auth.signOut()
    } catch (e) {
      /* already signed out */
    }
  }, [])

  const doAdminLogout = useCallback(async () => {
    setAdminUser(null)
    setPendingAdmin(null)
    try {
      if (sb) await sb.auth.signOut()
    } catch (e) {
      /* already signed out */
    }
  }, [])

  const value = {
    adminUser,
    pendingAdmin,
    doAdminLogin,
    doAdminPin,
    saveAdminSetupPin,
    cancelAdminPinStep,
    doAdminLogout,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
