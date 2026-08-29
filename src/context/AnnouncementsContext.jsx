import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { sb } from '../lib/supabase'

// ═══════════════════════════════════════════════════════════
//  NOTIFICATION BELL — public, no auth required
// ═══════════════════════════════════════════════════════════

const AnnouncementsContext = createContext(null)

export function useAnnouncements() {
  const ctx = useContext(AnnouncementsContext)
  if (!ctx) throw new Error('useAnnouncements must be used inside <AnnouncementsProvider>')
  return ctx
}

export function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAnnouncements = useCallback(async () => {
    if (!sb) {
      setLoading(false)
      return
    }
    try {
      const { data, error } = await sb.rpc('get_active_announcements')
      if (error || !data) return
      setAnnouncements(data)
    } catch (e) {
      console.warn('[announcements] load failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAnnouncements()
  }, [loadAnnouncements])

  return (
    <AnnouncementsContext.Provider value={{ announcements, loading, loadAnnouncements }}>
      {children}
    </AnnouncementsContext.Provider>
  )
}
