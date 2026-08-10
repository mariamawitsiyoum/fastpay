import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import CustomerLookup from './pages/CustomerLookup'
import NewTransaction from './pages/NewTransaction'
import DailyReport from './pages/DailyReport'
import Commissions from './pages/Commissions'
import Transactions from './pages/Transactions'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Receipt from './pages/Receipt'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from './components/Layout'
import PageTransition from './components/PageTransition'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><Dashboard /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-lookup"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><CustomerLookup /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/new"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><NewTransaction /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-report"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><DailyReport /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/commissions"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><Commissions /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><Transactions /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><Profile /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><Notifications /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts/:id"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><Receipt /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default App