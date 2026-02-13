import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { authAPI } from '../../api/authApi';
import useAuthStore from '../../hooks/useAuth';

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(data);
      const { user } = response;

      // Check if user tried to book a hall before login
      if (location.state?.hallId) {
        navigate(`/customer/booking/${location.state.hallId}`, {
          state: { date: location.state.date },
          replace: true
        });
      } else {
        // Redirect based on role
        const from = location.state?.from?.pathname || getRoleDashboard(user.role);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setShowRoleDialog(true);
  };

  const proceedWithGoogleLogin = (role) => {
    setShowRoleDialog(false);
    authAPI.googleLogin(role);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-[#bfa544]/10 to-[#7a2222]/5 rounded-full filter blur-3xl"
        animate={{ 
          x: [0, 50, -30, 20, 0],
          y: [0, -50, 30, -20, 0],
          scale: [1, 1.1, 0.95, 1.05, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-tl from-[#ffd700]/10 to-[#bfa544]/5 rounded-full filter blur-3xl"
        animate={{ 
          x: [0, -50, 30, -20, 0],
          y: [0, 50, -30, 20, 0],
          scale: [1, 0.95, 1.1, 1.05, 1]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="mb-4 px-4 py-2 text-[#7a2222] hover:text-[#5a1a1a] font-bold flex items-center gap-2 rounded-lg hover:bg-white/40 transition text-sm"
          whileHover={{ x: -5 }}
        >
          ← Back to Home
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-extrabold text-[#7a2222] mb-2">EventHub</h1>
          <h2 className="text-2xl font-bold text-[#7a2222]">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-700 text-sm">Sign in to your account to continue</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          className="space-y-5 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#bfa544]/20 shadow-lg"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="email" className="block text-xs font-bold text-[#7a2222] mb-2 uppercase tracking-wide">
              📧 Email Address
            </label>
            <motion.input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-2.5 bg-white border border-[#bfa544]/30 rounded-lg text-[#7a2222] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition text-sm"
              placeholder="your@email.com"
              {...register('email')}
              whileFocus={{ scale: 1.02 }}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="password" className="block text-xs font-bold text-[#7a2222] mb-2 uppercase tracking-wide">
              🔐 Password
            </label>
            <div className="relative">
              <motion.input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full px-4 py-2.5 bg-white border border-[#bfa544]/30 rounded-lg text-[#7a2222] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition pr-10 text-sm"
                placeholder="Enter your password"
                {...register('password')}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-[#bfa544]"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </motion.button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white/80 text-gray-700">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center px-4 py-2.5 border border-[#bfa544]/40 rounded-lg text-[#7a2222] bg-white/50 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#bfa544] transition font-bold text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#bfa544" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#ffd700" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#7a2222" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#bfa544" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </motion.button>
        </motion.form>

        {/* Sign Up Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-gray-700 text-sm">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-bold text-[#bfa544] hover:text-[#8b7a2a] transition">
              Sign up here
            </Link>
          </span>
        </motion.div>

        {/* Role Selection Dialog */}
        {showRoleDialog && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border border-[#bfa544]/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3 className="text-2xl font-bold text-[#7a2222] mb-2">Select Your Role</h3>
              <p className="text-gray-700 mb-6 text-sm">
                How would you like to use our platform?
              </p>
              
              <div className="space-y-3">
                <motion.button
                  onClick={() => proceedWithGoogleLogin('customer')}
                  className="w-full p-4 border-2 border-[#bfa544]/30 rounded-lg hover:border-[#bfa544] hover:bg-[#bfa544]/5 transition text-left bg-white text-sm"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="text-2xl mb-2">🛍️</div>
                  <div className="font-bold text-[#7a2222]">Booking Customer</div>
                  <div className="text-xs text-gray-600">Search and book event halls</div>
                </motion.button>
                
                <motion.button
                  onClick={() => proceedWithGoogleLogin('hall_owner')}
                  className="w-full p-4 border-2 border-[#7a2222]/30 rounded-lg hover:border-[#7a2222] hover:bg-[#7a2222]/5 transition text-left bg-white text-sm"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="text-2xl mb-2">🏛️</div>
                  <div className="font-bold text-[#7a2222]">Hall Owner</div>
                  <div className="text-xs text-gray-600">List and manage your event halls</div>
                </motion.button>
              </div>
              
              <motion.button
                onClick={() => setShowRoleDialog(false)}
                className="w-full mt-4 px-4 py-2.5 text-[#7a2222] border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-bold"
                whileHover={{ scale: 1.02 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
