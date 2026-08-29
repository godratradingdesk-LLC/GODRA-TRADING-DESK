import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DiscordIcon } from './icons'

/**
 * Setup & Training banner. The unlocked state appears once an autotrading
 * strategy is owned — ownership is confirmed by the payment webhook, never by
 * the page itself, so this cannot be unlocked by editing the browser.
 */
export default function TrainingBanner() {
  const { user, ownsStrategy } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  if (ownsStrategy) {
    const mailto =
      'mailto:support@godratradingdesk.com?subject=Premium%20Discord%20Role%20Request&body=Hi%20GTD%2C%20I%20have%20purchased%20an%20autotrading%20strategy%20and%20would%20like%20my%20Premium%20Member%20role%20on%20Discord.%0A%0APurchase%20email%3A%20' +
      encodeURIComponent(user.email)

    return (
      <div className="training-banner">
        <div className="tb-inner">
          <div className="tb-mark">
            <DiscordIcon />
          </div>
          <div className="tb-copy">
            <span className="tb-tag">✓ Eligible · Premium Access</span>
            <h3>Setup &amp; Training Videos</h3>
            <p>
              Thank you for purchasing a GTD autotrading strategy.{' '}
              <strong>Contact GTD to receive your Premium Member role on Discord.</strong> Only
              Premium Members can watch the Setup and Training videos.
            </p>
            <p className="tb-note">
              Message the desk with the email you purchased with — <strong>{user.email}</strong> —
              so we can verify your licence and assign your role.
            </p>
          </div>
          <div className="tb-actions">
            <a
              href="https://discord.gg/AHHMM9tA6x"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tb"
            >
              <DiscordIcon /> Open Discord
            </a>
            <a href={mailto} className="btn-tb ghost">
              ✉ Request Role
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="training-banner tb-locked">
      <div className="tb-inner">
        <div className="tb-mark">
          <DiscordIcon />
        </div>
        <div className="tb-copy">
          <span className="tb-tag">🔒 Premium Members Only</span>
          <h3>Setup &amp; Training Videos</h3>
          <p>
            Setup and Training videos are hosted on Discord for{' '}
            <strong>Premium Members only</strong>. Purchase a GTD autotrading strategy, then contact
            GTD to have your Premium Member role assigned.
          </p>
          <p className="tb-note">
            Already purchased? Contact the desk with your purchase email and we will verify your
            licence and assign your role.
          </p>
        </div>
        <div className="tb-actions">
          <button className="btn-tb ghost" onClick={() => navigate('/portal')}>
            View Strategies
          </button>
        </div>
      </div>
    </div>
  )
}
