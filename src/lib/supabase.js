import { createClient } from '@supabase/supabase-js'

// If the environment is misconfigured (missing .env, a bad build), the rest of
// the site — browsing, the cart, the disclaimer gate — must keep working. `sb`
// stays null and every caller checks it first, rather than letting one failed
// import take down everything that depends on this module.
let sb = null

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

try {
  if (url && key) {
    sb = createClient(url, key)
  } else {
    console.error('[auth] Supabase URL/key missing — copy .env.example to .env.')
  }
} catch (e) {
  console.error('[auth] Could not initialize the Supabase client:', e)
}

export { sb }

export const ENTITLEMENTS_URL =
  import.meta.env.VITE_ENTITLEMENTS_URL ||
  'https://otrrnmijgjkewhqfzxke.supabase.co/functions/v1/entitlements'

export const REGISTER_URL =
  import.meta.env.VITE_REGISTER_URL ||
  'https://otrrnmijgjkewhqfzxke.supabase.co/functions/v1/register'

export const AUTH_UNAVAILABLE =
  'Login is temporarily unavailable. Please refresh the page and try again in a moment.'
