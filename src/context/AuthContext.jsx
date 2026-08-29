import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sb, REGISTER_URL, ENTITLEMENTS_URL, AUTH_UNAVAILABLE } from '../lib/supabase'
import { matchLocalProductKey } from '../lib/products'
import { EMAIL_RE } from '../lib/validation'

// ═══════════════════════════════════════════════════════════
//  REAL BACKEND — Supabase owns accounts
//  Passwords are hashed server-side by Supabase Auth (real bcrypt,
//  real sessions). Nothing password-shaped is ever stored in this
//  browser. The PIN is a genuine second factor, verified server-side
//  by a function that only ever checks the signed-in member's own row.
//
//  Entitlements come from the server too, which reads Stripe's own
//  purchase records — the same records the webhook writes after
//  verifying Stripe's signature. Nothing here can be spoofed by
//  editing the page.
// ═══════════════════════════════════════════════════════════

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// ─ Idle sign-out ─
// A member portal left open on a shared machine should not stay open.
const IDLE_MINUTES = 30

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [entitlements, setEntitlements] = useState(null)
  const [pendingLogin, setPendingLogin] = useState(null)
  const [sessionChecked, setSessionChecked] = useState(false)

  // Post-sign-in modal chain: gold disclosures → premium welcome → portal.
  const [showGoldDisclosures, setShowGoldDisclosures] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const idleTimer = useRef(null)
  // Read inside listeners without making them depend on the latest render.
  const userRef = useRef(null)
  userRef.current = user

  // ── Entitlements ──────────────────────────────────────────
  const applyProfile = useCallback((email, profile) => {
    setEntitlements({
      email,
      full_name: profile.full_name,
      phone: profile.phone,
      member_since: profile.member_since,
      has_pin: !!profile.has_pin,
      pin_length: profile.pin_length || 4,
      products: profile.products || [],
      owns_strategy: !!profile.owns_strategy,
    })
  }, [])

  const refreshEntitlements = useCallback(async () => {
    const current = userRef.current
    if (!current || !sb) return
    try {
      const { data, error } = await sb.rpc('get_my_profile')
      // Keep last known-good state rather than wipe it on a blip.
      if (error || !data || !data.length) return
      const profile = data[0]
      applyProfile(current.email, profile)
      if (profile.full_name) {
        setUser((u) => (u ? { ...u, name: profile.full_name } : u))
      }
    } catch (e) {
      console.warn('[entitlements] lookup failed — showing last known state', e)
    }
  }, [applyProfile])

  const purchases = useMemo(() => {
    if (!user || !entitlements || entitlements.email !== user.email) return []
    return (entitlements.products || [])
      .map((p) => matchLocalProductKey(p.name))
      .filter(Boolean)
  }, [user, entitlements])

  // Ownership is confirmed by the payment webhook, never by the page itself,
  // so this cannot be unlocked by editing the browser.
  const ownsStrategy = !!(
    user &&
    entitlements &&
    entitlements.email === user.email &&
    entitlements.owns_strategy
  )

  // ── Idle timeout ──────────────────────────────────────────
  // The timer fires long after render, but reading doLogout through a ref
  // keeps this independent of where doLogout is declared below.
  const logoutRef = useRef(null)

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    if (!userRef.current) return
    idleTimer.current = setTimeout(async () => {
      if (!userRef.current) return
      await logoutRef.current?.()
      window.alert(`You have been signed out after ${IDLE_MINUTES} minutes of inactivity.`)
    }, IDLE_MINUTES * 60 * 1000)
  }, [])

  useEffect(() => {
    const bump = () => {
      if (userRef.current) resetIdleTimer()
    }
    const events = ['click', 'keydown', 'touchstart', 'scroll']
    events.forEach((ev) => document.addEventListener(ev, bump, { passive: true }))
    return () => {
      events.forEach((ev) => document.removeEventListener(ev, bump))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [resetIdleTimer])

  // ── Register ──────────────────────────────────────────────
  // Registration goes through the GTD register function, which creates the
  // account and emails via Resend — bypassing Supabase Auth's SMTP entirely.
  const doRegister = useCallback(
    async ({ name, email, password, phone, pin }) => {
      if (!sb) return { ok: false, error: AUTH_UNAVAILABLE }

      let resp = null
      try {
        // Plain-text body = CORS "simple request": the browser sends the POST
        // directly with no OPTIONS preflight, so strict networks and extensions
        // have nothing extra to block. The server parses the JSON regardless.
        const r = await fetch(REGISTER_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'register', email, password, full_name: name, phone }),
        })
        resp = await r.json()
      } catch (e) {
        return {
          ok: false,
          error: 'Could not reach the server. Please check your connection and try again.',
        }
      }

      if (!resp || !resp.ok) {
        const code = resp && resp.error
        const message =
          code === 'exists'
            ? 'An account with this email already exists. Please sign in.'
            : code === 'rate_limited'
              ? 'Too many sign-up attempts right now. Please wait a few minutes and try again.'
              : code === 'weak_password'
                ? 'Password must be 8–16 characters with at least one number and one symbol.'
                : code === 'email_failed'
                  ? 'Your account was created but the confirmation email failed to send. Use "Resend the email" on the sign-in page in a few minutes.'
                  : 'Could not create your account. Please try again.'
        return { ok: false, error: message }
      }

      // No confirmation step — the account is live. Sign them straight in.
      const { error: siErr } = await sb.auth.signInWithPassword({ email, password })
      if (siErr) {
        return { ok: true, needsManualSignIn: true }
      }

      setUser({ email, name })
      userRef.current = { email, name }

      if (pin) {
        try {
          await sb.rpc('set_my_pin', { p_pin: pin })
        } catch (e) {
          console.warn('[auth] PIN could not be set at registration — add one later from Profile', e)
        }
      }
      await refreshEntitlements()
      resetIdleTimer()
      return { ok: true, name }
    },
    [refreshEntitlements, resetIdleTimer],
  )

  // ── Sign in, step 1 of 2: email + password ────────────────
  const doLogin = useCallback(
    async ({ email, password }) => {
      if (!sb) return { ok: false, error: AUTH_UNAVAILABLE }

      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) {
        const m = String(error.message || '')
        if (/email not confirmed/i.test(m)) {
          // The account is real but the confirmation link was never clicked.
          // Saying exactly that (with a resend option) beats a dead end.
          return { ok: false, error: 'unconfirmed' }
        }
        // Generic message for anything credential-shaped — anti-enumeration,
        // backed by Supabase Auth's own rate limiting.
        return {
          ok: false,
          error: /rate limit|too many/i.test(m)
            ? 'Too many attempts. Please wait a minute and try again.'
            : 'Incorrect email or password.',
        }
      }

      const { data: profileRows, error: profErr } = await sb.rpc('get_my_profile')
      const profile = profErr ? null : profileRows && profileRows[0]
      if (!profile) {
        await sb.auth.signOut()
        return { ok: false, error: 'Something went wrong loading your account. Please try again.' }
      }

      if (profile.pin_locked) {
        await sb.auth.signOut()
        return {
          ok: false,
          error:
            'Too many incorrect PIN attempts. Please try again in 15 minutes or contact support.',
        }
      }

      // Password is right. Members who set a PIN get step 2; members who
      // skipped it are signed in now.
      if (!profile.has_pin) {
        const nextUser = { email, name: profile.full_name || email }
        setUser(nextUser)
        userRef.current = nextUser
        applyProfile(email, profile)
        resetIdleTimer()
        setShowGoldDisclosures(true)
        return { ok: true, signedIn: true }
      }

      setPendingLogin({
        email,
        name: profile.full_name || email,
        pinLen: profile.pin_length || 4,
      })
      return { ok: true, needsPin: true }
    },
    [applyProfile, resetIdleTimer],
  )

  // ── Sign in, step 2 of 2: the PIN ─────────────────────────
  // Verified server-side by verify_my_pin(), which only ever checks the
  // signed-in member's own stored hash — never reachable for anyone else's
  // account, and locks for 15 minutes after 5 wrong attempts.
  const doPin = useCallback(
    async (pin) => {
      if (!pendingLogin) return { ok: false, error: 'no-pending' }
      if (!sb) return { ok: false, error: AUTH_UNAVAILABLE }

      const { data, error } = await sb.rpc('verify_my_pin', { p_pin: pin })
      if (error) {
        return { ok: false, error: 'Something went wrong verifying your PIN. Please try again.' }
      }

      const result = data && data[0]
      if (!result || !result.ok) {
        if (result && result.reason === 'locked') {
          setPendingLogin(null)
          await sb.auth.signOut()
          return { ok: false, error: 'locked' }
        }
        return { ok: false, error: 'Incorrect PIN. Please try again.' }
      }

      const { data: profileRows } = await sb.rpc('get_my_profile')
      const profile = profileRows && profileRows[0]
      const nextUser = {
        email: pendingLogin.email,
        name: (profile && profile.full_name) || pendingLogin.name,
      }
      setUser(nextUser)
      userRef.current = nextUser
      if (profile) applyProfile(pendingLogin.email, profile)
      setPendingLogin(null)
      resetIdleTimer()
      setShowGoldDisclosures(true)
      return { ok: true }
    },
    [pendingLogin, applyProfile, resetIdleTimer],
  )

  const cancelPinStep = useCallback(async () => {
    setPendingLogin(null)
    try {
      if (sb) await sb.auth.signOut()
    } catch (e) {
      /* already signed out */
    }
  }, [])

  // ── Password reset ────────────────────────────────────────
  const doSetNewPassword = useCallback(
    async (password) => {
      if (!sb) return { ok: false, error: AUTH_UNAVAILABLE }
      const { error } = await sb.auth.updateUser({ password })
      if (error) {
        return {
          ok: false,
          error:
            'Could not update your password — the link may have expired. Request a new reset email and try again.',
        }
      }
      // They arrived here from the emailed link, so a session already exists.
      try {
        const {
          data: { user: authUser },
        } = await sb.auth.getUser()
        const nextUser = {
          email: (authUser && authUser.email) || '',
          name:
            (authUser && authUser.user_metadata && authUser.user_metadata.full_name) ||
            (authUser && authUser.email) ||
            '',
        }
        setUser(nextUser)
        userRef.current = nextUser
      } catch (e) {
        /* session lookup failed — they can still sign in normally */
      }
      await refreshEntitlements()
      resetIdleTimer()
      return { ok: true }
    },
    [refreshEntitlements, resetIdleTimer],
  )

  const resendConfirmation = useCallback(async (email) => {
    if (!sb || !EMAIL_RE.test(email)) return null
    try {
      const r = await fetch(REGISTER_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'resend', email }),
      })
      const resp = await r.json()
      return resp && resp.ok
        ? `A one-time sign-in link was sent to ${email}.`
        : 'Could not resend right now. Please wait a few minutes and try again.'
    } catch (e) {
      return 'Could not resend right now. Please wait a few minutes and try again.'
    }
  }, [])

  // ── PIN management from the Profile page ──────────────────
  const setMyPin = useCallback(async (pin) => {
    if (!sb) return { ok: false, error: AUTH_UNAVAILABLE }
    try {
      const { error } = await sb.rpc('set_my_pin', { p_pin: pin || null })
      if (error) throw error
      setEntitlements((e) =>
        e ? { ...e, has_pin: !!pin, pin_length: pin ? pin.length : 4 } : e,
      )
      return { ok: true }
    } catch (e) {
      return { ok: false, error: 'Could not update your PIN right now. Please try again.' }
    }
  }, [])

  // ── Download link resend ──────────────────────────────────
  // A working download link can only be minted on the server, after a
  // verified payment — never here in the browser. This asks Supabase to
  // email a fresh, signed, expiring link to the address on the licence.
  const requestDownloadLink = useCallback(async () => {
    const current = userRef.current
    if (!current) return
    try {
      await fetch(ENTITLEMENTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: current.email, resend: true }),
      })
    } catch (e) {
      console.warn('[entitlements] resend request failed', e)
    }
  }, [])

  // ── Sign out ──────────────────────────────────────────────
  const doLogout = useCallback(async () => {
    try {
      if (sb) await sb.auth.signOut()
    } catch (e) {
      console.warn('[auth] sign-out request failed', e)
    }
    setUser(null)
    userRef.current = null
    setEntitlements(null)
    setPendingLogin(null)
    setShowGoldDisclosures(false)
    setShowPremiumModal(false)
    if (idleTimer.current) clearTimeout(idleTimer.current)
  }, [])
  logoutRef.current = doLogout

  // ── Modal chain ───────────────────────────────────────────
  const ackGoldDisclosures = useCallback(() => {
    setShowGoldDisclosures(false)
    setShowPremiumModal(true)
  }, [])

  const enterPortal = useCallback(async () => {
    setShowPremiumModal(false)
    await refreshEntitlements()
    navigate('/portal')
  }, [refreshEntitlements, navigate])

  // ── Restore a real session on page load ───────────────────
  // Supabase Auth keeps the session in this browser and refreshes it
  // automatically. If one is still valid, the member is recognised
  // silently — no page jump, no retyping — so "Member Login" just takes
  // them straight into the portal instead of asking for credentials again.
  useEffect(() => {
    let cancelled = false

    if (!sb) {
      setSessionChecked(true)
      return
    }

    // Arriving from a password-reset email: supabase-js reads the token from
    // the URL and fires PASSWORD_RECOVERY — that is our cue to show the
    // set-new-password screen instead of the normal landing page.
    const { data: sub } = sb.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') navigate('/reset-password')
    })

    ;(async () => {
      try {
        const {
          data: { session },
        } = await sb.auth.getSession()
        if (!cancelled && session && session.user && session.user.email) {
          const nextUser = {
            email: session.user.email,
            name:
              (session.user.user_metadata && session.user.user_metadata.full_name) ||
              session.user.email,
          }
          setUser(nextUser)
          userRef.current = nextUser
          await refreshEntitlements()
          resetIdleTimer()
        }
      } catch (e) {
        console.warn('[auth] session restore failed', e)
      } finally {
        if (!cancelled) setSessionChecked(true)
      }
    })()

    return () => {
      cancelled = true
      sub?.subscription?.unsubscribe()
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    user,
    entitlements,
    purchases,
    ownsStrategy,
    pendingLogin,
    sessionChecked,
    showGoldDisclosures,
    showPremiumModal,
    doRegister,
    doLogin,
    doPin,
    cancelPinStep,
    doSetNewPassword,
    resendConfirmation,
    setMyPin,
    requestDownloadLink,
    refreshEntitlements,
    doLogout,
    ackGoldDisclosures,
    enterPortal,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
