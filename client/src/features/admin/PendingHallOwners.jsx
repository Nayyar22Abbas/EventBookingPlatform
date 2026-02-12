import React, { useEffect, useState } from 'react';
import { getPendingHallOwners, approveHallOwner, rejectHallOwner } from '../../api/adminApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function PendingHallOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchOwners = () => {
    setLoading(true);
    getPendingHallOwners()
      .then(res => setOwners(res.data))
      .catch(() => setError('Failed to load hall owners'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      if (action === 'approve') await approveHallOwner(id);
      else await rejectHallOwner(id);
      setToast(`Hall owner ${action}d successfully`);
      fetchOwners();
    } catch {
      setToast('Action failed');
    } finally {
      setActionLoading(null);
      setTimeout(() => setToast(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-[#bfa544]/30 border-t-[#bfa544] rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-red-400 text-xl">❌ {error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">
            Pending <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Hall Owners</span>
          </h1>
          <p className="text-xl text-gray-300">Review and approve new hall owner registrations</p>
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className="mb-6 px-6 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-200 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              ✅ {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Owners Grid or Empty State */}
        {owners.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-300 text-xl">No pending hall owners</p>
            <p className="text-gray-400">All applications have been reviewed</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {owners.map((owner, i) => (
              <motion.div
                key={owner.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#bfa544]/50 transition"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5 }}
              >
                {/* Owner Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#bfa544] to-[#ffd700] rounded-full flex items-center justify-center text-slate-900 font-bold text-lg">
                    {owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{owner.name}</h3>
                    <p className="text-sm text-gray-400">{owner.email}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                  <p className="text-sm text-gray-300">
                    <span className="text-gray-500">Applied:</span> {new Date(owner.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="text-gray-500">Status:</span> <span className="text-yellow-400 font-semibold">⏳ Pending</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => handleAction(owner.id, 'approve')}
                    disabled={actionLoading === owner.id + 'approve'}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 rounded-lg font-semibold hover:from-green-500/40 hover:to-emerald-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {actionLoading === owner.id + 'approve' ? '⏳' : '✅'} Approve
                  </motion.button>
                  <motion.button
                    onClick={() => handleAction(owner.id, 'reject')}
                    disabled={actionLoading === owner.id + 'reject'}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-300 rounded-lg font-semibold hover:from-red-500/40 hover:to-rose-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {actionLoading === owner.id + 'reject' ? '⏳' : '❌'} Reject
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
