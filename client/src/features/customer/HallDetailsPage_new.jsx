import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import customerApi from '../../api/customerApi';

const HallDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHallDetails = async () => {
      try {
        setLoading(true);
        const data = await customerApi.getHallDetails(id);
        setHall(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load hall details');
      } finally {
        setLoading(false);
      }
    };
    fetchHallDetails();
  }, [id]);

  // Fetch time slots when date changes
  useEffect(() => {
    if (selectedDate && hall) {
      const fetchTimeSlots = async () => {
        try {
          setSlotsLoading(true);
          const data = await customerApi.getHallTimeSlots(id, selectedDate);
          setTimeSlots(data.timeSlots || data || []);
        } catch (err) {
          console.error('Failed to load time slots:', err);
          setTimeSlots([]);
        } finally {
          setSlotsLoading(false);
        }
      };
      fetchTimeSlots();
    }
  }, [selectedDate, id, hall]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] flex items-center justify-center">
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

  if (error || !hall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-200 font-semibold text-lg mb-6">{error || 'Hall not found'}</p>
            <motion.button
              onClick={() => navigate('/customer/search')}
              className="px-8 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              ← Back to Search
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const images = [hall.image, ...(hall.gallery || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/customer/search')}
          className="mb-8 px-6 py-3 text-[#7a2222] hover:text-[#5a1a1a] font-bold flex items-center gap-2 rounded-xl hover:bg-white/20 transition"
          whileHover={{ x: -5 }}
        >
          ← Back to Search
        </motion.button>

        {/* Hall Image Gallery */}
        {images.length > 0 && (
          <motion.div
            className="mb-12 rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative h-96 md:h-[500px] bg-slate-800">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={hall.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7a2222]/30 via-transparent to-transparent"></div>

              {/* Gallery Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition"
                  >
                    ← 
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition"
                  >
                    →
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition ${
                          idx === currentImageIndex ? 'bg-[#bfa544]' : 'bg-white/50'
                        }`}
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="bg-white/80 backdrop-blur-sm p-4 flex gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? 'border-[#bfa544]' : 'border-[#bfa544]/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <motion.div
              className="bg-gradient-to-br bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-[#bfa544]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h1 className="text-5xl font-extrabold text-[#7a2222] mb-3">{hall.name}</h1>
                <p className="text-xl text-gray-700 mb-6">📍 {hall.address}</p>
              </motion.div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '👥 Capacity', value: `${hall.capacity} guests` },
                  { label: '💰 Base Price', value: `₹${hall.basePrice?.toLocaleString()}` },
                  { label: '🏘️ City', value: hall.city || 'N/A' },
                  { label: '⭐ Rating', value: `${hall.rating || 'N/A'}` }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white/5 rounded-xl p-4 border border-[#bfa544]/20 hover:bg-white/10 transition"
                    whileHover={{ y: -4 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-[#7a2222]">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            {hall.description && (
              <motion.div
                className="bg-gradient-to-br bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-[#bfa544]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-[#7a2222] mb-4">📝 Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{hall.description}</p>
              </motion.div>
            )}

            {/* Amenities */}
            {hall.amenities && hall.amenities.length > 0 && (
              <motion.div
                className="bg-gradient-to-br bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-[#bfa544]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-[#7a2222] mb-6">✨ Amenities</h2>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {hall.amenities.map((amenity, idx) => (
                    <motion.div
                      key={idx}
                      className="px-4 py-3 bg-gradient-to-br from-[#bfa544]/20 to-[#8b7a2a]/20 text-[#ffd700] rounded-xl text-sm font-bold border border-[#bfa544]/30 hover:bg-[#bfa544]/30 transition"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      ✓ {amenity}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Event Types */}
            {hall.eventTypes && hall.eventTypes.length > 0 && (
              <motion.div
                className="bg-gradient-to-br bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-[#bfa544]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-[#7a2222] mb-6">🎉 Suitable For</h2>
                <div className="flex flex-wrap gap-3">
                  {hall.eventTypes.map((eventType, idx) => (
                    <motion.span
                      key={idx}
                      className="px-4 py-2 bg-purple-200 text-purple-700 rounded-full font-bold border border-purple-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      {eventType}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Menus */}
            {hall.menus && hall.menus.length > 0 && (
              <motion.div
                className="bg-gradient-to-br bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-[#bfa544]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-[#7a2222] mb-6">🍽️ Available Menus</h2>
                <motion.div
                  className="space-y-4"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {hall.menus.map((menu, idx) => (
                    <motion.div
                      key={idx}
                      className="border border-[#bfa544]/30 rounded-xl p-6 hover:bg-white/5 transition bg-gradient-to-br from-white/5 to-transparent"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ x: 8 }}
                    >
                      <h3 className="font-bold text-xl text-[#7a2222]">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-gray-600 text-sm mt-2">{menu.description}</p>
                      )}
                      <div className="mt-3 text-[#bfa544] font-bold text-lg">
                        ₹{menu.price?.toLocaleString()} per plate
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Booking Panel (Sticky) */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-8 bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-[#bfa544]/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-[#7a2222] mb-2">⏰ Time Slots</h2>
              <p className="text-gray-700 mb-8 text-sm">Pick your preferred date and time</p>

              {/* Date Picker */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-[#7a2222] mb-3">📅 Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white border border-[#bfa544]/30 rounded-xl text-[#7a2222] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
                />
              </div>

              {/* Time Slots */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#7a2222] mb-4">🕐 Available Times</h3>
                {slotsLoading ? (
                  <div className="flex justify-center py-6">
                    <motion.div
                      className="relative w-8 h-8"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#bfa544]"></div>
                    </motion.div>
                  </div>
                ) : timeSlots.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-2 gap-3 mb-6"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                    initial="hidden"
                    animate="visible"
                  >
                    {timeSlots.map((slot, idx) => (
                      <motion.button
                        key={idx}
                        disabled={!slot.available}
                        className={`px-4 py-3 rounded-lg text-sm font-bold transition ${
                          slot.available
                            ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 hover:shadow-lg'
                            : 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                        }`}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 }
                        }}
                        whileHover={slot.available ? { scale: 1.05 } : {}}
                        whileTap={slot.available ? { scale: 0.95 } : {}}
                      >
                        {slot.start} - {slot.end}
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-gray-700 text-center py-6">❌ No time slots available</p>
                )}
              </div>

              {/* Booking Button */}
              <motion.button
                onClick={() => setShowBookingModal(true)}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-2xl hover:shadow-2xl transition font-bold text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎯 Book This Hall
              </motion.button>

              {/* Info Badge */}
              <motion.div
                className="mt-6 p-4 bg-white/5 rounded-xl border border-[#bfa544]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-gray-600 leading-relaxed">
                  ℹ️ Select available time slots. Confirm your event details and pricing in the next step.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm border border-[#bfa544]/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-[#7a2222] mb-4">🎯 Ready to Book?</h2>
              <p className="text-gray-700 mb-8 text-lg">
                Let's proceed with your booking for <span className="font-bold text-[#bfa544]">{hall.name}</span>
              </p>
              <div className="flex gap-4">
                <motion.button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border border-[#bfa544]/30 text-[#7a2222] rounded-xl hover:bg-white/10 transition font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate(`/customer/booking/${id}`, { state: { date: selectedDate } });
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl hover:shadow-lg transition font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HallDetailsPage;




