import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import hallOwnerApi from '../../api/hallOwnerApi';

const HallOwnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await hallOwnerApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: '🏛️', label: 'Total Halls', value: stats?.totalHalls || 0, color: 'from-blue-400 to-blue-600' },
    { icon: '🍽️', label: 'Total Menus', value: stats?.totalMenus || 0, color: 'from-orange-400 to-orange-600' },
    { icon: '📅', label: 'Upcoming Bookings', value: stats?.upcomingBookings || 0, color: 'from-green-400 to-green-600' },
    { icon: '⏳', label: 'Pending Bookings', value: stats?.pendingBookings || 0, color: 'from-amber-400 to-amber-600' }
  ];

  const actionButtons = [
    { label: '🏛️ Manage Halls', path: '/hall-owner/halls', color: 'from-[#bfa544] to-[#8b7a2a]' },
    { label: '🍽️ Manage Menus', path: '/hall-owner/menus', color: 'from-orange-500 to-orange-700' },
    { label: '⏰ Time Slots', path: '/hall-owner/time-slots', color: 'from-[#7a2222] to-[#5a1a1a]' },
    { label: '📅 View Bookings', path: '/hall-owner/bookings', color: 'from-purple-500 to-purple-700' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-8 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-red-600 text-xl">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#7a2222] mb-3">
            Hall Owner Dashboard
          </h1>
          <p className="text-xl text-gray-700">Manage your halls, bookings, and offerings</p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="relative w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#bfa544] border-r-[#bfa544]"></div>
            </motion.div>
          </motion.div>
        ) : (
          <>
            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {statCards.map((stat, i) => (
                <motion.div
                  key={i}
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl p-8 border border-[#bfa544]/20 hover:shadow-2xl transition transform hover:scale-105`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-gray-800 text-sm font-medium mb-2">{stat.label}</div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {actionButtons.map((btn, i) => (
                <motion.button
                  key={i}
                  onClick={() => navigate(btn.path)}
                  className={`px-8 py-6 bg-gradient-to-br ${btn.color} text-white rounded-2xl hover:shadow-2xl transition font-bold text-lg border border-[#bfa544]/20 transform`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + 0.1 * i }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {btn.label}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default HallOwnerDashboard;

