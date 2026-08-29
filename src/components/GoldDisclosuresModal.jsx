import { useEffect, useRef } from 'react'
import logo from '../assets/gtd-logo.png'
import { useAuth } from '../context/AuthContext'

/** Gold Member Disclosures — shown on every successful sign-in. */
export default function GoldDisclosuresModal() {
  const { showGoldDisclosures, ackGoldDisclosures } = useAuth()
  const bodyRef = useRef(null)

  // Always open at the top, however far the last reader scrolled.
  useEffect(() => {
    if (showGoldDisclosures && bodyRef.current) bodyRef.current.scrollTop = 0
  }, [showGoldDisclosures])

  return (
    <div id="gold-disc-modal" className={showGoldDisclosures ? 'show' : ''}>
      <div className="gdm-card">
        <div className="gdm-head">
          <div className="gdm-badge">👑 Gold Member · Required Disclosures</div>
          <h1>Disclaimers</h1>
          <p>Please review the following disclosures before entering the Gold Members Portal.</p>
        </div>
        <div className="gdm-body" ref={bodyRef}>
          <div className="gdm-sec">
            <h3>Risk Disclosure:</h3>
            <p>
              Futures and forex trading contains substantial risk and is not for every investor. An
              investor could potentially lose all or more than the initial investment. Risk capital
              is money that can be lost without jeopardizing ones&rsquo; financial security or
              lifestyle. Only risk capital should be used for trading and only those with sufficient
              risk capital should consider trading. Past performance is not necessarily indicative
              of future results.
            </p>
          </div>
          <div className="gdm-sec">
            <h3>Hypothetical Performance Disclosure:</h3>
            <p>
              Hypothetical performance results have many inherent limitations, some of which are
              described below. No representation is being made that any account will or is likely to
              achieve profits or losses similar to those shown; in fact, there are frequently sharp
              differences between hypothetical performance results and the actual results
              subsequently achieved by any particular trading program. One of the limitations of
              hypothetical performance results is that they are generally prepared with the benefit
              of hindsight. In addition, hypothetical trading does not involve financial risk, and
              no hypothetical trading record can completely account for the impact of financial risk
              of actual trading. For example, the ability to withstand losses or to adhere to a
              particular trading program in spite of trading losses are material points which can
              also adversely affect actual trading results. There are numerous other factors related
              to the markets in general or to the implementation of any specific trading program
              which cannot be fully accounted for in the preparation of hypothetical performance
              results and all which can adversely affect trading results.
            </p>
          </div>
          <div className="gdm-sec">
            <h3>Live Trade Room Disclosure:</h3>
            <p>
              This presentation is for educational purposes only and the opinions expressed are
              those of the presenter only. All trades presented should be considered hypothetical
              and should not be expected to be replicated in a live trading account.
            </p>
          </div>
          <div className="gdm-sec">
            <h3>Testimonial Disclosure:</h3>
            <p>
              Testimonials appearing on this website may not be representative of other clients or
              customers and is not a guarantee of future performance or success.
            </p>
          </div>
        </div>
        <div className="gdm-foot">
          <div className="gdm-brand">
            <img src={logo} alt="GTD" />
            <span>GODRA TRADING DESK</span>
          </div>
          <button className="btn-gdm-ack" onClick={ackGoldDisclosures}>
            ✓ &nbsp;I Acknowledge — Continue
          </button>
        </div>
      </div>
    </div>
  )
}
