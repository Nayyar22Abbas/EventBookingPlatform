import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import customerApi from '../api/customerApi';
import SubmitReviewModal from '../features/customer/SubmitReviewModal';

const CustomerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [cancelConfirm, setCancelConfirm] = useState({ open: false, bookingId: null });
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await customerApi.getBookings();
      setBookings(data.bookings || data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setCancelLoading(true);
    try {
      await customerApi.cancelBooking(bookingId);
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      setCancelConfirm({ open: false, bookingId: null });
      setSuccess('Booking cancelled successfully!');
      setError('');
      // Auto-clear success message
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
      setSuccess('');
      // Close modal on error so user can see error message
      setCancelConfirm({ open: false, bookingId: null });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReviewSuccess = () => {
    setReviewModal({ open: false, booking: null });
    fetchBookings();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#bfa544] border-r-[#bfa544]"></div>
        </motion.div>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border border-green-500/30';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-200 border border-yellow-500/30';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-200 border border-red-500/30';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border border-blue-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-200 border border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return '✓';
      case 'pending': return '⏳';
      case 'cancelled': return '✕';
      case 'completed': return '🎉';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-extrabold text-white mb-2">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Bookings</span>
          </h1>
          <p className="text-xl text-gray-300">View and manage all your event bookings</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-8 p-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-2xl backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            className="mb-8 p-6 bg-green-500/20 border border-green-500/50 text-green-200 rounded-2xl backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {success}
          </motion.div>
        )}

        {/* Empty State */}
        {bookings.length === 0 ? (
          <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-16 text-center border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-5xl mb-4">🎭</p>
            <p className="text-gray-300 text-xl mb-2">No bookings yet</p>
            <p className="text-gray-400 mb-6">Start by searching for a venue and creating your first booking!</p>
            <motion.a
              href="/customer/halls"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              🔍 Search Venues
            </motion.a>
          </motion.div>
        ) : (
          <>
            {/* Booking Count */}
            <motion.div
              className="mb-8 inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-gray-300 text-lg">
                Showing <span className="font-bold text-[#bfa544]">{bookings.length}</span> booking{bookings.length !== 1 ? 's' : ''}
              </span>
            </motion.div>

            {/* Bookings Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {bookings.map((booking, idx) => (
                <motion.div
                  key={booking._id}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-[#bfa544]/50 transition group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Header Section */}
                  <div className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">
                      🏘️ {booking.hall?.name || 'Hall'}
                    </h3>
                    <motion.div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${getStatusStyles(booking.status)}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {getStatusIcon(booking.status)} {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                    </motion.div>
                  </div>

                  {/* Main Content */}
                  <div className="p-6">
                    {/* Quick Info */}
                    <motion.div className="space-y-2 mb-6 pb-6 border-b border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">📅 Date:</span>
                        <span className="text-white font-semibold">
                          {booking.timeSlot?.date ? new Date(booking.timeSlot.date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">⏰ Time:</span>
                        <span className="text-white font-semibold">
                          {booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">👥 Guests:</span>
                        <span className="text-white font-semibold">{booking.guestCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">🎉 Event Type:</span>
                        <span className="text-white font-semibold">{booking.functionType}</span>
                      </div>
                    </motion.div>

                    {/* Expanded Details */}
                    {expandedBooking === booking._id && (
                      <motion.div
                        className="space-y-3 mb-6 pb-6 border-b border-white/10"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {booking.menu?.name && (
                          <div className="text-sm">
                            <span className="text-gray-400">🍽️ Menu:</span>
                            <span className="text-white block font-semibold">{booking.menu.name}</span>
                          </div>
                        )}
                        
                        {/* Price Breakdown */}
                        <div className="bg-[#bfa544]/10 rounded-lg p-3 border border-[#bfa544]/30">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Base Price:</span>
                              <span className="text-white">PKR {booking.basePrice?.toLocaleString()}</span>
                            </div>
                            {booking.menuPrice > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Menu Price:</span>
                                <span className="text-white">PKR {booking.menuPrice?.toLocaleString()}</span>
                              </div>
                            )}
                            {booking.functionTypeCharge > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Function Charge:</span>
                                <span className="text-white">PKR {booking.functionTypeCharge?.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between border-t border-[#bfa544]/30 pt-2 font-bold">
                              <span className="text-[#bfa544]">Total:</span>
                              <span className="text-[#ffd700]">PKR {booking.totalPrice?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="text-sm">
                            <span className="text-gray-400">📝 Notes:</span>
                            <p className="text-white mt-1">{booking.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Price Summary */}
                    <div className="mb-6 p-3 bg-gradient-to-r from-[#bfa544]/20 to-[#8b7a2a]/20 rounded-lg border border-[#bfa544]/30">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-semibold">💰 Total:</span>
                        <span className="text-lg font-bold text-[#ffd700]">
                          PKR {booking.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {/* Toggle Details */}
                      <motion.button
                        onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)}
                        className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg font-semibold transition text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {expandedBooking === booking._id ? '🔼 Hide Details' : '🔽 Show Details'}
                      </motion.button>

                      {/* Cancel Button - Only for pending/confirmed */}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <motion.button
                          onClick={() => setCancelConfirm({ open: true, bookingId: booking._id })}
                          className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg font-semibold transition text-sm border border-red-500/30"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ✕ Cancel Booking
                        </motion.button>
                      )}

                      {/* Review Button - Only for completed */}
                      {booking.status === 'completed' && (
                        <motion.button
                          onClick={() => setReviewModal({ open: true, booking })}
                          className="w-full px-4 py-2 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-lg font-semibold hover:shadow-lg transition text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ⭐ Leave Review
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelConfirm.open && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setCancelConfirm({ open: false, bookingId: null })}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-[#bfa544]/30 max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Cancel Booking?</h2>
            <p className="text-gray-300 mb-8">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex gap-4">
              <motion.button
                onClick={() => setCancelConfirm({ open: false, bookingId: null })}
                disabled={cancelLoading}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Keep Booking
              </motion.button>
              <motion.button
                onClick={() => handleCancelBooking(cancelConfirm.bookingId)}
                disabled={cancelLoading}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cancelLoading ? '⏳ Cancelling...' : 'Cancel Booking'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Review Modal */}
      {reviewModal.open && (
        <SubmitReviewModal
          booking={reviewModal.booking}
          onClose={() => setReviewModal({ open: false, booking: null })}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default CustomerBookingsPage;
