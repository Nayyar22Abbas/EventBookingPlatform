import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import customerApi from '../../api/customerApi';

const SearchHallsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    city: '',
    capacity: '',
    price: '',
    functionType: '',
    date: '',
    amenities: ''
  });
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(true);

  useEffect(() => {
    // Load all halls by default on mount
    loadAllHalls();
    
    // If there's a search query in URL params, apply that filter
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, city: searchQuery }));
      handleSearch({ city: searchQuery });
    }
  }, []);

  const loadAllHalls = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerApi.searchHalls({});
      setHalls(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load halls');
      setHalls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filtersToUse = filters) => {
    try {
      setLoading(true);
      setError('');
      const data = await customerApi.searchHalls(filtersToUse);
      setHalls(data || []);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || 'Failed to search halls');
      setHalls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    handleSearch();
  };

  const handleReset = () => {
    setFilters({
      city: '',
      capacity: '',
      price: '',
      functionType: '',
      date: '',
      amenities: ''
    });
    loadAllHalls();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-extrabold text-white mb-3">
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">Venue</span>
          </h1>
          <p className="text-xl text-gray-300">Search and filter from thousands of event halls</p>
        </motion.div>

        {/* Filters Section - Compact */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-xl shadow-lg p-4 mb-8 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-white mb-4">🔍 Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
            {/* City */}
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">📍 City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm bg-slate-600/50 border border-[#bfa544]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
                placeholder="City"
              />
            </div>
            {/* Capacity */}
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">👥 Capacity</label>
              <input
                type="number"
                name="capacity"
                value={filters.capacity}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm bg-slate-600/50 border border-[#bfa544]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
                placeholder="Guests"
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">💰 Max Price</label>
              <input
                type="number"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm bg-slate-600/50 border border-[#bfa544]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
                placeholder="₹"
              />
            </div>
            {/* Event Function */}
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">🎉 Event Type</label>
              <select
                name="functionType"
                value={filters.functionType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm bg-slate-600/50 border border-[#bfa544]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
              >
                <option value="">All Types</option>
                <option value="Mehndi">💄 Mehndi</option>
                <option value="Baraat">🎺 Baraat</option>
                <option value="Waleema">🍽️ Waleema</option>
                <option value="Birthday">🎂 Birthday</option>
                <option value="Engagement">💍 Engagement</option>
              </select>
            </div>
            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">📅 Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm bg-slate-600/50 border border-[#bfa544]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
              />
            </div>
            {/* Amenities */}
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">✨ Amenities</label>
              <input
                type="text"
                name="amenities"
                value={filters.amenities}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm bg-slate-600/50 border border-[#bfa544]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa544] focus:border-transparent transition"
                placeholder="parking, wifi..."
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.button
              onClick={handleSearchClick}
              className="px-6 py-2 text-sm bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-lg hover:shadow-lg transition font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              🔍 Search
            </motion.button>
            <motion.button
              onClick={handleReset}
              className="px-6 py-2 text-sm bg-slate-600/50 text-gray-200 rounded-lg hover:bg-slate-600 transition font-bold border border-gray-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              ↺ Reset
            </motion.button>
          </div>
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

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="relative w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#bfa544] border-r-[#bfa544]"></div>
            </motion.div>
          </motion.div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <>
            <motion.div
              className="mb-6 text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found <span className="font-bold text-[#bfa544]">{halls.length}</span> halls
            </motion.div>

            {halls.length === 0 ? (
              <motion.div
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl shadow-xl p-12 text-center border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-gray-400 text-lg">💭 No halls found matching your criteria. Try adjusting your filters.</p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {halls.map(hall => (
                  <motion.div
                    key={hall._id}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition border border-white/10 group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/customer/halls/${hall._id}`)}
                  >
                    {/* Hall Image - Airbnb Style Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#bfa544]/20 to-[#7a2222]/20">
                      {hall.images && hall.images.length > 0 ? (
                        <>
                          <motion.img
                            src={`http://localhost:5000${hall.images[0]}`}
                            alt={hall.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            whileHover={{ scale: 1.05 }}
                          />
                          {hall.images.length > 1 && (
                            <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-full text-sm text-white">
                              +{hall.images.length - 1}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-5xl">🏛️</span>
                            <p className="text-gray-400 text-sm mt-2">No image</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    
                    {/* Hall Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{hall.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{hall.address}</p>
                      
                      <div className="space-y-3 mb-6 text-sm text-gray-300 border-t border-white/10 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">👥 Capacity:</span>
                          <span className="font-semibold text-white">{hall.capacity} guests</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">💰 Base Price:</span>
                          <span className="font-bold text-[#bfa544]">₹{hall.basePrice?.toLocaleString()}</span>
                        </div>
                      </div>

                      {hall.amenities && hall.amenities.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs text-gray-400 mb-3">✨ Amenities:</p>
                          <div className="flex flex-wrap gap-2">
                            {hall.amenities.slice(0, 3).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-[#bfa544]/20 text-[#ffd700] text-xs rounded-full border border-[#bfa544]/30"
                              >
                                {amenity}
                              </span>
                            ))}
                            {hall.amenities.length > 3 && (
                              <span className="px-3 py-1 text-gray-400 text-xs">
                                +{hall.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customer/halls/${hall._id}`);
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl hover:shadow-lg transition font-bold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Details →
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {!loading && !hasSearched && (
          <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl shadow-xl p-12 text-center border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-lg">👆 Use the filters above to search for venues</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchHallsPage;
