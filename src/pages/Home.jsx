import { useNavigate } from 'react-router-dom'
import kinetick from '../assets/kinetick.png'
import ninjatrader from '../assets/ninjatrader.png'
import Footer from '../components/Footer'
import SiteNav from '../components/SiteNav'
import { ApexIcon, DiscordIcon, ForexFactoryWordmark, TradovateWordmark } from '../components/icons'
import { useAuth } from '../context/AuthContext'

const SERVICES = [
  {
    icon: '📊',
    title: 'GTD Indicators',
    body: 'Custom NinjaTrader 8 indicators including order flow analysis, momentum oscillators, and session levels — precision-built for edge.',
  },
  {
    icon: '⚡',
    title: 'GTD Strategies',
    body: 'Fully coded, rule-based automated strategies for NinjaTrader 8. Backtest, optimize, and deploy systematic entries and exits with confidence.',
  },
  {
    icon: '🤖',
    title: 'GTD HedgeAlgo',
    body: 'Our flagship Gold Members-Only algorithmic strategy. Includes the HedgeAlgo crossover modules, customizable trailing stops, indicator signals, and the Order Manager bonus.',
  },
  {
    icon: '⚡',
    title: 'GTD Capital Engine',
    body: 'High-Frequency Trading bot based on live orderflow. Identifies and highlights fake trades, trading only on pure trend confirmation. The fastest GTD system.',
  },
  {
    icon: '🔧',
    title: 'Monthly Subscription Updates',
    body: 'All GTD products include ongoing monthly subscription updates. As we improve and refine our tools, every update is included with your subscription.',
  },
  {
    icon: '🛡️',
    title: 'Direct Support',
    body: 'Dedicated Gold Member support for installation, configuration, and getting the most from GTD tools. Contact the desk directly at any time.',
  },
]

const BARS = [
  ['NinjaTrader 8 Compatibility', 100],
  ['Strategy Backtest Accuracy', 78],
  ['Gold Member Retention Rate', 94],
  ['Indicator Suite Coverage', 90],
]

