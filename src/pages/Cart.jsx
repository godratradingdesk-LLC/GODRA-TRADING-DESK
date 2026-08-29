import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNav from '../components/PortalNav'
import { useCart } from '../context/CartContext'
import { PRODUCTS } from '../lib/products'

const MONO = "'JetBrains Mono',monospace"

const TONE_COLOR = {
  error: 'var(--red)',
  success: 'var(--green)',
  gold: 'var(--gold-lt)',
}

export default function Cart() {
  const navigate = useNavigate()
  const {
    items,
    appliedPromo,
    totals,
    purchasableItems,
    removeFromCart,
    applyPromo,
    goToStripe,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [promoMsg, setPromoMsg] = useState(null) // { message, tone }
  const [promoLocked, setPromoLocked] = useState(false)
  const [showSplit, setShowSplit] = useState(false)
  const splitRef = useRef(null)

  const submitPromo = () => {
    const result = applyPromo(promoInput)
    setPromoMsg({ message: result.message, tone: result.tone })
    if (result.locked) setPromoLocked(true)
  }

  const checkout = () => {
    if (items.length === 0) return

    if (purchasableItems.length === 0) {
      window.alert(
        'This item is not yet available for purchase. Please contact support@godratradingdesk.com.',
      )
      return
    }

    // Stripe Payment Links carry a fixed set of line items, so one link
    // handles one product. A multi-item cart checks out one product at a time.
    if (purchasableItems.length === 1) {
      goToStripe(purchasableItems[0].name)
      return
    }

    setShowSplit(true)
    // Let the panel render before scrolling to it.
    requestAnimationFrame(() =>
      splitRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
    )
  }

  const { subtotal, monthlyTotal, hasMonthly, discount, total } = totals
  const empty = items.length === 0

  return (
    <div id="pg-cart" className="page active">
      <PortalNav />

      <div className="cart-page-inner">
        <div className="cart-header">
          <button className="btn-back-portal" onClick={() => navigate('/portal')}>
            ← Back to Members Area
          </button>
          <h1>Your Cart</h1>
          <p>
            Review your selected GTD bots. All purchases are final — strictly no refunds.
          </p>
        </div>

        <div className="cart-layout">
          {empty ? (
            <div className="cart-items cart-empty" id="cart-empty-state">
              <div className="cart-empty-icon">🛒</div>
              <h3>Your Cart Is Empty</h3>
              <p>Head back to the Members Area to add GTD bots to your cart.</p>
            </div>
          ) : (
            <div className="cart-items" id="cart-items-list">
              {items.map((item, idx) => (
                <div className="cart-item" key={item.name}>
                  <div className="cart-item-icon">
                    {(PRODUCTS[item.name] && PRODUCTS[item.name].icon) || '🤖'}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-sub">
                      {item.monthly ? `then $${item.monthly}/mo` : 'One-time payment'}{' '}
                      &nbsp;·&nbsp; Non-Refundable
                    </div>
                  </div>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(idx)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div id="summary-items">
              {!empty && discount > 0 && (
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              )}
              {items.map((item) => (
                <div key={item.name}>
                  <div className="summary-row">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  {item.monthly ? (
                    <div className="summary-row">
                      <span style={{ paddingLeft: '10px', opacity: 0.85 }}>
                        &#8627; First month subscription
                      </span>
                      <span>${item.monthly.toFixed(2)}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>Total Due Today</span>
              <span className="summary-total-price" id="cart-total">
                ${empty ? '0.00' : total.toFixed(2)}
              </span>
            </div>

            <div
              id="monthly-note"
              style={{
                fontSize: '.68rem',
                color: 'var(--muted)',
                fontFamily: MONO,
                marginBottom: '14px',
                display: !empty && hasMonthly ? 'block' : 'none',
              }}
            >
              Your first month is included in the total above.
              <br />
              You will then be billed <strong>${monthlyTotal.toFixed(2)} / month</strong> starting
              next month.
            </div>

            {/* PROMO CODE */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: '.6rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: '7px',
                }}
              >
                Promo Code
              </div>
              <div
                style={{
                  fontSize: '.57rem',
                  color: 'var(--muted)',
                  fontFamily: MONO,
                  lineHeight: 1.7,
                  marginBottom: '8px',
                }}
              >
                Enter your code here and it is applied automatically at secure checkout.
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  id="promo-input"
                  placeholder="Enter code..."
                  disabled={promoLocked}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitPromo()
                  }}
                  style={{
                    flex: 1,
                    background: 'var(--bg2)',
                    border: '1px solid ' + (promoMsg?.tone === 'success' ? 'var(--green)' : 'var(--border)'),
                    color: 'var(--white)',
                    fontFamily: MONO,
                    fontSize: '.75rem',
                    padding: '10px 12px',
                    borderRadius: '3px',
                    textTransform: 'uppercase',
                  }}
                />
                <button
                  onClick={submitPromo}
                  style={{
                    background: 'var(--panel)',
                    border: '1px solid var(--border)',
                    color: 'var(--gold)',
                    fontFamily: MONO,
                    fontSize: '.68rem',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    padding: '10px 16px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  Apply
                </button>
              </div>
              <div
                id="promo-msg"
                style={{
                  fontFamily: MONO,
                  fontSize: '.65rem',
                  marginTop: '6px',
                  display: promoMsg ? 'block' : 'none',
                  color: promoMsg ? TONE_COLOR[promoMsg.tone] : undefined,
                }}
              >
                {promoMsg?.message}
              </div>
            </div>

            {/* DISCOUNT ROW (hidden until promo applied) */}
            <div
              id="discount-row"
              className="summary-row"
              style={{ display: discount > 0 ? 'flex' : 'none', color: 'var(--green)' }}
            >
              <span id="discount-label">Promo ({appliedPromo})</span>
              <span id="discount-amount" style={{ color: 'var(--green)', fontWeight: 700 }}>
                −${discount.toFixed(2)}
              </span>
            </div>

            <div className="no-refund-box">
              🚫 NO REFUNDS — ALL PURCHASES ARE STRICTLY NON-REFUNDABLE. NO EXCEPTIONS UNDER ANY
              CIRCUMSTANCES. BY PROCEEDING YOU AGREE ALL SALES ARE FINAL.
            </div>

            <button
              className="btn-checkout"
              id="btn-checkout"
              onClick={checkout}
              disabled={empty}
            >
              Proceed to Checkout via Stripe
            </button>

            <div
              id="checkout-split"
              ref={splitRef}
              style={{ display: showSplit ? 'block' : 'none' }}
            >
              <div className="split-note">
                Each product checks out separately through Stripe. Complete one, then come back for
                the next.
              </div>
              {purchasableItems.map((i) => (
                <button
                  className="btn-checkout split-btn"
                  key={i.name}
                  onClick={() => goToStripe(i.name)}
                >
                  Checkout {i.name} — ${i.price.toFixed(2)}
                </button>
              ))}
            </div>

            <div
              style={{
                fontSize: '.7rem',
                color: 'var(--muted)',
                textAlign: 'center',
                marginBottom: '8px',
                fontFamily: MONO,
              }}
            >
              Secured by Stripe · 256-bit SSL
            </div>
            <div className="checkout-msg">
              Your card statement will show <strong>&ldquo;Sold through Link&rdquo;</strong> &mdash;
              Stripe is the merchant of record for GTD purchases. Your receipt and invoice are
              emailed automatically.
            </div>
            <div
              style={{
                fontSize: '.62rem',
                color: 'var(--muted)',
                textAlign: 'center',
                marginBottom: '12px',
                fontFamily: MONO,
                lineHeight: 1.7,
              }}
            >
              By checking out you agree to the{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/terms')
                }}
                style={{ color: 'var(--gold-lt)', textDecoration: 'underline' }}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/privacy')
                }}
                style={{ color: 'var(--gold-lt)', textDecoration: 'underline' }}
              >
                Privacy Policy
              </a>
              .
            </div>
            <div className="payment-icons">
              <span className="pay-icon">Visa</span>
              <span className="pay-icon">Mastercard</span>
              <span className="pay-icon">Amex</span>
              <span className="pay-icon">Debit</span>
              <span className="pay-icon">BTC</span>
              <span className="pay-icon">ETH</span>
              <span className="pay-icon">USDC</span>
            </div>
            <div className="heat-strip"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
