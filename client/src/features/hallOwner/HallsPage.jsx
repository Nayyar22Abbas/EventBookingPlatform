import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hallOwnerApi from '../../api/hallOwnerApi';

const HallsPage = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', city: '', capacity: '', basePrice: '' });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const data = await hallOwnerApi.getHalls();
        console.log('Halls API Response:', data);
        setHalls(data.halls || data);
      } catch (err) {
        console.error('Error fetching halls:', err);
        setError(err.response?.data?.message || 'Failed to load halls');
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImagePreview = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.city || !formData.capacity || !formData.basePrice) {
      alert('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedImages = [];
      
      // Upload images if selected
      if (selectedImages.length > 0) {
        const uploadRes = await hallOwnerApi.uploadImages(selectedImages);
        uploadedImages = uploadRes.images || [];
      }

      // Create hall with images
      await hallOwnerApi.createHall({
        ...formData,
        images: uploadedImages
      });
      
      setFormData({ name: '', address: '', city: '', capacity: '', basePrice: '' });
      setSelectedImages([]);
      setImagePreviews([]);
      setShowModal(false);
      
      // Refresh halls
      const data = await hallOwnerApi.getHalls();
      setHalls(data.halls || data);
    } catch (err) {
      console.error('Error creating hall:', err);
      alert(err.response?.data?.message || 'Failed to create hall');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-[#bfa544]/30 border-t-[#bfa544] rounded-full" />
      </div>
    );
  }

  if (error && halls.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-red-400 text-xl">❌ {error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Halls</span>
          </h1>
          <p className="text-xl text-gray-300">Manage your event venues and listings</p>
        </motion.div>

        {/* Empty State */}
        {halls.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🏛️</div>
            <p className="text-gray-300 text-xl">No halls added yet</p>
            <p className="text-gray-400 mb-6">Get started by adding your first event hall</p>
            <motion.button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ➕ Add New Hall
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {halls.map((hall) => (
              <motion.div
                key={hall._id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#bfa544]/50 transition group"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5 }}
              >
                {/* Hall Image Gallery */}
                <div className="relative w-full h-48 bg-gradient-to-br from-[#bfa544]/20 to-[#7a2222]/20 border-b border-white/10 overflow-hidden">
                  {hall.images && hall.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      <div className="flex items-center justify-center w-full h-full">
                        <motion.img
                          src={`http://localhost:5000${hall.images[0]}`}
                          alt={hall.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      {hall.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/70 px-3 py-1 rounded-full text-sm text-white">
                          +{hall.images.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-5xl">🏛️</span>
                        <p className="text-gray-400 text-sm mt-2">No images</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hall Info */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-white truncate">{hall.name}</h3>
                  
                  <p className="text-sm text-gray-400 line-clamp-2">{hall.address}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/10">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#bfa544]">{hall.capacity}</p>
                      <p className="text-xs text-gray-400">Capacity</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#ffd700]">₹{hall.basePrice}</p>
                      <p className="text-xs text-gray-400">Base Price</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <motion.button
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-lg font-semibold hover:from-blue-500/40 hover:to-cyan-500/40 transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ✏️ Edit
                    </motion.button>
                    <motion.button
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-300 rounded-lg font-semibold hover:from-red-500/40 hover:to-rose-500/40 transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🗑️ Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Add Hall Button (if halls exist) */}
        {halls.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => setShowModal(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold border border-[#ffd700]/20 hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ➕ Add Another Hall
            </motion.button>
          </motion.div>
        )}

        {/* Add Hall Modal */}
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
                <h2 className="text-3xl font-bold text-white mb-6">Add New Hall</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Hall Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#bfa544]"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#bfa544]"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#bfa544]"
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#bfa544]"
                  />
                  <input
                    type="number"
                    placeholder="Base Price (₹)"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#bfa544]"
                  />

                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-[#bfa544]/50 rounded-lg p-4">
                    <label className="cursor-pointer">
                      <div className="text-center">
                        <p className="text-[#bfa544] font-semibold">📸 Click to upload images</p>
                        <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-white font-semibold">Selected Images ({imagePreviews.length})</p>
                      <div className="grid grid-cols-3 gap-2">
                        {imagePreviews.map((preview, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${idx}`}
                              className="w-full h-20 object-cover rounded-lg border border-white/10"
                            />
                            <motion.button
                              type="button"
                              onClick={() => removeImagePreview(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              ✕
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedImages([]);
                        setImagePreviews([]);
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
                      {submitting ? 'Adding...' : 'Add Hall'}
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

export default HallsPage;
