import { useNavigate } from 'react-router-dom'
import LegalNav from '../components/LegalNav'

export default function Terms() {
  const navigate = useNavigate()

  return (
    <div id="pg-terms" className="page active">
      <LegalNav current="terms" />

      <div className="legal-body">
        <div className="legal-head">
          <div className="legal-eyebrow">Godra Trading Desk (GTD)</div>
          <h1>Terms of Service &amp; Terms and Conditions</h1>
          <div className="legal-updated">Last Updated: July 2026</div>
        </div>

        <p className="legal-intro">
          Welcome to Godra Trading Desk (&ldquo;GTD,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;). Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully
          before using our website, software, indicators, strategies, trading tools, or educational
          materials (collectively, the &ldquo;Services&rdquo;).
        </p>
        <p className="legal-intro">
          By accessing our website, purchasing any product, downloading any software, or clicking
          &ldquo;I Agree,&rdquo; you{' '}
          <strong>unconditionally agree to be bound by these Terms</strong>. If you do not agree,
          you are prohibited from accessing or using our Services.
        </p>

        <div className="legal-sec">
          <h2>
            <span className="num">1.</span>Educational &amp; Software Tools Only (Not Financial
            Advice)
          </h2>
          <ul className="legal-list">
            <li>
              <span className="lead">Nature of Business:</span> GTD is strictly a software
              development and educational information provider. We are <strong>NOT</strong> a
              registered investment advisor, broker-dealer, financial planner, or Commodity Trading
              Advisor (CTA).
            </li>
            <li>
              <span className="lead">No Financial Advice:</span> Nothing contained on our website,
              in our software, or within our educational communications constitutes financial,
              investment, legal, or tax advice, nor is it a solicitation or offer to buy or sell any
              financial instrument.
            </li>
            <li>
              <span className="lead">Educational Purpose:</span> All GTD content, live trade rooms,
              webinars, signals, and materials are provided solely for educational and analytical
              purposes.
            </li>
            <li>
              <span className="lead">Autonomous Decision-Making:</span> All GTD products
              (indicators, strategies, bots, content) are tools designed to assist your own
              independent market analysis. GTD does not advise you on any trade.{' '}
              <strong>Every trading decision you make is yours alone.</strong>
            </li>
          </ul>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">2.</span>Complete Disclaimer of Responsibility &amp; Risk
            Acknowledgment
          </h2>
          <ul className="legal-list">
            <li>
              <span className="lead">Absolute Non-Liability:</span> Godra Trading Desk (GTD) and its
              operators, owners, employees, and affiliates take <strong>zero responsibility</strong>{' '}
              and shall{' '}
              <strong>
                NOT be held liable for any trading losses, financial damages, lost profits, or
                account liquidations
              </strong>{' '}
              resulting directly or indirectly from the use of our software, indicators, website, or
              educational content.
            </li>
            <li>
              <span className="lead">Extreme Risk Warning:</span> Trading futures, foreign exchange
              (Forex), equities, options, and other financial instruments is highly speculative and
              carries a <strong>substantial risk of loss</strong>. You can lose all of your initial
              investment &mdash; and in leveraged markets, losses can exceed your initial deposit
              and account balance.
            </li>
            <li>
              <span className="lead">Risk Capital:</span> You should only trade with risk capital
              &mdash; money you can afford to lose completely without jeopardizing your financial
              security or lifestyle.
            </li>
            <li>
              <span className="lead">No Losses Prevented:</span> GTD software, algorithms, or
              indicators <strong>do not guarantee profit or prevent losses</strong>.
            </li>
          </ul>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">3.</span>Disclosures
          </h2>

          <h3>A. Hypothetical &amp; Backtested Performance</h3>
          <p>
            Hypothetical performance results have inherent limitations. No representation is being
            made that any account will or is likely to achieve profits or losses similar to those
            shown.
          </p>
          <ul className="legal-list">
            <li>
              Backtested performance is generally prepared with the benefit of hindsight.
            </li>
            <li>
              Simulated trading does not involve financial risk and cannot fully account for the
              impact of actual market liquidity, slippage, or psychological factors.
            </li>
          </ul>

          <h3>B. Live Trade Room Disclosure</h3>
          <p>
            Presentations and opinions expressed in any GTD live room or community are those of the
            presenter only. All trades presented must be considered hypothetical and should not be
            expected to be replicated in a live trading account.
          </p>

          <h3>C. Testimonial Disclosure</h3>
          <p>
            Testimonials appearing on this website or associated media may not be representative of
            other clients or customers and do not constitute a guarantee of future performance or
            success.
          </p>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">4.</span>Strict No-Refund Policy
          </h2>
          <div className="legal-callout">
            <div className="co-head">
              🚫 All Sales Are Strictly Non-Refundable &mdash; No Exceptions Whatsoever.
            </div>
            <p>
              Due to the digital and intellectual property nature of our software, indicators,
              educational tools, and immediate access products, once a purchase is completed,
              delivered, or a download/access link is provided,{' '}
              <strong>
                no refunds, exchanges, chargebacks, or credits will be issued under any
                circumstances. ALL PURCHASES ARE FINAL.
              </strong>
            </p>
          </div>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">5.</span>Intellectual Property &amp; License Grant
          </h2>
          <ul className="legal-list">
            <li>
              <span className="lead">Ownership:</span> All software, code, indicators, website copy,
              graphics, and materials are the exclusive intellectual property of Godra Trading Desk.
            </li>
            <li>
              <span className="lead">Limited License:</span> Upon purchase, GTD grants you a
              personal, non-exclusive, non-transferable, revocable license to use the tools for
              individual use.
            </li>
            <li>
              <span className="lead">Restrictions:</span> You may <strong>NOT</strong> copy, modify,
              redistribute, resell, reverse engineer, share access to, or commercially exploit any
              GTD software or content without express written consent.
            </li>
          </ul>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">6.</span>Complete Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, Godra Trading Desk, its owners,
            partners, and representatives shall not be liable for any direct, indirect, incidental,
            special, consequential, or punitive damages &mdash; including but not limited to loss of
            capital, data, or profits &mdash; arising out of or connected to your use of or
            inability to use our Services.{' '}
            <strong>You irrevocably waive any and all legal claims against GTD.</strong>
          </p>
        </div>

        <div className="legal-foot">
          <div className="legal-foot-note">
            © 2026 Godra Trading Desk — All Rights Reserved
            <br />
            Continued use of this site constitutes acceptance of these Terms.
          </div>
          <div className="legal-inline-links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/privacy')
              }}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
              }}
            >
              Back to Site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
