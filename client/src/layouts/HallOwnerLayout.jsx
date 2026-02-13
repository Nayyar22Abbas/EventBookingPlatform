import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../hooks/useAuth';

const HallOwnerLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { logout, getUser } = useAuthStore();
  const user = getUser();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => { logout(); navigate('/auth/login'); };

  const menuItems = [
    { text: 'Dashboard', path: '/hall-owner/dashboard' },
    { text: 'Halls', path: '/hall-owner/halls' },
    { text: 'Menus', path: '/hall-owner/menus' },
    { text: 'Event Types', path: '/hall-owner/event-types' },
    { text: 'Time Slots', path: '/hall-owner/time-slots' },
    { text: 'Bookings', path: '/hall-owner/bookings' },
    { text: 'Add-Ons', path: '/hall-owner/add-ons' }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700]">
      {/* Desktop Sidebar */}
      <motion.aside
        className="bg-white/70 backdrop-blur-md border-r border-[#bfa544]/20 w-64 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-extrabold text-[#7a2222]">Owner Panel</h1>
        </motion.div>
        <motion.nav
          className="space-y-3"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.text}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <Link
                to={item.path}
                className="block px-4 py-2.5 rounded-lg text-[#7a2222] hover:bg-[#bfa544]/15 transition font-medium border border-[#bfa544]/10 hover:border-[#bfa544]/40 text-sm"
              >
                {item.text}
              </Link>
            </motion.div>
          ))}
          <motion.button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-100/50 transition font-medium border border-red-200/50 hover:border-red-400/50 mt-4 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            🚪 Logout
          </motion.button>
        </motion.nav>
      </motion.aside>

      {/* Mobile sidebar (toggle) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDrawerToggle}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-white/90 backdrop-blur-md w-64 h-full p-6 border-r border-[#bfa544]/20"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-2xl font-extrabold text-[#7a2222]">Owner</h1>
              </motion.div>
              <motion.nav
                className="space-y-2"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="visible"
              >
                {menuItems.map((item) => (
                  <motion.div key={item.text} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-[#7a2222] hover:bg-[#bfa544]/15 transition font-medium text-sm"
                    >
                      {item.text}
                    </Link>
                  </motion.div>
                ))}
                <motion.button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-100/50 transition font-medium mt-4 text-sm"
                  variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                >
                  🚪 Logout
                </motion.button>
              </motion.nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
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
              Menu
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              className="text-xl font-bold text-[#7a2222] hover:opacity-80 transition"
              whileHover={{ scale: 1.05 }}
            >
              EventHub
            </motion.button>
          </div>
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
        </motion.header>

        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-[#FFF8DC]/50 via-transparent to-[#FFD700]/20">
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

export default HallOwnerLayout;