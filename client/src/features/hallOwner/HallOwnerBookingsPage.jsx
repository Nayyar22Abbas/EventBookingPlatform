import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hallOwnerApi from '../../api/hallOwnerApi';
import { Calendar, Users, Banknote, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'from-yellow-500 to-orange-500', text: 'Pending', icon: Clock },
    confirmed: { bg: 'from-blue-500 to-cyan-500', text: 'Confirmed', icon: CheckCircle },
    completed: { bg: 'from-green-500 to-emerald-500', text: 'Completed', icon: CheckCircle },
    rejected: { bg: 'from-red-500 to-pink-500', text: 'Rejected', icon: AlertCircle },
    cancelled: { bg: 'from-gray-500 to-slate-500', text: 'Cancelled', icon: AlertCircle },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.bg} text-white font-semibold text-sm`}>
      <Icon size={16} />
      {config.text}
    </div>
  );
};

// Confirmation Modal
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading, variant = 'default' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm mx-4 backdrop-blur-xl"
        >
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                variant === 'danger'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }`}
            >
              {isLoading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Rejection Reason Modal
const RejectReasonModal = ({ isOpen, onConfirm, onCancel, isLoading }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm mx-4 backdrop-blur-xl"
        >
          <h3 className="text-xl font-bold text-white mb-2">Reject Booking</h3>
          <p className="text-gray-300 mb-4">Please provide a reason for rejection (optional):</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Date not available, or other reason..."
            className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-4 resize-none"
            rows={4}
            disabled={isLoading}
          />
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Reject'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Main Component
export default function HallOwnerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [approveModal, setApproveModal] = useState({ isOpen: false, bookingId: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, bookingId: null });
  const [completeModal, setCompleteModal] = useState({ isOpen: false, bookingId: null });
  const [rejectReasonModal, setRejectReasonModal] = useState({ isOpen: false, bookingId: null });

  const [actionLoading, setActionLoading] = useState(false);

  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hallOwnerApi.getBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve
  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await hallOwnerApi.approveBooking(approveModal.bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === approveModal.bookingId ? { ...b, status: 'confirmed' } : b
        )
      );
      setApproveModal({ isOpen: false, bookingId: null });
    } catch (err) {
      console.error('Error approving booking:', err);
      setError(err.response?.data?.message || 'Failed to approve booking');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const handleRejectClick = (bookingId) => {
    setRejectModal({ isOpen: false, bookingId });
    setRejectReasonModal({ isOpen: true, bookingId });
  };

  const handleReject = async (reason) => {
    try {
      setActionLoading(true);
      await hallOwnerApi.rejectBooking(rejectReasonModal.bookingId, reason);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === rejectReasonModal.bookingId ? { ...b, status: 'rejected' } : b
        )
      );
      setRejectReasonModal({ isOpen: false, bookingId: null });
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setError(err.response?.data?.message || 'Failed to reject booking');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle complete
  const handleComplete = async () => {
    try {
      setActionLoading(true);
      await hallOwnerApi.completeBooking(completeModal.bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === completeModal.bookingId ? { ...b, status: 'completed' } : b
        )
      );
      setCompleteModal({ isOpen: false, bookingId: null });
    } catch (err) {
      console.error('Error completing booking:', err);
      setError(err.response?.data?.message || 'Failed to complete booking');
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-2">
            Booking Management
          </h1>
          <p className="text-gray-300">Manage and track all your event bookings</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-gap-3"
          >
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full"
            />
          </div>
        ) : bookings.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-white/10 rounded-2xl backdrop-blur-xl p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center mb-4">
              <Calendar className="text-slate-900" size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Bookings Yet</h2>
            <p className="text-gray-400 mb-6">You don't have any bookings at the moment. Bookings from customers will appear here.</p>
          </motion.div>
        ) : (
          // Bookings Table
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Hall</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Event Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Guests</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, idx) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {booking.customer?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {booking.hall?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {booking.eventType?.name || booking.functionType || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {booking.timeSlot?.date ? formatDate(booking.timeSlot.date) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Users size={16} className="text-amber-400" />
                          {booking.guestCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-amber-400">
                        <div className="flex items-center gap-1">
                          <Banknote size={16} />
                          Rs. {booking.totalPrice?.toLocaleString('en-PK') || '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center gap-2 justify-center flex-wrap">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => setApproveModal({ isOpen: true, bookingId: booking._id })}
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs font-semibold transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectClick(booking._id)}
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs font-semibold transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => setCompleteModal({ isOpen: true, bookingId: booking._id })}
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs font-semibold transition-all"
                            >
                              Complete
                            </button>
                          )}
                          {!['pending', 'confirmed'].includes(booking.status) && (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={approveModal.isOpen}
        title="Approve Booking"
        message="Are you sure you want to approve this booking? The time slot will be marked as booked."
        onConfirm={handleApprove}
        onCancel={() => setApproveModal({ isOpen: false, bookingId: null })}
        isLoading={actionLoading}
      />

      <RejectReasonModal
        isOpen={rejectReasonModal.isOpen}
        onConfirm={handleReject}
        onCancel={() => setRejectReasonModal({ isOpen: false, bookingId: null })}
        isLoading={actionLoading}
      />

      <ConfirmationModal
        isOpen={completeModal.isOpen}
        title="Complete Booking"
        message="Are you sure you want to mark this booking as completed? This action cannot be undone."
        onConfirm={handleComplete}
        onCancel={() => setCompleteModal({ isOpen: false, bookingId: null })}
        isLoading={actionLoading}
      />
    </div>
  );
}
