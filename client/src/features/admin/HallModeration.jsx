import React, { useEffect, useState } from 'react';
import { getAllHalls, deleteHall } from '../../api/adminApi';
import { motion, AnimatePresence } from 'framer-motion';

function ConfirmModal({ open, onClose, onConfirm, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-[#bfa544]/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Delete Hall?</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this hall? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <motion.button
                className="px-4 py-2 text-gray-700 border border-gray-600 rounded-lg hover:bg-slate-600/50 transition"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-red-500/80 to-rose-500/80 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={onConfirm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? '⏳ Deleting...' : '🗑️ Delete'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HallModeration() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null });
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchHalls = () => {
    setLoading(true);
    getAllHalls()
      .then(res => setHalls(res.data))
      .catch(() => setToast('Failed to load halls'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHalls(); }, []);

  const handleDelete = async () => {
    setModalLoading(true);
    try {
      await deleteHall(modal.id);
      setToast('Hall deleted');
      setModal({ open: false, id: null });
      fetchHalls();
    } catch {
      setToast('Failed to delete hall');
    } finally {
      setModalLoading(false);
      setTimeout(() => setToast(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-8 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-[#bfa544]/30 border-t-[#bfa544] rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#7a2222] mb-2">
            Hall <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Moderation</span>
          </h1>
          <p className="text-xl text-gray-700">Review and manage all halls on the platform</p>
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

        {/* Halls Grid or Empty State */}
        {halls.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🏛️</div>
            <p className="text-gray-700 text-xl">No halls found</p>
            <p className="text-gray-600">No halls are currently registered on the platform</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {halls.map((hall) => (
              <motion.div
                key={hall.id}
                className="bg-gradient-to-br bg-white/80 backdrop-blur-xl border border-[#bfa544]/20 rounded-2xl p-6 hover:border-[#bfa544]/50 transition overflow-hidden"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5 }}
              >
                {/* Hall Image Placeholder */}
                <div className="w-full h-40 bg-gradient-to-br from-[#bfa544]/20 to-[#7a2222]/20 rounded-xl mb-4 flex items-center justify-center border border-[#bfa544]/20">
                  <span className="text-4xl">🏛️</span>
                </div>

                {/* Hall Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white truncate">{hall.name}</h3>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">👤 Owner: <span className="text-gray-700 font-semibold">{hall.ownerName}</span></p>
                    <p className="text-sm text-gray-600">📅 Created: <span className="text-gray-700">{new Date(hall.createdAt).toLocaleDateString()}</span></p>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${
                    hall.status === 'approved' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
                    hall.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' :
                    'bg-red-500/20 border-red-500/30 text-red-300'
                  }`}>
                    {hall.status === 'approved' ? '✅' : hall.status === 'pending' ? '⏳' : '❌'} {hall.status.charAt(0).toUpperCase() + hall.status.slice(1)}
                  </div>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => setModal({ open: true, id: hall.id })}
                    className="w-full mt-4 py-2 px-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-300 rounded-lg font-semibold hover:from-red-500/40 hover:to-rose-500/40 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🗑️ Delete Hall
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={modalLoading}
      />
    </div>
  );
}




