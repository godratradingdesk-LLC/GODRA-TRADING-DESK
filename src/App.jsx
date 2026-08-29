import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DeclinedScreen from './components/DeclinedScreen'
import DisclaimerGate from './components/DisclaimerGate'
import GoldDisclosuresModal from './components/GoldDisclosuresModal'
import PremiumModal from './components/PremiumModal'
import RequireAuth from './components/RequireAuth'
import ScrollToTop from './components/ScrollToTop'
import { AdminProvider } from './context/AdminContext'
import { AnnouncementsProvider } from './context/AnnouncementsContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import BookCall from './pages/BookCall'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Library from './pages/Library'
import Login from './pages/Login'
import PinStep from './pages/PinStep'
import Portal from './pages/Portal'
import Privacy from './pages/Privacy'
import Profile from './pages/Profile'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Terms from './pages/Terms'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminPin from './pages/admin/AdminPin'
import AdminSetPin from './pages/admin/AdminSetPin'

export default function App() {
  // The disclaimer gate opens over the site on first load, and the footer's
  // "Risk Disclaimer" link reopens it later.
  const [disclaimerOpen, setDisclaimerOpen] = useState(true)
  const [declined, setDeclined] = useState(false)

  if (declined) return <DeclinedScreen />

  return (
    <AuthProvider>
      <AnnouncementsProvider>
        <CartProvider>
          <AdminProvider>
            <ScrollToTop />

            <Routes>
              <Route path="/" element={<Home onOpenDisclaimer={() => setDisclaimerOpen(true)} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pin" element={<PinStep />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/book-call" element={<BookCall />} />

              <Route
                path="/portal"
                element={
                  <RequireAuth>
                    <Portal />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/library"
                element={
                  <RequireAuth>
                    <Library />
                  </RequireAuth>
                }
              />
              <Route
                path="/cart"
                element={
                  <RequireAuth>
                    <Cart />
                  </RequireAuth>
                }
              />

              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/pin" element={<AdminPin />} />
              <Route path="/admin/set-pin" element={<AdminSetPin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Overlays live outside the routes so they float above any page. */}
            <GoldDisclosuresModal />
            <PremiumModal />
            <DisclaimerGate
              open={disclaimerOpen}
              onAccept={() => setDisclaimerOpen(false)}
              onDecline={() => setDeclined(true)}
            />
          </AdminProvider>
        </CartProvider>
      </AnnouncementsProvider>
    </AuthProvider>
  )
}
