import { useNavigate } from 'react-router-dom'
import logo from '../assets/gtd-logo.png'
import RiskNote from './RiskNote'
import {
  DiscordIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from './icons'

export default function Footer({ onOpenDisclaimer }) {
  const navigate = useNavigate()

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <a
            href="#"
            className="logo"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <img src={logo} alt="GTD Logo" style={{ width: '36px', height: '36px' }} />
            <div>
              <div className="logo-text">
                <span>Godra</span> Trading Desk
              </div>
              <div className="logo-sub">GTD Indicators &amp; Strategies</div>
            </div>
          </a>
          <p>
            Professional NinjaTrader 8 indicators and autotrading bots. Built by traders, for
            traders. All sales strictly non-refundable. Use at your own risk. Not financial advice.
          </p>

          <div className="footer-social">
            <span className="social-label">Follow The Desk</span>
            <div className="social-links">
              <a
                href="https://discord.gg/AHHMM9tA6x"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn discord"
                title="Discord"
                aria-label="Join the GTD Discord"
              >
                <DiscordIcon />
              </a>
              <a
                href="https://www.youtube.com/@GodraTradingdesk"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                title="YouTube"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591941150797"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                title="Facebook"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/godratradingdesk/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                title="Instagram"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.tiktok.com/@godratradingdesk"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                title="TikTok"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h5>Products</h5>
          <ul>
            <li>
              <a href="#">GTD HedgeAlgo</a>
            </li>
            <li>
              <a href="#">GTD Capital Engine</a>
            </li>
            <li>
              <a href="#">GTD Indicators</a>
            </li>
            <li>
              <a href="#">GTD ICT Concepts</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Platforms</h5>
          <ul>
            <li>
              <a href="https://ninjatraderus.pxf.io/OYabRW" target="_blank" rel="noopener">
                NinjaTrader 8
              </a>
            </li>
            <li>
              <a href="https://tradovate.com" target="_blank" rel="noopener">
                Tradovate
              </a>
            </li>
            <li>
              <a href="https://kinetick.com" target="_blank" rel="noopener">
                Kinetick Market Data
              </a>
            </li>
            <li>
              <a href="https://apextraderfunding.com" target="_blank" rel="noopener">
                Apex Trader Funding
              </a>
            </li>
            <li>
              <a href="https://www.forexfactory.com/" target="_blank" rel="noopener noreferrer">
                Forex Factory (free)
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/AHHMM9tA6x"
                target="_blank"
                rel="noopener noreferrer"
              >
                GTD Discord Community
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Legal</h5>
          <ul>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onOpenDisclaimer?.()
                }}
              >
                Risk Disclaimer
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/terms')
                }}
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/privacy')
                }}
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{ color: 'var(--red)', fontWeight: 600 }}
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/terms')
                }}
              >
                No Refund Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <RiskNote className="footer-risk-note" />

      {/* ═══ LEGAL & RISK DISCLAIMER ═══ */}
      <div style={{ borderTop: '1px solid var(--edge)', marginTop: '30px', paddingTop: '28px' }}>
        <h5
          style={{
            fontSize: '.72rem',
            letterSpacing: '2px',
            color: 'var(--gold-lt,#F0D68C)',
            marginBottom: '14px',
          }}
        >
          LEGAL &amp; RISK DISCLAIMER
        </h5>
        <div
          style={{
            fontSize: '.66rem',
            lineHeight: 1.85,
            color: 'var(--muted,#8A94A3)',
            maxWidth: '1100px',
          }}
        >
          <p style={{ margin: '0 0 12px' }}>
            Godra Trading Desk (&ldquo;GTD&rdquo;) is a technology and software development company.
            GTD does <strong style={{ color: '#B4BDC9' }}>not</strong> provide personalized
            financial, investment, tax, legal, or trading advice, and does not act as a Commodity
            Trading Advisor (CTA), registered broker-dealer, financial planner, or fiduciary of any
            kind. All software, algorithms, automated strategies, indicators, tools, and
            instructional materials are provided strictly for educational and informational
            purposes. Nothing on this website constitutes financial advice, a trade recommendation,
            or a solicitation or offer to buy or sell futures, options, forex, or any other
            financial instrument.
          </p>
          <p style={{ margin: '0 0 12px' }}>
            <strong style={{ color: '#B4BDC9' }}>Substantial risk of loss.</strong> Trading futures,
            forex, and options involves substantial risk of loss and is not suitable for every
            investor. You may lose all of your initial investment &mdash; and in leveraged products,
            more than your initial investment. Never trade with money you cannot afford to lose.
            Past performance of any trading system or methodology is not necessarily indicative of
            future results.
          </p>
          <p style={{ margin: '0 0 12px' }}>
            <strong style={{ color: '#B4BDC9' }}>You are solely responsible for your actions.</strong>{' '}
            Every trading and investment decision made in your account is yours alone. By using this
            website or any GTD product, you acknowledge and agree that GTD, its owners, employees,
            and affiliates shall never be held responsible or liable &mdash; to the maximum extent
            permitted by law &mdash; for any trading decision you make, any action you take, or any
            loss, damage, or consequence (direct, indirect, incidental, special, or consequential)
            arising from the use of any GTD product or this website. You use GTD tools entirely at
            your own risk, and you irrevocably waive all claims against GTD relating to trading
            outcomes. If you do not agree, do not use this website or any GTD product. Consult a
            qualified, licensed financial advisor before risking any capital.
          </p>
          <p style={{ margin: '0 0 12px', textTransform: 'uppercase' }}>
            <strong style={{ color: '#B4BDC9' }}>
              U.S. Government required disclaimer &mdash; CFTC Rule 4.41:
            </strong>{' '}
            The performance of trading systems is based on the use of computerized system logic on
            CSI data. It is hypothetical. Please note the following disclaimer. CFTC Rule 4.41:
            Hypothetical or simulated performance results have certain limitations. Unlike an actual
            performance record, simulated results do not represent actual trading. Also, since the
            trades have not been executed, the results may have under-or-over compensated for the
            impact, if any, of certain market factors, such as lack of liquidity. Simulated trading
            programs in general are also subject to the fact that they are designed with the benefit
            of hindsight. No representation is being made that any account will or is likely to
            achieve profit or losses similar to those shown. U.S. Government required disclaimer:
            Commodity Futures Trading Commission. Futures and options trading has large potential
            rewards, but also large potential risk. You must be aware of the risks and be willing to
            accept them in order to invest in the futures and options markets. Don&rsquo;t trade with
            money you can&rsquo;t afford to lose. This is neither a solicitation nor an offer to
            buy/sell futures or options. No representation is being made that any account will or is
            likely to achieve profits or losses similar to those discussed on this website. The past
            performance of any trading system or methodology is not necessarily indicative of future
            results.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#B4BDC9' }}>
              CTA registration exemption &mdash; CFTC Rule 4.14(a)(9).
            </strong>{' '}
            GTD operates under the self-executing exemption from CTA registration provided by CFTC
            Rule 4.14(a)(9). GTD sells standardized, non-personalized software: every customer
            receives identical, off-the-shelf strategy code and indicator logic, never tailored to
            any individual&rsquo;s account size, financial situation, or risk profile. Customers
            install and run all GTD software on their own trading platform (e.g., NinjaTrader) using
            their own brokerage accounts; GTD never holds power of attorney, never manages, pools,
            or accesses customer funds or accounts, and never executes trades on any
            customer&rsquo;s behalf. GTD makes no guarantee of profit whatsoever, and no GTD
            statement should ever be read as a promise or projection of trading results.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          © 2026 GODRA TRADING DESK — ALL RIGHTS RESERVED
          <br />
          <a
            href="#"
            className="footer-admin-link"
            onClick={(e) => {
              e.preventDefault()
              navigate('/admin')
            }}
          >
            Admin
          </a>
        </div>
        <div className="footer-legal">
          GTD products are informational tools only. THIS IS NOT FINANCIAL ADVICE. We do not take
          responsibility for anyone's trading decisions. All sales are strictly non-refundable.
          Trading is speculative and can result in losses exceeding your initial deposit.
        </div>
      </div>
    </footer>
  )
}
