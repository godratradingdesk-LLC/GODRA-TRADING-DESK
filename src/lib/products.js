// ─ Product catalogue (drives cart icons + premium library) ─
export const PRODUCTS = {
  'GTD HEDGE ALGO': {
    icon: '🤖',
    file: 'GTD_HedgeAlgo_NT8.zip',
    stripeUrl: 'https://buy.stripe.com/14A14od7H7lq5X21lK4Vy04',
    desc: 'The complete GTD autotrading engine — HedgeAlgo crossover modules, customizable trailing stops, standard indicator signals, and the exclusive Order Manager bonus.',
  },
  'GTD ICT Concepts': {
    icon: '🧠',
    soon: true,
    desc: 'The complete ICT concepts indicator pack — order blocks, fair value gaps, liquidity sweeps, market structure shifts, and killzone sessions. Launching soon.',
  },
  'GTD Capital Engine': {
    icon: '⚡',
    soon: true,
    desc: 'High-Frequency Trading bot built on live orderflow. Detects spoofed trades and executes only on confirmed pure trend. Launching soon.',
  },
}

/** Match a product name returned by the server to a key in PRODUCTS. */
export function matchLocalProductKey(remoteName) {
  const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ')
  const target = norm(remoteName)
  return Object.keys(PRODUCTS).find((k) => norm(k) === target) || null
}

// Promo codes — { CODE: { discount, description, appliesTo } }
//
// Private codes are deliberately NOT listed here — anyone can read this
// bundle's source. Codes typed at the cart that are not listed above are
// passed to Stripe unchanged, and Stripe decides whether they are real.
export const PROMO_CODES = {
  GTDFIRST99: {
    discount: 99.99,
    description: '$99.99 off the GTD Hedge Algo price — first purchase only',
    appliesTo: 'GTD HEDGE ALGO',
  },
}
