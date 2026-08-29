import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Every page change starts at the top, the way showPage() used to. In-page
 * anchors (#services and friends) are left alone so the nav links still jump.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } catch (e) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
