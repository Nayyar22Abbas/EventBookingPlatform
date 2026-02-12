import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hallOwnerApi from '../../api/hallOwnerApi';

const TimeSlotsPage = () => {
  const [slots, setSlots] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ hall: '', date: '', startTime: '', endTime: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slotsData = await hallOwnerApi.getTimeSlots();
        console.log('TimeSlots API Response:', slotsData);
        setSlots(slotsData.timeSlots || slotsData);
        
        const hallsData = await hallOwnerApi.getHalls();
        setHalls(hallsData.halls || hallsData);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setError(err.response?.data?.message || 'Failed to load time slots');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hall || !formData.date || !formData.startTime || !formData.endTime) {
      alert('Please fill all fields');
      return;
    }

    // Validate time order
    if (formData.startTime >= formData.endTime) {
      alert('End time must be after start time');
      return;
    }

    setSubmitting(true);
    try {
      await hallOwnerApi.createTimeSlot({
        hall: formData.hall,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      
      setFormData({ hall: '', date: '', startTime: '', endTime: '' });
      setShowModal(false);
      
      // Refresh slots
      const data = await hallOwnerApi.getTimeSlots();
      setSlots(data.timeSlots || data);
    } catch (err) {
      console.error('Error creating time slot:', err);
      alert(err.response?.data?.message || 'Failed to create time slot');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-[#bfa544]/30 border-t-[#bfa544] rounded-full" /></div>;
  if (error && slots.length === 0) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"><p className="text-red-400 text-xl">❌ {error}</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Slots</span></h1>
          <p className="text-xl text-gray-300">Manage your hall availability and booking times</p>
        </motion.div>
        {slots.length === 0 ? (
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-6xl mb-4">⏰</div>
            <p className="text-gray-300 text-xl">No time slots added yet</p>
            <motion.button onClick={() => setShowModal(true)} className="mt-4 px-8 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold hover:shadow-lg transition" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>➕ Add Time Slot</motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div className="space-y-4" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
              {slots.map((slot) => (
                <motion.div key={slot._id} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#bfa544]/50 transition" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -2 }}>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div><p className="text-sm text-gray-400 mb-1">Hall</p><p className="text-lg font-bold text-white">{slot.hall?.name}</p></div>
                    <div><p className="text-sm text-gray-400 mb-1">Date</p><p className="text-lg font-bold text-white">{new Date(slot.date).toLocaleDateString()}</p></div>
                    <div><p className="text-sm text-gray-400 mb-1">Start</p><p className="text-lg font-bold text-[#bfa544]">{slot.startTime}</p></div>
                    <div><p className="text-sm text-gray-400 mb-1">End</p><p className="text-lg font-bold text-[#ffd700]">{slot.endTime}</p></div>
                    <div className="flex gap-2 md:justify-end">
                      <motion.button className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-lg font-semibold hover:from-blue-500/40 hover:to-cyan-500/40 transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>✏️</motion.button>
                      <motion.button className="px-3 py-2 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-300 rounded-lg font-semibold hover:from-red-500/40 hover:to-rose-500/40 transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>🗑️</motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <motion.button onClick={() => setShowModal(true)} className="w-full py-4 px-6 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold border border-[#ffd700]/20 hover:shadow-lg transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>➕ Add Another Time Slot</motion.button>
            </motion.div>
          </>
        )}

        {/* Add Time Slot Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold text-white mb-6">Add Time Slot</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <select
                    value={formData.hall}
                    onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#bfa544]"
                  >
                    <option value="">Select a Hall</option>
                    {halls.map(hall => (
                      <option key={hall._id} value={hall._id}>{hall.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#bfa544]"
                  />
                  <input
                    type="time"
                    placeholder="Start Time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#bfa544]"
                  />
                  <input
                    type="time"
                    placeholder="End Time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#bfa544]"
                  />
                  <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setFormData({ hall: '', date: '', startTime: '', endTime: '' });
                      }}
                      className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      whileHover={{ scale: 1.05 }}
                      disabled={submitting}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-lg font-bold"
                      whileHover={{ scale: 1.05 }}
                      disabled={submitting}
                    >
                      {submitting ? 'Adding...' : 'Add Slot'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimeSlotsPage;
