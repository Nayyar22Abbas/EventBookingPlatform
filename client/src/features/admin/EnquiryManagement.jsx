import React, { useEffect, useState } from 'react';
import { getEnquiries, respondToEnquiry, closeEnquiry } from '../../api/adminApi';
import { motion, AnimatePresence } from 'framer-motion';

function EnquiryModal({ open, onClose, onSubmit, loading }) {
  const [response, setResponse] = useState('');
  useEffect(() => { if (!open) setResponse(''); }, [open]);

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
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Respond to Enquiry</h2>
            <motion.textarea
              className="w-full border border-[#bfa544]/30 bg-slate-600/50 rounded-xl p-3 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition resize-none"
              rows={4}
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Type your response here..."
              whileFocus={{ scale: 1.02 }}
            />
            <div className="flex gap-2 justify-end">
              <motion.button
                className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-slate-600/50 transition"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={() => onSubmit(response)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? '⏳ Sending...' : '📤 Send'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Responded', value: 'responded' },
  { label: 'Closed', value: 'closed' },
];

const getStatusColor = (status) => {
  switch(status) {
    case 'pending': return 'text-yellow-400';
    case 'responded': return 'text-blue-400';
    case 'closed': return 'text-gray-400';
    default: return 'text-gray-300';
  }
};

const getStatusBg = (status) => {
  switch(status) {
    case 'pending': return 'bg-yellow-500/20 border-yellow-500/30';
    case 'responded': return 'bg-blue-500/20 border-blue-500/30';
    case 'closed': return 'bg-gray-500/20 border-gray-500/30';
    default: return 'bg-gray-500/20 border-gray-500/30';
  }
};

export default function EnquiryManagement() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null });
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [status, setStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchEnquiries = () => {
    setLoading(true);
    getEnquiries(status)
      .then(res => setEnquiries(res.data))
      .catch(() => setToast('Failed to load enquiries'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEnquiries(); }, [status]);

  const handleRespond = async (id, message) => {
    setModalLoading(true);
    try {
      await respondToEnquiry(id, { message });
      setToast('Response sent');
      setModal({ open: false, id: null });
      fetchEnquiries();
    } catch {
      setToast('Failed to respond');
    } finally {
      setModalLoading(false);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleClose = async (id) => {
    setActionLoading(id);
    try {
      await closeEnquiry(id);
      setToast('Enquiry closed');
      fetchEnquiries();
    } catch {
      setToast('Failed to close enquiry');
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
            Enquiry <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Management</span>
          </h1>
          <p className="text-xl text-gray-300">Manage customer enquiries and respond promptly</p>
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

        {/* Status Filter */}
        <motion.div
          className="mb-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-gray-300 font-semibold">Filter by Status:</label>
          <motion.select
            className="px-4 py-2 bg-slate-700/50 border border-[#bfa544]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#bfa544] transition"
            value={status}
            onChange={e => setStatus(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </motion.select>
        </motion.div>

        {/* Enquiries Grid or Empty State */}
        {enquiries.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-300 text-xl">No enquiries found</p>
            <p className="text-gray-400">All enquiries have been resolved</p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {enquiries.map((enq) => (
              <motion.div
                key={enq.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#bfa544]/50 transition"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-1">{enq.hallName}</h3>
                    <p className="text-sm text-gray-400 mb-2">👤 {enq.customerName}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">💬 {enq.message}</p>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusBg(enq.status)} ${getStatusColor(enq.status)}`}>
                      {enq.status.charAt(0).toUpperCase() + enq.status.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:justify-end">
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-lg font-semibold hover:from-blue-500/40 hover:to-cyan-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={enq.status !== 'pending' || modalLoading}
                      onClick={() => setModal({ open: true, id: enq.id })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      💬 Respond
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-500/30 text-gray-300 rounded-lg font-semibold hover:from-gray-500/40 hover:to-slate-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={enq.status === 'closed' || actionLoading === enq.id}
                      onClick={() => handleClose(enq.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {actionLoading === enq.id ? '⏳' : '✓'} Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <EnquiryModal
        open={modal.open}
        onClose={() => setModal({ open: false, id: null })}
        onSubmit={msg => handleRespond(modal.id, msg)}
        loading={modalLoading}
      />
    </div>
  );
}
