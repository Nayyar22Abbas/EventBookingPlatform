import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import customerApi from '../../api/customerApi';

const SubmitReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      if (rating === 0) {
        setError('Please select a rating');
        return;
      }

      setLoading(true);
      setError('');

      const payload = {
        hallId: booking.hall?._id,
        bookingId: booking._id,
        rating,
        comment: comment.trim() || undefined
      };

      await customerApi.submitReview(
        payload.hallId,
        payload.bookingId,
        payload.rating,
        payload.comment
      );

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const stars = [1, 2, 3, 4, 5];
  const displayRating = hoverRating || rating;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full p-8 border border-[#bfa544]/30"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                ⭐ Share Your Feedback
              </h2>
              <p className="text-gray-300">
                How was your event at <span className="font-bold text-[#bfa544]">{booking.hall?.name}</span>?
              </p>
            </div>
            <motion.button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          {/* Event Info */}
          <motion.div
            className="mb-8 p-4 bg-slate-700/30 rounded-lg border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Function Type:</span>
                <p className="text-white font-semibold">{booking.functionType}</p>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <p className="text-white font-semibold">
                  {booking.timeSlot?.date ? new Date(booking.timeSlot.date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Guests:</span>
                <p className="text-white font-semibold">{booking.guestCount}</p>
              </div>
              <div>
                <span className="text-gray-400">Amount Paid:</span>
                <p className="text-white font-semibold">PKR {booking.totalPrice?.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          {/* Rating Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-lg font-bold text-white mb-4">Rating</label>
            <div className="flex gap-4 justify-center mb-4">
              {stars.map((star) => (
                <motion.button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className={`text-5xl transition ${
                    displayRating >= star ? 'text-[#ffd700]' : 'text-gray-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ★
                </motion.button>
              ))}
            </div>
            {rating > 0 && (
              <motion.p
                className="text-center text-[#bfa544] font-semibold text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </motion.p>
            )}
          </motion.div>

          {/* Comment Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-lg font-bold text-white mb-3">Comment (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this venue..."
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#bfa544]/50 focus:ring-1 focus:ring-[#bfa544]/30 resize-none"
              rows={4}
              maxLength={1000}
            />
            <div className="text-sm text-gray-400 mt-2">
              {comment.length}/1000 characters
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] hover:shadow-lg text-white rounded-lg font-bold transition disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-transparent border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  Submitting...
                </span>
              ) : (
                '⭐ Submit Review'
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubmitReviewModal;
