import { useEffect, useState } from 'react'
import PortalNav from '../components/PortalNav'
import TrainingBanner from '../components/TrainingBanner'
import { ForexFactoryWordmark } from '../components/icons'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const RED_BORDER = { borderColor: 'rgba(224,85,85,.2)', opacity: 0.88, position: 'relative' }
const RED_BAR = { background: 'linear-gradient(90deg,var(--red),#FF8A65)' }
const SOON_WRAP = {
  position: 'absolute',
  top: '18px',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  zIndex: 10,
  pointerEvents: 'none',
}
const SOON_PILL = {
  background: 'var(--red)',
  color: '#fff',
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: '.58rem',
  fontWeight: 700,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  padding: '5px 18px',
  boxShadow: '0 2px 18px rgba(224,85,85,.4)',
}
const SOON_PRICE_BLOCK = {
  background: 'rgba(224,85,85,.05)',
  borderColor: 'rgba(224,85,85,.2)',
}
const NOTIFY_LINK = {
  display: 'block',
  textAlign: 'center',
  marginTop: '10px',
  color: 'var(--muted)',
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: '.65rem',
  letterSpacing: '1px',
  textDecoration: 'underline',
}

/** The Add-to-Cart button, which flashes its own confirmation for 2 seconds. */
function AddToCartButton({ name, price, monthly }) {
  const { addToCart } = useCart()
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), 2000)
    return () => clearTimeout(t)
  }, [flash])

  const click = () => {
    const added = addToCart(name, price, monthly)
    setFlash(added ? '✓ Added to Cart!' : 'Already in Cart ✓')
  }

  return (
    <button className={'btn-add-cart' + (flash ? ' added' : '')} onClick={click}>
      {flash || <>🛒 &nbsp;Add to Cart — ${price}</>}
    </button>
  )
}

