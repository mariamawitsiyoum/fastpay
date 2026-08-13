import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Profile from './pages/Profile'
import KycUpload from './pages/KycUpload'
import AgentLocator from './pages/AgentLocator'
import ExchangeRate from './pages/ExchangeRate'
import TransactionHistory from './pages/TransactionHistory'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/kyc" element={<KycUpload />} />
      <Route path="/agents" element={<AgentLocator />} />
      <Route path="/rates" element={<ExchangeRate />} />
      <Route path="/transactions" element={<TransactionHistory />} />
      {/* <Route path="/login" element={<Login />} /> */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App 