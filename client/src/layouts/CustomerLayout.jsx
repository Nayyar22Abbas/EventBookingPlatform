import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../hooks/useAuth';

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, getUser } = useAuthStore();
  const user = getUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => { logout(); navigate('/auth/login'); };

  const navItems = [
    { icon: '📊', label: 'Dashboard', path: '/customer/dashboard' },
    { icon: '🏘️', label: 'Search Halls', path: '/customer/halls' },
    { icon: '📋', label: 'My Bookings', path: '/customer/bookings' },
    { icon: '⭐', label: 'Reviews', path: '/customer/reviews' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700]">
      {/* Header/Navbar */}
      <motion.header
        className="bg-white/60 backdrop-blur-md border-b border-[#bfa544]/20 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-extrabold text-[#7a2222]">EventHub</h1>
          </motion.button>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex gap-1 items-center"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link
                  to={item.path}
                  className="px-4 py-2 rounded-lg text-[#7a2222] hover:bg-[#bfa544]/15 transition font-medium text-sm"
                >
                  {item.icon} {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Right side - User and Logout */}
          <div className="flex items-center gap-4 ml-auto">
            {user && (
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
                          handleLogout();
                          setShowUserMenu(false);
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
            )}
            <motion.button
              className="md:hidden px-3 py-2 border border-[#bfa544]/30 rounded-lg text-[#7a2222] hover:bg-[#bfa544]/10 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ☰
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-[#bfa544]/20 bg-white/50 px-4 py-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <motion.nav
                className="space-y-2"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="visible"
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-[#7a2222] hover:bg-[#bfa544]/15 transition font-medium text-sm"
                    >
                      {item.icon} {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-white/60 backdrop-blur-md border-t border-[#bfa544]/20 py-6 mt-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-700">
          <p>© 2026 EventHub. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default CustomerLayout;