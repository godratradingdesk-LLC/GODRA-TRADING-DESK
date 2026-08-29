import { useEffect, useState } from 'react'
import logo from '../assets/gtd-logo.png'

/**
 * The risk-disclosure gate. It opens over whatever page is underneath on first
 * load, and the footer's "Risk Disclaimer" link reopens it later.
 */
export default function DisclaimerGate({ open, onAccept, onDecline }) {
  const [checked, setChecked] = useState(false)
  const [shake, setShake] = useState(false)
  const [leaving, setLeaving] = useState(false)

  // Reset the card whenever it is reopened from the footer.
  useEffect(() => {
    if (open) {
      setChecked(false)
      setShake(false)
      setLeaving(false)
    }
  }, [open])

  const accept = () => {
    if (!checked) {
      setShake(false)
      // Let the class drop for a frame so the animation can restart.
      requestAnimationFrame(() => setShake(true))
      setTimeout(() => setShake(false), 1200)
      return
    }
    setLeaving(true)
    setTimeout(onAccept, 420)
  }

  if (!open) return null

  return (
    <div
      id="pg-disclaimer"
      className="page active"
      style={leaving ? { transition: 'opacity .45s ease', opacity: 0 } : undefined}
    >
      <div className={'disc-wrap' + (shake ? ' disc-shake' : '')} id="disc-card">
        <div className="disc-top">
          <div className="disc-logo">
            <img src={logo} alt="GTD Logo" />
            <div className="wm">
              <span>Godra</span> Trading Desk
            </div>
          </div>
          <div className="disc-badge">⚠ Important — Read Before Entering</div>
          <h1>Risk Disclosure &amp; Legal Disclaimer</h1>
          <p>
            By clicking "I Accept" you confirm you have read and agreed to all terms below. Please
            scroll to read the full disclaimer.
          </p>
        </div>

        <div className="disc-body">
          <p>
            <strong>
              PLEASE READ THIS DISCLAIMER IN FULL BEFORE ENTERING THE GODRA TRADING DESK WEBSITE
              ("GTD").
            </strong>{' '}
            By accessing this site or purchasing any GTD product, you unconditionally agree to all
            terms herein.
          </p>

          <div className="disc-hl">
            ⚠ THIS IS NOT FINANCIAL ADVICE. GTD is a software &amp; information provider — NOT a
            registered investment advisor, broker-dealer, financial planner, or commodity trading
            advisor (CTA). Nothing on this website constitutes financial advice, investment advice,
            or a recommendation to buy or sell any asset.
          </div>

          <p>
            <strong>1. Not Financial Advice — Tools Only.</strong> GTD is designed to help traders
            trade. All GTD products (indicators, strategies, bots, content) are{' '}
            <strong>informational and analytical tools only</strong>. GTD does not advise you on any
            trade, and we do not take any responsibility for anybody's actions or trading decisions.
            The decision to trade — and all outcomes — are yours alone.
          </p>

          <p>
            <strong>2. Trading Is Speculative &amp; Carries Extreme Risk.</strong> Trading futures,
            forex, equities, options, and all other financial instruments is speculative and
            involves a <strong>substantial risk of loss</strong>. You may lose more than your
            initial deposit and more than your initial wealth if you are not paying close attention
            to your positions. Trading is not suitable for all individuals. Never trade money you
            cannot afford to lose entirely.
          </p>

          <p>
            <strong>3. GTD Is Only a Project Made for Trading.</strong> Godra Trading Desk is a
            trading tools project built by traders, for traders. It is not a financial institution,
            hedge fund, CTA, or regulated investment service of any kind. GTD exists solely to
            provide trading software and educational tools.
          </p>

          <p>
            <strong>4. No Guarantee of Performance.</strong> Past performance of any GTD tool,
            backtest, simulation, or example is <strong>not indicative of future results</strong>.
            Backtested results are hypothetical and prepared with hindsight. Actual live trading
            results will differ — potentially substantially. No representation is made that any
            strategy will achieve profits or losses similar to those shown.
          </p>

          <div className="disc-hl-red">
            🚫 ALL SALES ARE STRICTLY NON-REFUNDABLE — NO EXCEPTIONS WHATSOEVER. Once a product is
            delivered or a download link is provided, no refund, exchange, or credit will be issued
            under any circumstances. ALL PURCHASES ARE FINAL.
          </div>

          <p>
            <strong>5. Complete Limitation of Liability.</strong> To the maximum extent permitted by
            law, Godra Trading Desk expressly disclaims all liability — direct, indirect,
            incidental, special, or consequential — arising from use of any GTD product or from any
            trading decisions made with the aid of GTD tools. You irrevocably waive all claims
            against Godra Trading Desk related to trading outcomes, losses, or use of software.
          </p>

          <p>
            <strong>6. Losses Can Exceed Initial Deposit.</strong> In leveraged instruments
            (futures, forex, CFDs), losses can exceed your initial deposit and your total account
            balance. GTD indicators and bots do not prevent losses. If you are not actively
            monitoring your account, losses can accumulate rapidly. Trade only with capital you can
            afford to lose completely.
          </p>

          <p>
            <strong>7. Your Responsibility.</strong> Every trade you place is your decision alone.
            Consult a qualified financial advisor before risking any capital. You are accessing this
            site as an independent adult making autonomous financial decisions. GTD is not
            responsible for the outcome of any trade.
          </p>

          <p>
            <strong>8. No Solicitation.</strong> Nothing on this site constitutes a solicitation or
            offer to buy or sell any financial instrument. GTD products are software tools — their
            use does not constitute investment management or financial advisory services.
          </p>
        </div>

        <div className="disc-footer">
          <label
            className="disc-check-row"
            id="disc-label"
            style={shake ? { color: '#ff8888' } : undefined}
          >
            <input
              type="checkbox"
              id="disc-cb"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            I have read and fully understood this disclaimer. I am 18+ years old, I understand
            trading is speculative and involves substantial risk of loss that can exceed my initial
            deposit, and I acknowledge that{' '}
            <strong>all GTD purchases are strictly non-refundable under any circumstances</strong>.
          </label>
          <div className="disc-actions">
            <button className="btn-accept" onClick={accept}>
              ✓ &nbsp;I Accept — Enter Site
            </button>
            <button className="btn-decline" onClick={onDecline}>
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
