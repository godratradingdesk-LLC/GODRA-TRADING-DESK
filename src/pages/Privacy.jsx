import { useNavigate } from 'react-router-dom'
import LegalNav from '../components/LegalNav'

export default function Privacy() {
  const navigate = useNavigate()

  return (
    <div id="pg-privacy" className="page active">
      <LegalNav current="privacy" />

      <div className="legal-body">
        <div className="legal-head">
          <div className="legal-eyebrow">Godra Trading Desk (GTD)</div>
          <h1>Privacy Policy</h1>
          <div className="legal-updated">Last Updated: July 2026</div>
        </div>

        <p className="legal-intro">
          Godra Trading Desk (&ldquo;GTD&rdquo;) respects your privacy. This Privacy Policy explains
          how we collect, use, and protect your information when you visit our website or purchase
          our products.
        </p>

        <div className="legal-sec">
          <h2>
            <span className="num">1.</span>Information We Collect
          </h2>
          <ul className="legal-list">
            <li>
              <span className="lead">Personal Identification Information:</span> Name, email
              address, billing address, and payment information provided when purchasing a product
              or subscribing to our newsletter.
            </li>
            <li>
              <span className="lead">Technical Data:</span> IP address, browser type, operating
              system, and website usage metrics collected automatically via cookies and analytical
              tools.
            </li>
          </ul>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">2.</span>How We Use Your Information
          </h2>
          <p>We use your information solely to:</p>
          <ul className="legal-list">
            <li>Process orders, license delivery, and account setups.</li>
            <li>Provide customer support and software updates.</li>
            <li>
              Send transactional emails, educational content, and promotional announcements (you may
              opt out at any time).
            </li>
            <li>Prevent fraudulent transactions and ensure system security.</li>
          </ul>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">3.</span>Payment Processing &amp; Security
          </h2>
          <p>
            <strong>
              GTD does not store or process your complete credit card details on our servers.
            </strong>{' '}
            All financial transactions are handled by secure, third-party payment processors (e.g.,
            Stripe, PayPal).
          </p>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">4.</span>Data Sharing &amp; Third Parties
          </h2>
          <p>
            <strong>
              We do not sell, trade, or rent your personal information to third parties.
            </strong>{' '}
            We may share basic data with trusted service providers who assist us in operating our
            website, provided they agree to keep this information confidential.
          </p>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">5.</span>Cookies
          </h2>
          <p>
            Our website uses cookies to enhance user experience, track site analytics, and remember
            user preferences. You can choose to disable cookies through your browser settings,
            though some features of the site may function with limited capabilities.
          </p>
        </div>

        <div className="legal-sec">
          <h2>
            <span className="num">6.</span>Updates to This Policy
          </h2>
          <p>
            GTD reserves the right to update or modify these Terms and Privacy Policy at any time
            without prior notice. Changes take effect immediately upon posting to the website.
            Continued use of the site constitutes acceptance of the updated terms.
          </p>
        </div>

        <div className="legal-sec">
          <h2>Contact Us</h2>
          <p className="legal-contact">
            If you have questions regarding these Terms or the Privacy Policy, please contact Godra
            Trading Desk through the official support channels on our website:{' '}
            <a href="mailto:contact@godratradingdesk.com">contact@godratradingdesk.com</a>
          </p>
        </div>

        <div className="legal-foot">
          <div className="legal-foot-note">
            © 2026 Godra Trading Desk — All Rights Reserved
            <br />
            Continued use of this site constitutes acceptance of this Policy.
          </div>
          <div className="legal-inline-links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/terms')
              }}
            >
              Terms of Service
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
