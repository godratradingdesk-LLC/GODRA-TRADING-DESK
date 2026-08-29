import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNav from '../components/PortalNav'
import RiskNote from '../components/RiskNote'
import TrainingBanner from '../components/TrainingBanner'
import { useAuth } from '../context/AuthContext'
import { PRODUCTS } from '../lib/products'

export default function Library() {
  const navigate = useNavigate()
  const { user, purchases, refreshEntitlements, requestDownloadLink } = useAuth()
  const [alert, setAlert] = useState('')

  useEffect(() => {
    refreshEntitlements()
  }, [refreshEntitlements])

  const download = async (name) => {
    if (!purchases.includes(name)) {
      window.alert('You must purchase this tool first to unlock the download.')
      return
    }
    await requestDownloadLink()
    setAlert(`📧 Check your inbox — a secure download link is on its way to ${user.email}.`)
  }

  return (
    <div id="pg-library" className="page active">
      <PortalNav />
      <div className="library-body">
        <button className="btn-back-portal" onClick={() => navigate('/portal')}>
          ← Back to Members Area
        </button>

        <div className="portal-header">
          <h1>Premium Downloads Library</h1>
          <p>
            Your licensed GTD assemblies. Download the setup packages and import them into
            NinjaTrader 8.
          </p>
          <div className="portal-gold-line"></div>
        </div>

        <TrainingBanner />

        <div className="lib-alert" id="lib-alert" style={{ display: alert ? 'block' : 'none' }}>
          {alert}
        </div>

        <RiskNote style={{ marginBottom: '28px' }} />

        <div className="lib-grid" id="lib-grid">
          {Object.keys(PRODUCTS).map((name) => {
            const p = PRODUCTS[name]

            if (p.soon) {
              return (
                <div className="lib-card" key={name}>
                  <div className="lib-card-top">
                    <span className="lib-icon">{p.icon}</span>
                    <span className="lib-status soon">⏳ Coming Soon</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{p.desc}</p>
                  <div className="lib-card-foot">
                    <div className="lib-file">
                      Not yet released — Gold Members get first access
                    </div>
                    <div className="btn-lib-soon">⏳ &nbsp;Coming Soon</div>
                    <p className="lib-note">
                      You'll be notified at {user?.email} on launch
                    </p>
                  </div>
                </div>
              )
            }

            const isOwned = purchases.includes(name)
            return (
              <div className={'lib-card' + (isOwned ? ' owned' : '')} key={name}>
                <div className="lib-card-top">
                  <span className="lib-icon">{p.icon}</span>
                  <span className={'lib-status ' + (isOwned ? 'own' : 'lock')}>
                    {isOwned ? '✓ Owned' : '🔒 Locked'}
                  </span>
                </div>
                <h3>{name}</h3>
                <p>{p.desc}</p>
                <div className="lib-card-foot">
                  <div className="lib-file">
                    {isOwned
                      ? '✓ Licensed to your account'
                      : '🔒 Unlocks once your payment is confirmed'}
                  </div>
                  {isOwned ? (
                    <button className="btn-lib-dl" onClick={() => download(name)}>
                      📧 &nbsp;Email Me the Download Link
                    </button>
                  ) : (
                    <button className="btn-lib-lock" onClick={() => navigate('/portal')}>
                      🛒 &nbsp;Purchase to Unlock
                    </button>
                  )}
                  <p className="lib-note">
                    {isOwned
                      ? `A secure, expiring link will be sent to ${user?.email}`
                      : `After checkout your licence is activated and your download link is emailed to ${user?.email}`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="red-note" style={{ marginTop: '32px' }}>
          <span className="red-note-title">⚠ Licensing &amp; Risk Notice</span>
          Downloads are licensed for personal use on your own workstation only.{' '}
          <strong>
            Sharing or redistributing these files will terminate your membership without refund.
          </strong>{' '}
          All GTD products are informational software tools — they do not constitute financial
          advice, and all trading decisions and outcomes are yours alone.
        </div>
      </div>
    </div>
  )
}
