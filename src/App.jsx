import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import ListPage from './pages/ListPage'
import GifterPage from './pages/GifterPage'
import ResetPassword from './pages/ResetPassword'
import Feedback from './pages/Feedback'
import Collections from './pages/Collections'
import CollectionPage from './pages/CollectionPage'
import CollectionPublic from './pages/CollectionPublic'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/list/:id" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/collections/:id" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
          <Route path="/r/:slug" element={<GifterPage />} />
          <Route path="/c/:slug" element={<CollectionPublic />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
