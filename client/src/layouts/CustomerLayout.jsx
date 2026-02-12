import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../hooks/useAuth';

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, getUser } = useAuthStore();
  const user = getUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/auth/login'); };

  const navItems = [
    { icon: '📊', label: 'Dashboard', path: '/customer/dashboard' },
    { icon: '🏘️', label: 'Search Halls', path: '/customer/halls' },
    { icon: '📋', label: 'My Bookings', path: '/customer/bookings' },
    { icon: '⭐', label: 'Reviews', path: '/customer/reviews' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header/Navbar */}
      <motion.header
        className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">💍 EventHub</h1>
          </motion.div>

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
                  className="px-4 py-2 rounded-lg text-gray-200 hover:bg-[#bfa544]/20 hover:text-[#ffd700] transition font-medium text-sm"
                >
                  {item.icon} {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Right side - User and Logout */}
          <div className="flex items-center gap-4 ml-auto">
            {user && (
              <motion.span
                className="text-sm text-gray-300 hidden sm:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                👤 <span className="font-semibold text-[#bfa544]">{user.name}</span>
              </motion.span>
            )}
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚪 Logout
            </motion.button>
            <motion.button
              className="md:hidden px-3 py-2 border border-white/20 rounded-lg text-gray-200 hover:bg-white/10 transition"
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
              className="md:hidden border-t border-white/10 bg-gradient-to-b from-slate-800/30 to-slate-900/30 px-4 py-3"
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
                      className="block px-4 py-3 rounded-lg text-gray-200 hover:bg-[#bfa544]/20 hover:text-[#ffd700] transition font-medium"
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
        className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border-t border-white/10 py-6 mt-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
          <p>© 2026 💍 EventHub. All rights reserved. | Making your special moments memorable</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default CustomerLayout;