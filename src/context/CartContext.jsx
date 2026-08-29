import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PRODUCTS, PROMO_CODES } from '../lib/products'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [appliedPromo, setAppliedPromo] = useState(null)
  // Codes typed at the cart that are not in PROMO_CODES are passed to Stripe
  // unchanged. Stripe decides whether they are real. This is how owner-issued
  // codes work without ever being written into this bundle.
  const [pendingPromoCode, setPendingPromoCode] = useState(null)

  /** Returns true if the item was newly added, false if it was already there —
   *  the button uses that to pick between "Added" and "Already in Cart". */
  const addToCart = useCallback(
    (name, price, monthly) => {
      if (items.some((i) => i.name === name)) return false
      setItems((prev) =>
        prev.some((i) => i.name === name) ? prev : [...prev, { name, price, monthly }],
      )
      return true
    },
    [items],
  )

  const isInCart = useCallback((name) => items.some((i) => i.name === name), [items])

  const removeFromCart = useCallback(
    (idx) => {
      const next = items.filter((_, i) => i !== idx)
      setItems(next)
      // Re-validate the promo after item removal — a code tied to a product
      // that is no longer in the cart stops applying.
      if (appliedPromo) {
        const promo = PROMO_CODES[appliedPromo]
        if (promo && promo.appliesTo && !next.find((i) => i.name === promo.appliesTo)) {
          setAppliedPromo(null)
        }
      }
    },
    [items, appliedPromo],
  )

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedPromo(null)
    setPendingPromoCode(null)
  }, [])

  // Signing out empties the cart, as it did before — a cart belongs to the
  // member who filled it, not to the browser tab.
  const wasSignedIn = useRef(false)
  useEffect(() => {
    if (wasSignedIn.current && !user) clearCart()
    wasSignedIn.current = !!user
  }, [user, clearCart])

  /** Returns { ok, message, tone } so the cart can render the promo feedback. */
  const applyPromo = useCallback(
    (raw) => {
      const code = String(raw || '').trim().toUpperCase()
      if (!code) return { ok: false, message: 'Please enter a promo code.', tone: 'error' }
      if (appliedPromo)
        return {
          ok: false,
          message: 'A promo code is already applied. Remove it first.',
          tone: 'error',
        }

      const promo = PROMO_CODES[code]
      if (!promo) {
        // Not a public code. It may still be a valid owner-issued code, so
        // carry it to Stripe rather than calling it invalid here.
        setPendingPromoCode(code)
        return {
          ok: true,
          locked: true,
          message: 'Code saved — it will be checked and applied at secure checkout.',
          tone: 'gold',
        }
      }

      setPendingPromoCode(code)

      if (promo.appliesTo && !items.find((i) => i.name === promo.appliesTo)) {
        return {
          ok: false,
          message: `This code only applies to ${promo.appliesTo}. Add it to your cart first.`,
          tone: 'error',
        }
      }

      setAppliedPromo(code)
      return {
        ok: true,
        locked: true,
        message: '✓ Code applied — ' + promo.description,
        tone: 'success',
      }
    },
    [appliedPromo, items],
  )

  // ── Totals ────────────────────────────────────────────────
  const totals = useMemo(() => {
    let subtotal = 0
    let monthlyTotal = 0
    let hasMonthly = false

    items.forEach((item) => {
      subtotal += item.price
      // Stripe charges the first month up front, so it belongs in today's total.
      if (item.monthly) {
        hasMonthly = true
        monthlyTotal += item.monthly
        subtotal += item.monthly
      }
    })

    let discount = 0
    if (appliedPromo && PROMO_CODES[appliedPromo]) {
      const promo = PROMO_CODES[appliedPromo]
      // Only apply if the applicable item is still in the cart.
      if (!promo.appliesTo || items.find((i) => i.name === promo.appliesTo)) {
        discount = Math.min(promo.discount, subtotal) // Can't discount more than total
      }
    }

    return { subtotal, monthlyTotal, hasMonthly, discount, total: subtotal - discount }
  }, [items, appliedPromo])

  // ── Checkout ──────────────────────────────────────────────
  const goToStripe = useCallback(
    (name) => {
      const p = PRODUCTS[name]
      if (!p || !p.stripeUrl) return
      // Pre-fill the buyer's email so the Stripe receipt, the invoice and the
      // licence all land on the same address they registered with.
      const params = []
      if (user && user.email) {
        params.push('prefilled_email=' + encodeURIComponent(user.email))
      }
      // Stripe applies and validates the code itself. If it is wrong or
      // expired, Stripe says so at checkout — the site never decides.
      const code = pendingPromoCode || appliedPromo
      if (code) {
        params.push('prefilled_promo_code=' + encodeURIComponent(code))
      }
      const url =
        p.stripeUrl + (params.length ? (p.stripeUrl.includes('?') ? '&' : '?') + params.join('&') : '')
      window.open(url, '_blank', 'noopener')
    },
    [user, pendingPromoCode, appliedPromo],
  )

  /** Stripe Payment Links carry a fixed set of line items, so one link handles
   *  one product. A multi-item cart checks out one product at a time. */
  const purchasableItems = useMemo(
    () => items.filter((i) => PRODUCTS[i.name] && PRODUCTS[i.name].stripeUrl),
    [items],
  )

  const value = {
    items,
    count: items.length,
    appliedPromo,
    totals,
    purchasableItems,
    addToCart,
    isInCart,
    removeFromCart,
    clearCart,
    applyPromo,
    goToStripe,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
