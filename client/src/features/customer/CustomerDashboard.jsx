import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import customerApi from '../../api/customerApi';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await customerApi.getDashboardStats();
        setStats(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load dashboard stats');
        setStats({
          totalBookings: 0,
          upcomingBookings: 0,
          completedBookings: 0,
          totalSpent: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleQuickSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/customer/halls?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuickSearch();
    }
  };

  const statCards = [
    { icon: '📅', label: 'Total Bookings', value: stats?.totalBookings || 0, color: 'from-blue-400 to-blue-600' },
    { icon: '⏰', label: 'Upcoming Events', value: stats?.upcomingBookings || 0, color: 'from-purple-400 to-purple-600' },
    { icon: '✅', label: 'Completed Events', value: stats?.completedBookings || 0, color: 'from-green-400 to-green-600' },
    { icon: '💰', label: 'Total Spent', value: `₹${stats?.totalSpent || 0}`, color: 'from-amber-400 to-amber-600' }
  ];

  const actionButtons = [
    { label: '🔍 Search Halls', path: '/customer/halls', color: 'from-[#bfa544] to-[#8b7a2a]' },
    { label: '📅 My Bookings', path: '/customer/bookings', color: 'from-[#7a2222] to-[#5a1a1a]' },
    { label: '⭐ Reviews', path: '/customer/reviews', color: 'from-orange-500 to-red-600' }
  ];

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
            Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-700">Manage your event bookings and find the perfect venue</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-8 p-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-2xl backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

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
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Search */}
            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-xl p-8 mb-12 border border-[#bfa544]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">🔍 Quick Search Halls</h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  className="flex-1 px-6 py-4 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] transition"
                  placeholder="Search by hall name, city, or amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <motion.button
                  onClick={handleQuickSearch}
                  className="px-8 py-4 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl hover:shadow-lg transition font-bold text-lg whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Search
                </motion.button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                  transition={{ delay: 0.5 + 0.1 * i }}
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

export default CustomerDashboard;



