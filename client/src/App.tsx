import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorDashboard from './pages/DoctorDashboard';
import ChatWidget from './components/ChatWidget';

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }
  if (user) {
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={location.pathname.startsWith('/doctor') ? "/doctor/dashboard" : "/"} replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <AnimatedRoutes />
          
          {/* ChatWidget is available globally but hidden on /chat via its own internal logic */}
          <ChatWidget />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
