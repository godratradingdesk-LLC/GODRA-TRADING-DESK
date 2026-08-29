/** Shown in place of the whole site when a visitor declines the disclaimer. */
export default function DeclinedScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: '#8A94A3',
        background: '#12161D',
        gap: '14px',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <div style={{ fontSize: '2rem', color: '#C9A84C', letterSpacing: '3px' }}>
        GODRA TRADING DESK
      </div>
      <p style={{ fontSize: '.9rem' }}>You have declined access to this site.</p>
      <p style={{ fontSize: '.8rem' }}>You may safely close this window.</p>
    </div>
  )
}
