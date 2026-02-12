import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { authAPI } from '../../api/authApi';

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: yup
    .string()
    .oneOf(['customer', 'hall_owner'], 'Please select a valid role')
    .required('Role is required')
});

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'customer'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authAPI.register(data);
      setSuccess(true);

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (role = 'customer') => {
    authAPI.googleLogin(role);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1 }}
              >
                ✅
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#bfa544] to-[#ffd700] bg-clip-text text-transparent mb-4">
                Registration Successful!
              </h2>

              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
                <p>Please check your email and verify your account to activate it.</p>
                <p className="text-sm mt-2">You will be redirected to login shortly.</p>
              </div>

              <motion.button
                onClick={() => navigate('/auth/login')}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold hover:shadow-xl transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Login
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-[#bfa544]/20 rounded-full filter blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-[#7a2222]/20 rounded-full filter blur-3xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-extrabold text-white mb-2">EventBook</h1>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">
            Create your account
          </h2>
          <p className="mt-2 text-gray-400">Join our event booking community</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          className="space-y-5 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Name Field */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
              👤 Full Name
            </label>
            <motion.input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="w-full px-4 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
              placeholder="Your full name"
              {...register('name')}
              whileFocus={{ scale: 1.02 }}
            />
            {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>}
          </motion.div>

          {/* Email Field */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              📧 Email Address
            </label>
            <motion.input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
              placeholder="your@email.com"
              {...register('email')}
              whileFocus={{ scale: 1.02 }}
            />
            {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
          </motion.div>

          {/* Password Field */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              🔐 Password
            </label>
            <div className="relative">
              <motion.input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition pr-12"
                placeholder="Min 8 characters"
                {...register('password')}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#bfa544]"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </motion.button>
            </div>
            {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>}
          </motion.div>

          {/* Role Field */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <label htmlFor="role" className="block text-sm font-medium text-gray-200 mb-2">
              🎯 Account Type
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="role"
                  className="w-full px-4 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
                >
                  <option value="customer">👥 Booking Customer</option>
                  <option value="hall_owner">🏛️ Hall Owner</option>
                </select>
              )}
            />
            {errors.role && <p className="mt-2 text-sm text-red-400">{errors.role.message}</p>}
          </motion.div>

          {/* Sign Up Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white font-bold rounded-xl hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-slate-800/50 to-slate-700/50 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <motion.button
            type="button"
            onClick={() => handleGoogleLogin('customer')}
            className="w-full flex justify-center items-center px-4 py-3 border border-[#bfa544]/30 rounded-xl text-gray-200 bg-slate-600/30 hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-[#bfa544] transition font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#bfa544" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#ffd700" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#7a2222" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#bfa544" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>
        </motion.form>

        {/* Sign In Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-gray-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700] hover:brightness-110 transition">
              Sign in
            </Link>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;