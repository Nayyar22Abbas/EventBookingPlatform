import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user role
    const roleRoutes = {
      admin: '/admin/dashboard',
      hall_owner: '/hall-owner/dashboard',
      customer: '/customer/dashboard'
    };

    const redirectPath = roleRoutes[user?.role] || '/auth/login';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;