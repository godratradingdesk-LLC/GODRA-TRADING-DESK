import { useAuth } from '../context/AuthContext'

/** The Gold Member welcome shown after the disclosures are acknowledged. */
export default function PremiumModal() {
  const { showPremiumModal, enterPortal } = useAuth()

  return (
    <div id="premium-modal" className={showPremiumModal ? 'show' : ''}>
      <div className="pm-card">
        <span className="pm-crown">👑</span>
        <div className="pm-badge">Gold Member</div>
        <h2 className="pm-title">Welcome Back</h2>
        <p className="pm-sub">
          You&#39;re in. As a GTD Gold Member you have exclusive access to strategies, autotrading
          bots, and GTD tools — unavailable anywhere else.
        </p>
        <div className="pm-perks">
          <div className="pm-perk">Full access to all GTD Autotrading Bots</div>
          <div className="pm-perk">GTD HedgeAlgo — Flagship Bot</div>
          <div className="pm-perk">GTD Capital Engine — HFT Orderflow Bot</div>
          <div className="pm-perk">Add to cart &amp; purchase securely via Stripe</div>
        </div>
        <div className="pm-no-refund">
          ⚠ ALL PURCHASES ARE STRICTLY NON-REFUNDABLE — NO EXCEPTIONS
        </div>
        <button className="btn-pm-enter" onClick={enterPortal}>
          Enter Members Area →
        </button>
      </div>
    </div>
  )
}
