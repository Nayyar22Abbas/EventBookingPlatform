import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      className={`bg-gradient-to-br ${color} rounded-2xl shadow-xl p-8 border border-[#bfa544]/20 hover:shadow-2xl transition transform hover:scale-105`}
      whileHover={{ y: -5 }}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-gray-800 text-sm font-medium mb-2">{label}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: '👥', label: 'Total Users', value: stats?.totalUsers || 0, color: 'from-blue-400 to-blue-600' },
    { icon: '🏛️', label: 'Total Halls', value: stats?.totalHalls || 0, color: 'from-amber-400 to-amber-600' },
    { icon: '⏳', label: 'Pending Hall Owners', value: stats?.pendingHallOwners || 0, color: 'from-orange-400 to-orange-600' },
    { icon: '💬', label: 'Enquiries', value: stats?.totalEnquiries || 0, color: 'from-purple-400 to-purple-600' }
  ];

  const actionButtons = [
    { label: '✅ Pending Hall Owners', path: '/admin/pending-hall-owners', color: 'from-[#bfa544] to-[#8b7a2a]' },
    { label: '💬 Enquiries', path: '/admin/enquiries', color: 'from-orange-500 to-orange-700' },
    { label: '🏛️ Hall Moderation', path: '/admin/halls', color: 'from-[#7a2222] to-[#5a1a1a]' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-8 flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-700">Platform overview and management center</p>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
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
}



