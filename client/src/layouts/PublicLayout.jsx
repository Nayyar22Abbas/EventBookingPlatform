import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../hooks/useAuth';

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, getUser, logout } = useAuthStore();
  const user = getUser();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700]">
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Header/Navigation */}
      <motion.header
        className="bg-white/60 backdrop-blur-md border-b border-[#bfa544]/20 px-6 py-4 flex items-center justify-between sticky top-0 z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.button
            className="md:hidden px-3 py-2 border border-[#bfa544]/30 rounded-lg text-[#7a2222] hover:bg-[#bfa544]/10 transition text-sm font-medium"
            onClick={handleDrawerToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ☰ Menu
          </motion.button>
          <motion.button 
            onClick={() => navigate('/')} 
            className="text-xl font-bold text-[#7a2222] hover:opacity-80 transition"
            whileHover={{ scale: 1.05 }}
          >
            EventHub
          </motion.button>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-[#bfa544] hover:bg-[#bfa544]/10 transition"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bfa544] to-[#7a2222] flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-[#7a2222] font-semibold hidden sm:inline text-sm">{user.name?.split(' ')[0]}</span>
              </motion.button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 top-12 w-48 bg-white/95 backdrop-blur-md border border-[#bfa544]/20 rounded-xl shadow-xl z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 border-b border-[#bfa544]/10">
                      <p className="text-[#7a2222] font-bold text-sm">{user.name}</p>
                      <p className="text-gray-600 text-xs">{user.email}</p>
                    </div>
                    <motion.button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition font-semibold text-sm"
                      whileHover={{ x: 5 }}
                    >
                      🚪 Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button 
              onClick={() => navigate('/auth/login')} 
              className="px-4 py-2 text-[#7a2222] border-2 border-[#FFD700] rounded-lg font-bold flex items-center gap-2 hover:bg-[#FFD700]/10 transition"
              whileHover={{ scale: 1.05 }}
            >
              🔐 Login
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;