export default function Home({ onOpenDisclaimer }) {
  const navigate = useNavigate()
  const { user, enterPortal } = useAuth()

  const goToLogin = () => {
    if (user) enterPortal()
    else navigate('/login')
  }

  return (
    <div id="pg-main" className="page active">
      <SiteNav />

      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot"></span>NinjaTrader 8 · Live &amp; Active
          </div>
          <div className="hero-welcome-tag">Welcome to GTD — Godra Trading Desk</div>
          <h1>
            <span className="gold">GODRA</span>
            <br />
            TRADING
            <br />
            DESK
          </h1>
          <p className="hero-sub">
            Professional-grade indicators, strategies, and autotrading bots — built by traders, for
            traders. <strong>Your edge. Your decision. Your results.</strong>
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={goToLogin}>
              Member Login
            </button>
            <a href="#services" className="btn-outline">
              Explore Tools
            </a>
          </div>
        </div>
      </section>

      {/* PLATFORMS & PARTNERS */}
      <div className="platform-links" id="platforms">
        <div className="platform-label">Official Platforms &amp; Market Data Recommendations</div>
        <p className="partners-sub">
          GTD tools are built for these platforms — click a logo to visit the official site.
        </p>
        <div className="partners-grid">
          <a
            href="https://ninjatraderus.pxf.io/OYabRW"
            target="_blank"
            rel="noopener"
            className="partner-plate"
            aria-label="Visit NinjaTrader — official site"
          >
            <img src={ninjatrader} alt="NinjaTrader" className="partner-logo-img" loading="lazy" />
            <span className="partner-role">Futures Trading Platform · NT8</span>
            <span className="partner-visit">Visit ninjatrader.com ↗</span>
          </a>
          <a
            href="https://kinetick.com"
            target="_blank"
            rel="noopener"
            className="partner-plate"
            aria-label="Visit Kinetick — official site"
          >
            <img
              src={kinetick}
              alt="Kinetick — fast market data, unfiltered"
              className="partner-logo-img"
              loading="lazy"
            />
            <span className="partner-role">Recommended Market Data Feed</span>
            <span className="partner-visit">Visit kinetick.com ↗</span>
          </a>
          <a
            href="https://www.tradovate.com"
            target="_blank"
            rel="noopener"
            className="partner-plate"
            aria-label="Visit Tradovate — official site"
          >
            <TradovateWordmark />
            <span className="partner-role">Futures Broker &amp; Platform</span>
            <span className="partner-visit">Visit tradovate.com ↗</span>
          </a>
        </div>
        <div className="heat-strip partners-strip"></div>
        <div className="platform-row">
          <a
            href="https://apextraderfunding.com"
            target="_blank"
            rel="noopener"
            className="platform-btn"
          >
            <ApexIcon />
            Apex Trader Funding
          </a>
        </div>

        <div className="resources-block">
          <div className="resources-head">
            <span className="res-eyebrow">Free Trader Resources</span>
            <p className="res-sub">
              Independent third-party tools we recommend. GTD is not affiliated with, endorsed by,
              or partnered with these providers.
            </p>
          </div>

          <div className="resource-card">
            <a
              href="https://www.forexfactory.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="res-logo-link"
              aria-label="Visit Forex Factory"
            >
              <ForexFactoryWordmark />
            </a>
            <div className="res-info">
              <p className="res-desc">
                Real-time market data, charts, breaking news, and the most widely used economic
                calendar in trading &mdash; free, and running around the clock for over 20 years.
                Check the calendar before every session so a high-impact release doesn&rsquo;t catch
                your bot mid-trade.
              </p>
              <div className="res-links">
                <a
                  href="https://www.forexfactory.com/calendar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="res-link primary"
                >
                  📅 &nbsp;Economic Calendar
                </a>
                <a
                  href="https://www.forexfactory.com/news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="res-link"
                >
                  📰 &nbsp;Market News
                </a>
                <a
                  href="https://www.forexfactory.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="res-link"
                >
                  ↗ &nbsp;Visit Forex Factory
                </a>
              </div>
            </div>
          </div>

          <p className="res-note">
            Forex Factory® is a brand of Fair Economy, Inc. · Linked as a free public resource · GTD
            receives no compensation for this listing
          </p>
        </div>
      </div>

      <section id="disclaimer">
        <div className="section-tag">Legal</div>
        <h2 className="section-title">Disclaimer</h2>
        <p className="disclaimer-lead">
          Please read these disclosures carefully before using any Godra Trading Desk product. GTD
          builds software tools —{' '}
          <strong style={{ color: 'var(--text)' }}>
            we do not manage money and we do not give financial advice.
          </strong>{' '}
          Every trading decision, and every outcome, is yours alone.
        </p>

        <div className="disclaimer-grid">
          <div className="red-note span2">
            <span className="red-note-title">⚠ Risk Disclosure</span>
            Futures and forex trading contains substantial risk and is not for every investor. An
            investor could potentially lose all or more than the initial investment. Risk capital is
            money that can be lost without jeopardizing ones&rsquo; financial security or lifestyle.
            Only risk capital should be used for trading and only those with sufficient risk capital
            should consider trading. Past performance is not necessarily indicative of future
            results.
          </div>
          <div className="red-note span2">
            <span className="red-note-title">⚠ Hypothetical Performance Disclosure</span>
            Hypothetical performance results have many inherent limitations, some of which are
            described below. No representation is being made that any account will or is likely to
            achieve profits or losses similar to those shown; in fact, there are frequently sharp
            differences between hypothetical performance results and the actual results subsequently
            achieved by any particular trading program. One of the limitations of hypothetical
            performance results is that they are generally prepared with the benefit of hindsight.
            In addition, hypothetical trading does not involve financial risk, and no hypothetical
            trading record can completely account for the impact of financial risk of actual
            trading. For example, the ability to withstand losses or to adhere to a particular
            trading program in spite of trading losses are material points which can also adversely
            affect actual trading results. There are numerous other factors related to the markets
            in general or to the implementation of any specific trading program which cannot be
            fully accounted for in the preparation of hypothetical performance results and all which
            can adversely affect trading results.
          </div>
          <div className="red-note">
            <span className="red-note-title">⚠ Live Trade Room Disclosure</span>
            This presentation is for educational purposes only and the opinions expressed are those
            of the presenter only. All trades presented should be considered hypothetical and should
            not be expected to be replicated in a live trading account.
          </div>
          <div className="red-note">
            <span className="red-note-title">⚠ Testimonial Disclosure</span>
            Testimonials appearing on this website may not be representative of other clients or
            customers and is not a guarantee of future performance or success.
          </div>
        </div>

        <div className="disclaimer-foot">
          <div className="red-note">
            <span className="red-note-title">⚠ Not Financial Advice · No Refunds</span>
            <strong>
              GTD is a software &amp; information provider — not a registered investment advisor,
              broker-dealer, financial planner, or commodity trading advisor (CTA).
            </strong>{' '}
            Nothing on this website constitutes financial advice, investment advice, or a
            recommendation to buy or sell any asset. Trading futures, forex, equities, and options
            is speculative and carries a substantial risk of loss that can exceed your initial
            deposit.{' '}
            <strong>
              All GTD purchases are strictly non-refundable under any circumstances — no exceptions.
            </strong>{' '}
            By using this site or purchasing any GTD product, you unconditionally agree to all terms
            herein.
          </div>
        </div>
      </section>

      <section id="services" style={{ background: 'var(--bg2)' }}>
        <div className="section-tag">What We Offer</div>
        <h2 className="section-title">GTD Services &amp; Tools</h2>
        <p className="section-desc">
          Everything we build is designed to give serious traders a measurable edge — not to trade
          for you.
        </p>
        <div className="services-grid">
          {SERVICES.map((s) => (
            <div className="svc-card" key={s.title}>
              <div className="svc-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about">
        <div className="about-grid">
          <div className="about-stat-block">
            <div className="asl">GTD Performance Overview</div>
            <div className="asv">GTD</div>
            <div className="ass">
              Godra Trading Desk — Edge Tools for Independent Traders
            </div>
            {BARS.map(([label, pct]) => (
              <div className="bar-item" key={label}>
                <div className="bar-label">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            ))}
            <div className="heat-strip"></div>
          </div>
          <div className="about-text">
            <div className="section-tag">Who We Are</div>
            <h2 className="section-title">
              Built By Traders,
              <br />
              For Traders
            </h2>
            <p>
              Godra Trading Desk was built on a simple conviction: professional-grade tools should
              be available to independent traders — not just institutions.
            </p>
            <p>
              Every indicator, strategy, and bot is coded from the ground up in NinjaScript — no
              third-party bridges, no bloat. Plug in and go.
            </p>
            <p>
              GTD is a project made for trading. We do not manage your money. We do not give
              financial advice. We give you the edge — the decision is always yours.
            </p>
            <div className="about-tags">
              <span className="atag">NinjaTrader 8</span>
              <span className="atag">Hedge Algo</span>
              <span className="atag">ICT Concepts</span>
              <span className="atag">Gold Members</span>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-wrap" id="contact">
        <div className="contact-inner">
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            <span
              style={{
                width: '30px',
                height: '1px',
                background: 'var(--gold)',
                display: 'inline-block',
              }}
            ></span>
            Membership
          </div>
          <h2 className="section-title">Become a GTD Gold Member</h2>
          <p className="section-desc">
            Register with GTD to unlock exclusive access to autotrading bots, GTD Strategies, and
            all premium tools. Returning members sign in with their password, then their PIN if they
            set one.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/register')}
            style={{ marginBottom: '16px' }}
          >
            Create Account
          </button>
          &nbsp;&nbsp;
          <button className="btn-outline" onClick={goToLogin} style={{ marginBottom: '16px' }}>
            Member Login
          </button>
          <p className="contact-note">
            Registration takes 60 seconds &nbsp;·&nbsp; Password required &nbsp;·&nbsp; PIN optional
          </p>
          <div style={{ marginTop: '28px' }}>
            <a href="mailto:contact@godratradingdesk.com" className="contact-email">
              ✉ &nbsp;Contact GodraTradingDesk
            </a>
            <p className="contact-note" style={{ marginTop: '10px' }}>
              Membership inquiries &nbsp;·&nbsp; Product support &nbsp;·&nbsp; Install help
            </p>

            <div className="book-call-panel">
              <div className="bcp-icon">📅</div>
              <div className="bcp-copy">
                <h3>Book a Call</h3>
                <p>Talk to the desk directly. Pick a day and time that works for you.</p>
              </div>
              <button
                className="btn-login"
                style={{ width: 'auto', padding: '13px 24px' }}
                onClick={() => navigate('/book-call')}
              >
                Book a Call
              </button>
            </div>
          </div>

          <div className="discord-cta">
            <div className="discord-mark">
              <DiscordIcon />
            </div>
            <div className="discord-copy">
              <h3>Join the GTD Discord</h3>
              <p>
                Talk setups with other GTD traders, get install help, and hear about new releases
                first.
              </p>
            </div>
            <a
              href="https://discord.gg/AHHMM9tA6x"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-discord"
            >
              <DiscordIcon />
              Join Discord
            </a>
          </div>
        </div>
      </div>

      <Footer onOpenDisclaimer={onOpenDisclaimer} />
    </div>
  )
}
