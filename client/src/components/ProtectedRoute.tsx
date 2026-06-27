import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'doctor')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/'} replace />;
  }

  return <>{children}</>;
}
