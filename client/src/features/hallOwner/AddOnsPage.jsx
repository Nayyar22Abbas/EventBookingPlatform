import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hallOwnerApi from '../../api/hallOwnerApi';
import { AlertCircle, Trash2, Plus, Edit2 } from 'lucide-react';

const AddOnsPage = () => {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Other'
  });

  const categories = [
    'Entertainment',
    'Catering',
    'Photography',
    'Decoration',
    'Lighting',
    'Transportation',
    'Staff',
    'Other'
  ];

  // Fetch add-ons
  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await hallOwnerApi.getAddOns();
      setAddOns(data.addOns || []);
    } catch (err) {
      console.error('Error fetching add-ons:', err);
      setError(err.response?.data?.message || 'Failed to load add-ons');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: 'Other' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addOn) => {
    setFormData({
      name: addOn.name,
      description: addOn.description || '',
      price: addOn.price,
      category: addOn.category
    });
    setEditingId(addOn._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingId) {
        const result = await hallOwnerApi.updateAddOn(editingId, submitData);
        setAddOns((prev) =>
          prev.map((ao) => (ao._id === editingId ? result.addOn : ao))
        );
      } else {
        const result = await hallOwnerApi.addAddOn(submitData);
        setAddOns((prev) => [...prev, result.addOn]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save add-on');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this add-on?')) return;
    try {
      await hallOwnerApi.deleteAddOn(id);
      setAddOns((prev) => prev.filter((ao) => ao._id !== id));
    } catch (err) {
      setError('Failed to delete add-on');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#bfa544]/30 border-t-[#bfa544] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#7a2222] mb-2">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Add-ons</span>
          </h1>
          <p className="text-xl text-gray-700">Manage paid services and extras for your events</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Add Add-On Button */}
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-[#7a2222] rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Add New Add-On
        </motion.button>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-[#bfa544]/20 rounded-2xl p-6 mb-8"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Add-On Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., DJ Service, Fireworks"
                      className="w-full px-4 py-2 bg-slate-700 border border-[#bfa544]/20 rounded-lg text-[#7a2222] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-[#bfa544]/20 rounded-lg text-[#7a2222] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 bg-slate-700 border border-[#bfa544]/20 rounded-lg text-[#7a2222] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this add-on service..."
                    className="w-full px-4 py-2 bg-slate-700 border border-[#bfa544]/20 rounded-lg text-[#7a2222] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    rows="3"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-[#7a2222] rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    {editingId ? 'Update' : 'Create'} Add-On
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 bg-gray-700 text-[#7a2222] rounded-lg font-semibold hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add-Ons Grid */}
        {addOns.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-700 text-xl">No add-ons created yet</p>
            <p className="text-gray-600 mb-6">Create premium add-ons like DJ, photographer, or fireworks to increase your revenue</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {addOns.map((addOn) => (
              <motion.div
                key={addOn._id}
                className="bg-gradient-to-br bg-white/80 backdrop-blur-xl border border-[#bfa544]/20 rounded-2xl p-6 hover:border-[#bfa544]/50 transition"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5 }}
              >
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-full">
                    {addOn.category}
                  </span>
                </div>

                {/* Add-On Info */}
                <h3 className="text-xl font-bold text-[#7a2222] mb-2">{addOn.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{addOn.description || 'No description'}</p>

                {/* Price */}
                <div className="mb-4 p-3 bg-gradient-to-r from-[#bfa544]/20 to-[#ffd700]/20 rounded-lg border border-[#bfa544]/30">
                  <p className="text-xs text-gray-600">Price</p>
                  <p className="text-2xl font-bold text-[#ffd700]">Rs. {addOn.price.toLocaleString('en-PK')}</p>
                </div>

                {/* Availability Status */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      addOn.available
                        ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                        : 'bg-red-500/20 border border-red-500/30 text-red-300'
                    }`}
                  >
                    {addOn.available ? '🟢 Available' : '🔴 Unavailable'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(addOn)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-lg font-semibold hover:from-blue-500/40 hover:to-cyan-500/40 transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addOn._id)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-300 rounded-lg font-semibold hover:from-red-500/40 hover:to-rose-500/40 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddOnsPage;

