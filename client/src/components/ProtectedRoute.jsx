import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, getRole } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const userRole = getRole();
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes = {
      admin: '/admin/dashboard',
      hall_owner: '/hall-owner/dashboard',
      customer: '/customer/dashboard'
    };

    const redirectTo = roleRoutes[userRole] || '/auth/login';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;