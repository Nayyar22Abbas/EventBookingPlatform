import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../hooks/useAuth';
import { authAPI } from '../../api/authApi';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectingRole, setSelectingRole] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL params
        const errorParam = searchParams.get('error');
        if (errorParam) {
          setError('Google authentication failed. Please try again.');
          setLoading(false);
          return;
        }

        // Check for token in URL params (if backend redirects with token)
        const tokenParam = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (tokenParam && userParam) {
          // Parse user data and store in state
          const userData = JSON.parse(decodeURIComponent(userParam));
          setUser(userData);
          setToken(tokenParam);

          // If role is default 'customer', show role selection
          // Otherwise, proceed with login
          if (userData.roleSelectionPending) {
            setShowRoleSelection(true);
          } else {
            performLogin(userData, tokenParam);
          }
        } else {
          // If no token in params, the backend might have set an httpOnly cookie
          // Try to get user info from a protected endpoint or redirect to login
          setError('Authentication failed. Please try logging in again.');
        }
      } catch (err) {
        console.error('Google callback error:', err);
        setError('An error occurred during authentication. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  const performLogin = (userData, authToken) => {
    login(userData, authToken);
    const dashboardPath = getRoleDashboard(userData.role);
    navigate(dashboardPath, { replace: true });
  };

  const handleRoleSelection = async (selectedRole) => {
    if (!user || !token) return;

    try {
      setSelectingRole(true);
      
      // Call API to update user role
      const response = await authAPI.updateRole(selectedRole);
      
      // Update user object with new role
      const updatedUser = { ...user, role: selectedRole };
      performLogin(updatedUser, token);
    } catch (err) {
      setError(err.message || 'Failed to select role. Please try again.');
      setSelectingRole(false);
    }
  };

  const getRoleDashboard = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'hall_owner':
        return '/hall-owner/dashboard';
      case 'customer':
      default:
        return '/customer/dashboard';
    }
  };

  const handleRetry = () => {
    navigate('/auth/login');
  };

  if (showRoleSelection && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, {user?.name}!
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                How would you like to use our platform?
              </p>
              
              <div className="space-y-4">
                {/* Customer Option */}
                <button
                  onClick={() => handleRoleSelection('customer')}
                  disabled={selectingRole}
                  className="w-full p-6 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Booking Customer</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Search and book event halls
                      </p>
                    </div>
                  </div>
                </button>

                {/* Hall Owner Option */}
                <button
                  onClick={() => handleRoleSelection('hall_owner')}
                  disabled={selectingRole}
                  className="w-full p-6 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Hall Owner</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        List and manage your event halls
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white py-8 px-6 shadow-md rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Completing Google Sign In...
              </h2>
              <p className="text-sm text-gray-600">
                Please wait while we authenticate you.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white py-8 px-6 shadow-md rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Authentication Failed
              </h2>

              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/auth/login')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; // This shouldn't be reached
};

export default GoogleCallback;
