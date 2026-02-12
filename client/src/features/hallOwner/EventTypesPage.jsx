import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import hallOwnerApi from '../../api/hallOwnerApi';
import { AlertCircle, Percent, Trash2, Plus } from 'lucide-react';

const EventTypesPage = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hallId: '',
    name: 'Mehndi',
    priceModifier: 15,
    description: ''
  });

  const eventTypeOptions = [
    { value: 'Mehndi', label: 'Mehndi' },
    { value: 'Baraat', label: 'Baraat' },
    { value: 'Waleema', label: 'Waleema' },
    { value: 'Birthday', label: 'Birthday' },
    { value: 'Engagement', label: 'Engagement' },
    { value: 'Reception', label: 'Reception' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [typesData, hallsData] = await Promise.all([
          hallOwnerApi.getEventTypes(),
          hallOwnerApi.getHalls()
        ]);
        console.log('EventTypes Response:', typesData);
        console.log('Halls Response:', hallsData);
        setEventTypes(typesData.eventTypes || typesData);
        setHalls(hallsData.halls || hallsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate hall is selected
      if (!formData.hallId) {
        setError('Please select a hall');
        return;
      }

      // Convert hallId to hall for API
      const submitData = {
        hall: formData.hallId,
        name: formData.name,
        priceModifier: formData.priceModifier,
        description: formData.description
      };

      if (formData.id) {
        const response = await hallOwnerApi.updateEventType(formData.id, submitData);
        const updatedEventType = response.eventType || response;
        setEventTypes((prev) =>
          prev.map((et) => (et._id === formData.id ? updatedEventType : et))
        );
      } else {
        const response = await hallOwnerApi.addEventType(submitData);
        const newEventType = response.eventType || response;
        setEventTypes((prev) => [...prev, newEventType]);
      }
      setShowForm(false);
      setFormData({ hallId: '', name: 'Mehndi', priceModifier: 15, description: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event type');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event type?')) return;
    try {
      await hallOwnerApi.deleteEventType(id);
      setEventTypes((prev) => prev.filter((et) => et._id !== id));
    } catch (err) {
      setError('Failed to delete event type');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#bfa544]/30 border-t-[#bfa544] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Types</span>
          </h1>
          <p className="text-xl text-gray-300">Manage pricing modifiers for different event types</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Add Event Type Button */}
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Add Event Type
        </motion.button>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-white/10 rounded-2xl p-6 mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Hall</label>
                  <select
                    value={formData.hallId}
                    onChange={(e) => setFormData({ ...formData, hallId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="">Select a hall</option>
                    {halls.map((hall) => (
                      <option key={hall._id} value={hall._id}>
                        {hall.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Event Type</label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    {eventTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Price Modifier (%)</label>
                <input
                  type="number"
                  value={formData.priceModifier}
                  onChange={(e) => setFormData({ ...formData, priceModifier: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  rows="3"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Event Types Grid */}
        {eventTypes.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-300 text-xl">No event types defined yet</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {eventTypes.map((et) => (
              <motion.div
                key={et._id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{et.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-lg">
                    <Percent size={16} className="text-amber-400" />
                    <span className="text-amber-400 font-bold">{et.priceModifier}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">{et.hall?.name || 'N/A'}</p>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{et.description}</p>
                <button
                  onClick={() => handleDelete(et._id)}
                  className="w-full py-2 px-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg font-semibold hover:bg-red-500/40 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventTypesPage;
