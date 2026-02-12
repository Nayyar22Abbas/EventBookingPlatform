import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { authAPI } from '../api/authApi';
import useAuthStore from '../hooks/useAuth';

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  
  const role = searchParams.get('role') || 'customer';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: role
      });

      const { user, accessToken } = response;
      login(user, accessToken);

      // Redirect based on role
      const dashboard = role === 'admin' ? '/admin/dashboard' : 
                       role === 'hall_owner' ? '/hall-owner/dashboard' : 
                       '/customer/dashboard';
      navigate(dashboard, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <p className="mt-2 text-gray-400">Join as a {role.replace('_', ' ')}</p>
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
          className="space-y-6 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
              👤 Full Name
            </label>
            <motion.input
              id="name"
              name="name"
              type="text"
              className="w-full px-4 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
              placeholder="John Doe"
              {...register('name')}
              whileFocus={{ scale: 1.02 }}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              📧 Email Address
            </label>
            <motion.input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
              placeholder="your@email.com"
              {...register('email')}
              whileFocus={{ scale: 1.02 }}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              🔐 Password
            </label>
            <div className="relative">
              <motion.input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition pr-12"
                placeholder="Enter your password"
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
            {errors.password && (
              <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
            )}
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
              ✅ Confirm Password
            </label>
            <div className="relative">
              <motion.input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition pr-12"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#bfa544]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                whileHover={{ scale: 1.1 }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </motion.button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
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
        </motion.form>

        {/* Sign In Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
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