export default function Portal() {
  const { refreshEntitlements } = useAuth()

  useEffect(() => {
    refreshEntitlements()
  }, [refreshEntitlements])

  return (
    <div id="pg-portal" className="page active">
      <PortalNav />

      <div className="portal-body">
        <div className="res-strip">
          <span className="res-strip-label">Before You Trade &mdash;</span>
          <a
            href="https://www.forexfactory.com/calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="res-logo-link"
            aria-label="Forex Factory economic calendar"
          >
            <ForexFactoryWordmark />
          </a>
          <a
            href="https://www.forexfactory.com/calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="res-link primary"
          >
            📅 &nbsp;Check the Economic Calendar
          </a>
        </div>

        <TrainingBanner />

        <div className="portal-header">
          <h1>Gold Members Exclusive Area</h1>
          <p>
            Welcome back, Gold Member. Add any autotrading bot to your cart and check out securely
            via Stripe.
          </p>
          <div className="portal-gold-line"></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '6px' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            <span
              style={{
                width: '30px',
                height: '1px',
                background: 'var(--gold)',
                display: 'inline-block',
              }}
            ></span>
            GTD Autotrading Bots
          </div>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Your GTD Tools
          </h2>
          <p
            style={{
              color: 'var(--muted)',
              fontSize: '.82rem',
              maxWidth: '560px',
              margin: '8px auto 0',
            }}
          >
            All bots built for NinjaTrader 8. Add to cart and purchase via Stripe — Credit, Debit
            &amp; Crypto accepted.{' '}
            <strong style={{ color: 'var(--red)' }}>All purchases non-refundable.</strong>
          </p>
        </div>

        <div className="strategies-grid">
          {/* GTD HEDGE ALGO — BEST SELLER / FLAGSHIP */}
          <div className="strat-card" style={{ borderColor: 'rgba(201,168,76,.35)' }}>
            <div className="best-seller-ribbon">Best Seller</div>
            <div className="strat-top-bar"></div>
            <div className="strat-body">
              <div className="strat-type">▲ GTD Flagship · All-In-One Bundle</div>
              <h3>GTD HEDGE ALGO</h3>
              <p className="strat-tagline">
                The complete GTD autotrading engine. Includes the HedgeAlgo crossover modules,
                customizable trailing stops, standard indicator signals, and the exclusive Order
                Manager bonus — everything in one package.
              </p>
              <div className="strat-price-block">
                <div className="price-row">
                  <span className="price-was">$1,999</span>
                  <span style={{ width: '8px' }}></span>
                  <span className="price-one">$999.99</span>
                  <span className="price-label">50% OFF · one-time</span>
                </div>
                <div className="price-renewal">
                  then <strong>$99.99 / month</strong> subscription
                </div>
              </div>
              <div className="no-refund-badge">⚠ All Purchases Are Strictly Non-Refundable</div>
              <ul className="strat-includes">
                <li>HedgeAlgo crossover modules (NT8 .zip)</li>
                <li>Customizable trailing stops</li>
                <li>Standard indicator signals</li>
                <li>Order Manager Bonus — included</li>
                <li>Monthly subscription updates</li>
              </ul>
              <AddToCartButton name="GTD HEDGE ALGO" price={999.99} monthly={99.99} />
              <p className="download-note">
                NT8 .zip format &nbsp;·&nbsp; Stripe checkout &nbsp;·&nbsp; No refunds
              </p>
            </div>
          </div>

          {/* GTD ICT CONCEPTS — COMING SOON */}
          <div className="strat-card" style={RED_BORDER}>
            <div className="strat-top-bar" style={RED_BAR}></div>
            <div style={SOON_WRAP}>
              <div style={SOON_PILL}>⏳ COMING SOON</div>
            </div>
            <div className="strat-body" style={{ paddingTop: '44px' }}>
              <div className="strat-type" style={{ color: 'var(--red)' }}>
                ◆ GTD Indicators · Indicator Pack
              </div>
              <h3>GTD ICT Concepts</h3>
              <p className="strat-tagline">
                The complete ICT concepts indicator pack for NinjaTrader 8 — order blocks, fair
                value gaps, liquidity sweeps, market structure shifts, and killzone sessions, all in
                one bundle.
              </p>
              <div className="strat-price-block" style={SOON_PRICE_BLOCK}>
                <div className="price-row">
                  <span
                    className="price-one"
                    style={{ color: 'var(--red)', fontSize: '1.8rem', letterSpacing: '1px' }}
                  >
                    COMING SOON
                  </span>
                </div>
                <div className="price-renewal">Pricing &amp; launch date — announced soon</div>
              </div>
              <ul className="strat-includes">
                <li>Order blocks &amp; breaker blocks</li>
                <li>Fair value gaps (FVG)</li>
                <li>Liquidity sweeps &amp; stop runs</li>
                <li>Market structure shifts (BOS / CHoCH)</li>
                <li>Killzone session mapping</li>
              </ul>
              <div className="btn-lib-soon">⏳ &nbsp;Coming Soon — Stay Tuned</div>
              <p className="download-note">
                Notify the desk to be first in line when it launches
              </p>
              <a href="mailto:contact@godratradingdesk.com" style={NOTIFY_LINK}>
                ✉ Notify me when available
              </a>
            </div>
          </div>

          {/* GTD CAPITAL ENGINE — COMING SOON */}
          <div className="strat-card" style={RED_BORDER}>
            <div className="strat-top-bar" style={RED_BAR}></div>
            <div style={SOON_WRAP}>
              <div style={SOON_PILL}>⏳ COMING SOON</div>
            </div>
            <div className="strat-body" style={{ paddingTop: '44px' }}>
              <div className="strat-type" style={{ color: 'var(--red)' }}>
                ⚡ GTD HFT · Live Orderflow
              </div>
              <h3>GTD_CAPITAL_ENGINE</h3>
              <p className="strat-tagline">
                High-Frequency Trading bot based on pure live orderflow. Detects and highlights
                fake/spoofed trades in real-time, then executes only on confirmed pure trend.
                Ultra-fast HFT execution setup.
              </p>
              <div className="strat-price-block" style={SOON_PRICE_BLOCK}>
                <div className="price-row">
                  <span
                    className="price-one"
                    style={{ color: 'var(--red)', fontSize: '1.8rem', letterSpacing: '1px' }}
                  >
                    COMING SOON
                  </span>
                </div>
                <div className="price-renewal">Pricing &amp; launch date — announced soon</div>
              </div>
              <ul className="strat-includes">
                <li>Live orderflow signal engine</li>
                <li>Fake trade detection &amp; highlighting</li>
                <li>Pure trend-only execution</li>
                <li>Ultra-fast HFT order routing</li>
                <li>Exclusive — Gold Members only</li>
              </ul>
              <div
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: 'rgba(224,85,85,.12)',
                  border: '1px dashed rgba(224,85,85,.4)',
                  color: 'var(--red)',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '.72rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '13px 18px',
                  marginTop: '4px',
                  width: '100%',
                  cursor: 'default',
                }}
              >
                ⏳ &nbsp;Coming Soon — Stay Tuned
              </div>
              <p className="download-note">
                Notify the desk to be first in line when it launches
              </p>
              <a href="mailto:contact@godratradingdesk.com" style={NOTIFY_LINK}>
                ✉ Notify me when available
              </a>
            </div>
          </div>
        </div>

        <div className="portal-contact-banner">
          <div className="pcb-text">
            <h3>Need Help or Have Questions?</h3>
            <p>
              For installation support, product questions, or membership inquiries — contact the
              desk directly.
            </p>
          </div>
          <a href="mailto:contact@godratradingdesk.com" className="pcb-email">
            ✉ &nbsp;Contact GodraTradingDesk
          </a>
        </div>

        <div className="portal-disc">
          <strong>⚠ RISK REMINDER — THIS IS NOT FINANCIAL ADVICE:</strong> All GTD products are
          informational software tools only and do not constitute financial advice, investment
          advice, or any recommendation to trade. We do not take any responsibility for anybody's
          trading actions or decisions.{' '}
          <strong>
            ALL PURCHASES FROM GODRA TRADING DESK ARE STRICTLY NON-REFUNDABLE — NO EXCEPTIONS
            WHATSOEVER.
          </strong>{' '}
          Trading is speculative and involves substantial risk of loss that can exceed your initial
          deposit and initial wealth if you are not paying attention. Past performance does not
          guarantee future results. You are solely responsible for all trading decisions. GTD is
          only a project made for trading — it is not a registered financial advisor, broker, or
          CTA.
        </div>
      </div>
    </div>
  )
}
