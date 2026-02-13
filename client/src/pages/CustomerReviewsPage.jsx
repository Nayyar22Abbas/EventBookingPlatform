import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CustomerReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setComment('');
      setRating(5);
      setSelectedHall('');
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-extrabold text-[#7a2222] mb-2">
            Hall <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Reviews</span>
          </h1>
          <p className="text-xl text-gray-700">Share your experience and help other couples</p>
        </motion.div>

        {/* Review Form */}
        <motion.div
          className="bg-gradient-to-br bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 mb-12 border border-[#bfa544]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-[#7a2222] mb-2">✍️ Share Your Experience</h2>
          <p className="text-gray-600 mb-8">Help other couples make their special day memorable</p>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Hall Selection */}
            <motion.div
              className="bg-white/80 rounded-2xl p-6 border border-[#bfa544]/20"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-[#7a2222] mb-3">🏘️ Select Hall *</label>
              <select
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                className="w-full px-5 py-3 bg-white border border-[#bfa544]/30 rounded-xl text-[#7a2222] focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
                required
              >
                <option value="">Choose a hall you've booked</option>
                <option value="hall-1">Sample Hall 1</option>
                <option value="hall-2">Sample Hall 2</option>
              </select>
            </motion.div>

            {/* Star Rating */}
            <motion.div
              className="bg-white/80 rounded-2xl p-6 border border-[#bfa544]/20"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-[#7a2222] mb-4">⭐ Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className={`text-5xl transition ${
                      star <= (hoveredStar || rating)
                        ? 'text-[#ffd700] drop-shadow-lg'
                        : 'text-gray-300 hover:text-[#bfa544]'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ★
                  </motion.button>
                ))}
              </div>
              <p className="text-sm text-gray-700 mt-3">
                You're rating: <span className="font-bold text-[#bfa544]">
                  {hoveredStar || rating} out of 5 stars
                </span>
              </p>
            </motion.div>

            {/* Review Textarea */}
            <motion.div
              className="bg-white/80 rounded-2xl p-6 border border-[#bfa544]/20"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-[#7a2222] mb-3">📝 Your Review *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                className="w-full px-5 py-3 bg-white border border-[#bfa544]/30 rounded-xl text-[#7a2222] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition resize-none"
                placeholder="Tell us about your experience... The venue, staff, food, decoration, overall experience..."
                required
              />
              <p className="text-xs text-gray-700 mt-2">
                {comment.length} characters
              </p>
            </motion.div>

            {/* Success Message */}
            {submitted && (
              <motion.div
                className="p-6 bg-green-100 border border-green-300 text-green-700 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl"
                >
                  ✓
                </motion.div>
                <span className="font-bold text-lg">Thank you! Your review has been submitted successfully.</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-2xl hover:shadow-2xl transition font-bold text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📤 Submit Review
            </motion.button>
          </form>
        </motion.div>

        {/* Past Reviews */}
        <motion.div
          className="bg-gradient-to-br bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#bfa544]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-[#7a2222] mb-8">📜 Your Past Reviews</h2>
          
          {reviews.length === 0 ? (
            <motion.div
              className="bg-gray-100 rounded-2xl p-12 text-center border border-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-5xl mb-4">📝</p>
              <p className="text-gray-700 text-lg">No reviews yet</p>
              <p className="text-gray-600 mt-2">Once you book and complete an event, you'll be able to leave reviews</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
            >
              {reviews.map((review, idx) => (
                <motion.div
                  key={review._id}
                  className="bg-white border border-[#bfa544]/20 rounded-2xl p-6 hover:border-[#bfa544]/50 transition group overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 8 }}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#bfa544]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>

                  {/* Content */}
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl text-[#7a2222]">{review.hallName}</h3>
                      <motion.div
                        className="text-[#ffd700] text-2xl"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </motion.div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                    <p className="text-xs text-gray-600">📅 {review.date}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerReviewsPage;

