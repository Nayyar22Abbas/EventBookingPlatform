import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import customerApi from '../../api/customerApi';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, reviewId: null });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await customerApi.getMyReviews();
      setReviews(data.reviews || data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await customerApi.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      setDeleteConfirm({ open: false, reviewId: null });
    } catch (err) {
      setError(err.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={rating >= star ? 'text-[#ffd700] text-xl' : 'text-gray-600 text-xl'}>
            ★
          </span>
        ))}
      </div>
    );
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
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Reviews</span>
          </h1>
          <p className="text-xl text-gray-300">View and manage your venue reviews</p>
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

        {/* Empty State */}
        {reviews.length === 0 ? (
          <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-16 text-center border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-5xl mb-4">⭐</p>
            <p className="text-gray-300 text-xl mb-2">No reviews yet</p>
            <p className="text-gray-400 mb-6">Complete a booking to leave a review for the venue!</p>
            <motion.a
              href="/customer/bookings"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              📋 View My Bookings
            </motion.a>
          </motion.div>
        ) : (
          <>
            {/* Review Count */}
            <motion.div
              className="mb-8 inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-gray-300 text-lg">
                <span className="font-bold text-[#bfa544]">{reviews.length}</span> review{reviews.length !== 1 ? 's' : ''} submitted
              </span>
            </motion.div>

            {/* Reviews Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {reviews.map((review, idx) => (
                <motion.div
                  key={review._id}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-[#bfa544]/50 transition group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white mb-3">
                      🏘️ {review.hall?.name}
                    </h3>
                    {renderStars(review.rating)}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Location Info */}
                    {review.hall?.address && (
                      <div className="mb-4 pb-4 border-b border-white/10">
                        <p className="text-sm text-gray-400">📍 Location</p>
                        <p className="text-white text-sm font-semibold">
                          {review.hall.address}, {review.hall.city}
                        </p>
                      </div>
                    )}

                    {/* Rating with Label */}
                    <div className="mb-4 pb-4 border-b border-white/10">
                      <p className="text-sm text-gray-400 mb-2">⭐ Rating</p>
                      <div className="flex items-center justify-between">
                        {renderStars(review.rating)}
                        <span className="text-lg font-bold text-[#ffd700]">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">💬 Comment</p>
                        <p className="text-white text-sm leading-relaxed bg-slate-700/30 p-3 rounded-lg border border-white/10">
                          {review.comment}
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    <div className="text-xs text-gray-400 mb-6">
                      📅 {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      onClick={() => setDeleteConfirm({ open: true, reviewId: review._id })}
                      className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg font-semibold transition text-sm border border-red-500/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🗑️ Delete Review
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setDeleteConfirm({ open: false, reviewId: null })}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-[#bfa544]/30 max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Delete Review?</h2>
            <p className="text-gray-300 mb-8">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex gap-4">
              <motion.button
                onClick={() => setDeleteConfirm({ open: false, reviewId: null })}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Keep Review
              </motion.button>
              <motion.button
                onClick={() => handleDeleteReview(deleteConfirm.reviewId)}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Delete Review
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MyReviewsPage;
