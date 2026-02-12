import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => { logout(); navigate('/auth/login'); };

  const menuItems = [
    { text: 'Dashboard', path: '/admin/dashboard' },
    { text: 'Pending Hall Owners', path: '/admin/pending-hall-owners' },
    { text: 'Enquiries', path: '/admin/enquiries' },
    { text: 'Halls', path: '/admin/halls' }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Desktop Sidebar */}
      <motion.aside
        className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-r border-white/10 w-64 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto"
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
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">⚙️ Admin Panel</h1>
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
                className="block px-4 py-3 rounded-lg text-gray-200 hover:bg-[#bfa544]/20 hover:text-[#ffd700] transition font-medium border border-white/5 hover:border-[#bfa544]/50"
              >
                {item.text}
              </Link>
            </motion.div>
          ))}
          <motion.button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 transition font-medium border border-white/5 hover:border-red-500/50 mt-4"
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
              className="relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl w-64 h-full p-6 border-r border-white/10"
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
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]">⚙️ Admin</h1>
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
                      className="block px-4 py-3 rounded-lg text-gray-200 hover:bg-[#bfa544]/20 hover:text-[#ffd700] transition font-medium"
                    >
                      {item.text}
                    </Link>
                  </motion.div>
                ))}
                <motion.button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 transition font-medium mt-4"
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
          className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              className="md:hidden px-3 py-2 border border-white/20 rounded-lg text-gray-200 hover:bg-white/10 transition"
              onClick={handleDrawerToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ☰ Menu
            </motion.button>
            <h2 className="text-xl font-bold text-white hidden sm:block">📊 Admin Dashboard</h2>
          </div>
        </motion.header>

        <main className="flex-1 p-6 overflow-y-auto">
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

export default AdminLayout;