import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hallOwnerApi from '../../api/hallOwnerApi';

const MenusPage = () => {
  const [menus, setMenus] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ hall: '', name: '', pricePerPlate: '', items: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menusData = await hallOwnerApi.getMenus();
        console.log('Menus API Response:', menusData);
        setMenus(menusData.menus || menusData);
        
        const hallsData = await hallOwnerApi.getHalls();
        setHalls(hallsData.halls || hallsData);
      } catch (err) {
        console.error('Error fetching menus:', err);
        setError(err.response?.data?.message || 'Failed to load menus');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hall || !formData.name || !formData.pricePerPlate) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const itemsArray = formData.items.split(',').map(item => item.trim()).filter(item => item);
      await hallOwnerApi.createMenu({
        hall: formData.hall,
        name: formData.name,
        pricePerPlate: parseFloat(formData.pricePerPlate),
        items: itemsArray
      });
      setFormData({ hall: '', name: '', pricePerPlate: '', items: '' });
      setShowModal(false);
      // Refresh menus
      const data = await hallOwnerApi.getMenus();
      setMenus(data.menus || data);
    } catch (err) {
      console.error('Error creating menu:', err);
      alert(err.response?.data?.message || 'Failed to create menu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-[#bfa544]/30 border-t-[#bfa544] rounded-full" /></div>;
  if (error && menus.length === 0) return <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] flex items-center justify-center"><p className="text-red-600 text-xl">❌ {error}</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#7a2222] mb-2">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Menus</span></h1>
          <p className="text-xl text-gray-700">Manage your catering menus and pricing</p>
        </motion.div>
        {menus.length === 0 ? (
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-700 text-xl">No menus added yet</p>
            <motion.button onClick={() => setShowModal(true)} className="mt-4 px-8 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-[#7a2222] rounded-xl font-bold hover:shadow-lg transition" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>➕ Add New Menu</motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
              {menus.map((menu) => (
                <motion.div key={menu._id} className="bg-gradient-to-br bg-white/80 backdrop-blur-xl border border-[#bfa544]/20 rounded-2xl p-6 hover:border-[#bfa544]/50 transition" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -5 }}>
                  <div className="text-4xl mb-3">🍽️</div>
                  <h3 className="text-xl font-bold text-[#7a2222] mb-2">{menu.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">📍 {menu.hallName}</p>
                  <p className="text-2xl font-bold text-[#bfa544] mb-4">₹{menu.pricePerPlate}/plate</p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{menu.items.join(', ')}</p>
                  <div className="flex gap-2">
                    <motion.button className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-lg font-semibold hover:from-blue-500/40 hover:to-cyan-500/40 transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>✏️ Edit</motion.button>
                    <motion.button className="flex-1 py-2 px-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-300 rounded-lg font-semibold hover:from-red-500/40 hover:to-rose-500/40 transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>🗑️ Delete</motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <motion.button onClick={() => setShowModal(true)} className="w-full py-4 px-6 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-[#7a2222] rounded-xl font-bold border border-[#ffd700]/20 hover:shadow-lg transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>➕ Add Another Menu</motion.button>
            </motion.div>
          </>
        )}

        {/* Add Menu Modal */}
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
                className="bg-gradient-to-br bg-white/90 rounded-2xl p-8 max-w-md w-full border border-[#bfa544]/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold text-[#7a2222] mb-6">Add New Menu</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <select
                    value={formData.hall}
                    onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-[#bfa544]/20 rounded-lg text-[#7a2222] focus:outline-none focus:border-[#bfa544]"
                  >
                    <option value="">Select a Hall</option>
                    {halls.map(hall => (
                      <option key={hall._id} value={hall._id}>{hall.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Menu Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-[#bfa544]/20 rounded-lg text-[#7a2222] placeholder-gray-400 focus:outline-none focus:border-[#bfa544]"
                  />
                  <input
                    type="number"
                    placeholder="Price Per Plate (₹)"
                    value={formData.pricePerPlate}
                    onChange={(e) => setFormData({ ...formData, pricePerPlate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-[#bfa544]/20 rounded-lg text-[#7a2222] placeholder-gray-400 focus:outline-none focus:border-[#bfa544]"
                  />
                  <textarea
                    placeholder="Items (comma separated)"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-[#bfa544]/20 rounded-lg text-[#7a2222] placeholder-gray-400 focus:outline-none focus:border-[#bfa544]"
                  />
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2 px-4 bg-gray-700 text-[#7a2222] rounded-lg hover:bg-gray-600"
                      whileHover={{ scale: 1.05 }}
                      disabled={submitting}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-[#7a2222] rounded-lg font-bold"
                      whileHover={{ scale: 1.05 }}
                      disabled={submitting}
                    >
                      {submitting ? 'Adding...' : 'Add Menu'}
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

export default MenusPage;

