import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import customerApi from '../../api/customerApi';

const BookingPage = () => {
  const { id: hallId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [hall, setHall] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({
    date: location.state?.date || new Date().toISOString().split('T')[0],
    timeSlot: '',
    functionType: '',
    menuId: '',
    guestCount: '',
    notes: ''
  });
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch hall data
  useEffect(() => {
    const fetchHallData = async () => {
      try {
        setLoading(true);
        const hallData = await customerApi.getHallDetails(hallId);
        const hall = hallData.hall || hallData;
        setHall(hall);
        setMenus(hall.menus || hallData.menus || []);
        
        // Fetch time slots for selected date
        const slots = await customerApi.getHallTimeSlots(hallId, form.date);
        setTimeSlots(slots || []);
      } catch (err) {
        setError(err.message || 'Failed to load booking information');
      } finally {
        setLoading(false);
      }
    };
    
    if (hallId) {
      fetchHallData();
    }
  }, [hallId]);

  // Update time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const slots = await customerApi.getHallTimeSlots(hallId, form.date);
        setTimeSlots(slots.timeSlots || slots || []);
      } catch (err) {
        console.error('Failed to load time slots:', err);
        setTimeSlots([]);
      }
    };
    
    if (hallId && form.date) {
      fetchTimeSlots();
    }
  }, [form.date, hallId]);

  // Calculate price dynamically when relevant fields change
  useEffect(() => {
    const calculatePriceAsync = async () => {
      if (form.functionType && form.guestCount && hallId) {
        try {
          const priceData = await customerApi.calculatePrice(
            hallId,
            form.functionType,
            parseInt(form.guestCount),
            form.menuId || null
          );
          setPricing(priceData.pricing);
        } catch (err) {
          console.error('Failed to calculate price:', err);
          setPricing(null);
        }
      } else {
        setPricing(null);
      }
    };
    
    calculatePriceAsync();
  }, [form.functionType, form.guestCount, form.menuId, hallId]);

  const validateForm = () => {
    const errors = {};
    
    if (!form.date) errors.date = 'Date is required';
    if (!form.timeSlot) errors.timeSlot = 'Time slot is required';
    if (!form.functionType) errors.functionType = 'Event function is required';
    if (!form.menuId) errors.menuId = 'Menu selection is required';
    if (!form.guestCount || parseInt(form.guestCount) < 1) errors.guestCount = 'Number of guests must be at least 1';
    if (hall && parseInt(form.guestCount) > hall.capacity) errors.guestCount = `Number of guests cannot exceed hall capacity (${hall.capacity})`;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const bookingData = {
        hallId,
        timeSlotId: form.timeSlot,
        functionType: form.functionType,
        menuId: form.menuId,
        guestCount: parseInt(form.guestCount),
        notes: form.notes
      };

      await customerApi.makeBooking(bookingData);
      setSuccess('✓ Booking request submitted successfully!');
      
      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  if (!hall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-200 font-semibold text-lg mb-6">Hall information could not be loaded</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-extrabold text-white mb-3">
            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Booking</span>
          </h1>
          <p className="text-xl text-gray-300">Booking for <span className="font-bold text-[#bfa544]">{hall.name}</span></p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            className="mb-8 p-6 bg-green-500/20 border border-green-500/50 text-green-200 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-2xl">✓</span>
            <span className="font-bold text-lg">{success}</span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-8 p-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-2xl backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Date */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-gray-200 mb-3">📅 Event Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-5 py-3 bg-slate-600/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  validationErrors.date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#bfa544]/30 focus:ring-[#bfa544] focus:border-transparent'
                }`}
              />
              {validationErrors.date && (
                <motion.p
                  className="text-red-400 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⚠️ {validationErrors.date}
                </motion.p>
              )}
            </motion.div>

            {/* Time Slot */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-gray-200 mb-4">⏰ Time Slot *</label>
              {timeSlots.length > 0 ? (
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {timeSlots.map((slot, idx) => (
                    <motion.button
                      key={slot._id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, timeSlot: slot._id }))}
                      disabled={slot.status !== 'available'}
                      className={`p-3 rounded-xl font-bold border-2 transition ${
                        form.timeSlot === slot._id
                          ? 'bg-gradient-to-r from-[#bfa544]/40 to-[#8b7a2a]/40 border-[#bfa544] text-[#ffd700]'
                          : slot.status === 'available'
                          ? 'bg-white/5 border-white/20 text-gray-300 hover:border-[#bfa544] hover:bg-white/10'
                          : 'bg-slate-600/30 border-slate-600/30 text-gray-600 cursor-not-allowed'
                      }`}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                      whileHover={slot.status === 'available' ? { scale: 1.05 } : {}}
                      whileTap={slot.status === 'available' ? { scale: 0.95 } : {}}
                    >
                      {slot.startTime} - {slot.endTime}
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <p className="text-gray-400 text-sm mb-2">❌ No time slots available for this date</p>
              )}
              {validationErrors.timeSlot && (
                <motion.p
                  className="text-red-400 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⚠️ {validationErrors.timeSlot}
                </motion.p>
              )}
            </motion.div>

            {/* Event Function */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-gray-200 mb-3">🎉 Event Function *</label>
              <select
                name="functionType"
                value={form.functionType}
                onChange={handleChange}
                className={`w-full px-5 py-3 bg-slate-600/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition ${
                  validationErrors.functionType
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#bfa544]/30 focus:ring-[#bfa544] focus:border-transparent'
                }`}
              >
                <option value="">Select event function</option>
                {hall?.eventTypes && hall.eventTypes.length > 0
                  ? hall.eventTypes.map(et => (
                      <option key={et._id} value={et.name}>{et.name}</option>
                    ))
                  : hall?.supportedFunctions && hall.supportedFunctions.map(func => (
                      <option key={func} value={func}>{func}</option>
                    ))
                }
              </select>
              {validationErrors.functionType && (
                <motion.p
                  className="text-red-400 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⚠️ {validationErrors.functionType}
                </motion.p>
              )}
            </motion.div>

            {/* Number of Guests */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-gray-200 mb-3">👥 Number of Guests *</label>
              <input
                type="number"
                name="guestCount"
                value={form.guestCount}
                onChange={handleChange}
                min="1"
                max={hall.capacity}
                className={`w-full px-5 py-3 bg-slate-600/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  validationErrors.guestCount
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#bfa544]/30 focus:ring-[#bfa544] focus:border-transparent'
                }`}
                placeholder="Enter number of guests"
              />
              <p className="text-sm text-gray-400 mt-2">Max capacity: <span className="text-[#bfa544] font-bold">{hall.capacity}</span> guests</p>
              {validationErrors.guestCount && (
                <motion.p
                  className="text-red-400 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⚠️ {validationErrors.guestCount}
                </motion.p>
              )}
            </motion.div>

            {/* Menu */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-gray-200 mb-3">🍽️ Select Menu *</label>
              <select
                name="menuId"
                value={form.menuId}
                onChange={handleChange}
                className={`w-full px-5 py-3 bg-slate-600/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition ${
                  validationErrors.menuId
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#bfa544]/30 focus:ring-[#bfa544] focus:border-transparent'
                }`}
              >
                <option value="">Select a menu</option>
                {menus.map(menu => (
                  <option key={menu._id} value={menu._id}>
                    {menu.name} - ₹{menu.pricePerPlate?.toLocaleString() || menu.price?.toLocaleString()} per plate
                  </option>
                ))}
              </select>
              {validationErrors.menuId && (
                <motion.p
                  className="text-red-400 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⚠️ {validationErrors.menuId}
                </motion.p>
              )}
            </motion.div>

            {/* Additional Notes */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              whileHover={{ y: -2 }}
            >
              <label className="block text-sm font-bold text-gray-200 mb-3">📝 Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-5 py-3 bg-slate-600/50 border border-[#bfa544]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition resize-none"
                placeholder="Any special requirements or requests..."
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                type="button"
                onClick={() => navigate(`/customer/halls/${hallId}`)}
                className="flex-1 px-6 py-4 border border-gray-500/30 text-gray-200 rounded-xl hover:bg-white/10 transition font-bold text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ← Back
              </motion.button>
              <motion.button
                type="submit"
                disabled={submitting}
                className={`flex-1 px-6 py-4 rounded-xl transition font-bold text-lg ${
                  submitting
                    ? 'bg-slate-600/50 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white hover:shadow-2xl'
                }`}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
              >
                {submitting ? '⏳ Processing...' : '✓ Confirm Booking'}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Booking Summary & Price Breakdown */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-8 bg-gradient-to-br from-slate-800/70 to-slate-700/70 backdrop-blur-xl rounded-2xl p-8 border border-[#bfa544]/30 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">📋 Summary</h3>
              
              <motion.div
                className="space-y-3 text-sm border-b border-white/10 pb-6 mb-6"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="visible"
              >
                {[
                  { label: 'Hall', value: hall.name },
                  { label: 'Date', value: form.date || '-' },
                  { label: 'Time', value: timeSlots.find(s => s._id === form.timeSlot) ? `${timeSlots.find(s => s._id === form.timeSlot).startTime} - ${timeSlots.find(s => s._id === form.timeSlot).endTime}` : '-' },
                  { label: 'Function', value: form.functionType || '-' },
                  { label: 'Guests', value: form.guestCount || '-' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex justify-between items-center"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <span className="text-gray-400">{item.label}:</span>
                    <span className="font-bold text-white">{item.value}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Price Breakdown */}
              {pricing ? (
                <motion.div
                  className="bg-gradient-to-br from-[#bfa544]/20 to-[#8b7a2a]/20 rounded-xl p-6 space-y-4 border border-[#bfa544]/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-bold text-[#ffd700] text-sm uppercase tracking-wider">💰 Price Breakdown</h4>
                  
                  <motion.div
                    className="space-y-2 text-sm"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      className="flex justify-between text-gray-300"
                      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    >
                      <span>Base Price:</span>
                      <span className="font-semibold">₹{pricing.basePrice?.toLocaleString()}</span>
                    </motion.div>
                    
                    {pricing.menuPrice > 0 && (
                      <motion.div
                        className="flex justify-between text-gray-300"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                      >
                        <span>Menu ({form.guestCount} guests):</span>
                        <span className="font-semibold">₹{pricing.menuPrice?.toLocaleString()}</span>
                      </motion.div>
                    )}
                    
                    {pricing.functionTypeCharge > 0 && (
                      <motion.div
                        className="flex justify-between text-gray-300"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                      >
                        <span>{form.functionType} Charge:</span>
                        <span className="font-semibold">₹{pricing.functionTypeCharge?.toLocaleString()}</span>
                      </motion.div>
                    )}
                    
                    {pricing.additionalCharges && pricing.additionalCharges.length > 0 && (
                      <>
                        {pricing.additionalCharges.map((charge, idx) => (
                          <motion.div
                            key={idx}
                            className="flex justify-between text-gray-300"
                            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                          >
                            <span>{charge.name}:</span>
                            <span className="font-semibold">₹{charge.price?.toLocaleString()}</span>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </motion.div>
                  
                  <motion.div
                    className="border-t border-[#bfa544]/50 pt-4 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between font-bold text-white text-lg">
                      <span>Total:</span>
                      <motion.span
                        className="text-[#ffd700]"
                        key={pricing.total}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        ₹{pricing.total?.toLocaleString()}
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="bg-white/5 rounded-xl p-6 text-center text-gray-400 text-sm border border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p>📊 Fill in all details to see pricing</p>
                </motion.div>
              )}

              {/* Help Text */}
              <motion.div
                className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-blue-200 leading-relaxed">
                  ℹ️ Your booking will be submitted for review and confirmed by the hall owner. Check back soon!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

