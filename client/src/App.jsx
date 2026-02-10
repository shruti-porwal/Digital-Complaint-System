import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { HomePage } from './pages/user/HomePage'
import { SubmitComplaintPage } from './pages/user/SubmitComplaintPage'
import { ComplaintDetailPage } from './pages/user/ComplaintDetailPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ReportsPage } from './pages/admin/ReportsPage'
import { HelpFAQPage } from './pages/HelpFAQPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ChatbotProvider } from './context/ChatbotContext'

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user?.role === 'admin' ? '/admin' : '/home'} replace />
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="page-center">
        <div className="loader-spinner" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace /> : <SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeRedirect />} />
        <Route path="home" element={<ProtectedRoute roles={['user']}><HomePage /></ProtectedRoute>} />
        <Route path="home/submit" element={<ProtectedRoute roles={['user']}><SubmitComplaintPage /></ProtectedRoute>} />
        <Route path="home/complaints/:id" element={<ProtectedRoute roles={['user']}><ComplaintDetailPage /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/reports" element={<ProtectedRoute roles={['admin']}><ReportsPage /></ProtectedRoute>} />
        <Route path="help" element={<HelpFAQPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatbotProvider>
          <AppRoutes />
        </ChatbotProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
