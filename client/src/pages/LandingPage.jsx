import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticlesBackground from '../components/ParticlesBackground';

// SVG paisley/floral motif for subtle section backgrounds
const PaisleySVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full z-0"
  >
    <circle cx="200" cy="200" r="180" fill="#FFF8DC" opacity="0.15" />
    <ellipse cx="120" cy="120" rx="40" ry="20" fill="#FFD700" opacity="0.12" />
    <ellipse cx="300" cy="300" rx="30" ry="15" fill="#50C878" opacity="0.12" />
    <ellipse cx="320" cy="80" rx="25" ry="12" fill="#FF1493" opacity="0.10" />
    <ellipse cx="80" cy="320" rx="20" ry="10" fill="#4169E1" opacity="0.10" />
    <ellipse cx="200" cy="350" rx="60" ry="20" fill="#8B0000" opacity="0.08" />
  </svg>
);

const features = [
  {
    title: 'Instant Booking',
    desc: 'Book venues in real-time with instant confirmation and transparent pricing.',
    icon: '📅',
    bg: 'bg-white',
  },
  {
    title: 'Smart Search',
    desc: 'Find the perfect hall with advanced filters, reviews, and AI-powered recommendations.',
    icon: '🔍',
    bg: 'bg-gray-50',
  },
  {
    title: 'Owner Dashboard',
    desc: 'Manage your listings, bookings, and payments with a powerful, intuitive dashboard.',
    icon: '🏢',
    bg: 'bg-white',
  },
  {
    title: 'Secure Payments',
    desc: 'All transactions are encrypted and protected for your peace of mind.',
    icon: '💳',
    bg: 'bg-gray-50',
  },
  {
    title: '24/7 Support',
    desc: 'Get help anytime from our expert team, via chat, email, or phone.',
    icon: '🛎️',
    bg: 'bg-white',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] flex flex-col relative overflow-x-hidden overflow-y-auto">
      <ParticlesBackground />
      <PaisleySVG />

      {/* NAVBAR */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-30 bg-white/90 border-b border-[#bfa544] flex items-center justify-between px-8 py-4 shadow-sm"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#7a2222] tracking-tight">EventBook</span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <motion.button
            className="px-5 py-2 bg-white text-[#7a2222] font-semibold rounded-full shadow hover:bg-[#bfa544] hover:text-white transition border border-[#bfa544]"
            whileHover={{ scale: 1.07 }}
            onClick={() => navigate('/customer/halls')}
          >
            Browse Halls
          </motion.button>
          <motion.button
            className="px-5 py-2 bg-[#7a2222] text-white font-semibold rounded-full shadow hover:bg-[#bfa544] hover:text-white transition border border-[#7a2222]"
            whileHover={{ scale: 1.07 }}
            onClick={() => navigate('/auth/login')}
          >
            Login
          </motion.button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <motion.section
    className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative z-10 py-16 pt-32 overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #fffbe6 0%, #f7ecd0 100%)' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Animated gradient orbs in background */}
    <motion.div
      className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-[#bfa544]/10 to-[#7a2222]/5 rounded-full filter blur-3xl"
      animate={{ 
        x: [0, 50, -30, 20, 0],
        y: [0, -50, 30, -20, 0],
        scale: [1, 1.1, 0.95, 1.05, 1]
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-tl from-[#ffd700]/10 to-[#bfa544]/5 rounded-full filter blur-3xl"
      animate={{ 
        x: [0, -50, 30, -20, 0],
        y: [0, 50, -30, 20, 0],
        scale: [1, 0.95, 1.1, 1.05, 1]
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />

    <div className="w-full flex flex-col items-center justify-center relative z-20">
      {/* Floating elements */}
      <motion.div
        className="absolute -top-32 left-10 text-6xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        💍
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-[#7a2222] mb-6 tracking-tight"
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        Plan. <motion.span
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfa544] to-[#ffd700]"
          animate={{ textShadow: ['0px 0px 0px rgba(191, 165, 68, 0.5)', '0px 0px 20px rgba(191, 165, 68, 0.8)', '0px 0px 0px rgba(191, 165, 68, 0.5)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Book.
        </motion.span> <span className="text-[#7a2222]">Celebrate.</span>
      </motion.h1>
      
      <motion.p
        className="mt-4 text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
      >
        The future of <motion.span
          className="text-[#bfa544] font-semibold inline-block"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          event booking
        </motion.span> is here.
      </motion.p>

      {/* Animated button group */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.button
          className="px-10 py-4 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition border border-[#ffd700]/30 relative overflow-hidden group"
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/customer/halls')}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#ffd700] to-[#bfa544] opacity-0 group-hover:opacity-20 transition"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="relative">🎯 Book a Hall Now</span>
        </motion.button>

        <motion.button
          className="px-10 py-4 bg-[#7a2222] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition border border-[#bfa544]/30 relative overflow-hidden group"
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/auth/register?role=hall_owner')}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#bfa544] to-[#8b7a2a] opacity-0 group-hover:opacity-20 transition"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <span className="relative">🏛️ Add Your Hall</span>
        </motion.button>
      </motion.div>

      {/* Floating stat cards */}
      <motion.div
        className="flex flex-col gap-4 md:flex-row md:gap-6 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { number: '500+', label: 'Venues' },
          { number: '10K+', label: 'Happy Customers' },
          { number: '99.9%', label: 'Success Rate' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#bfa544]/20 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.3 }}
          >
            <p className="text-2xl md:text-3xl font-bold text-[#bfa544]">{stat.number}</p>
            <p className="text-sm text-gray-700 font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
    </motion.section>

      {/* FEATURE CARDS */}
      <motion.section
        className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 py-16 mt-12"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className={`rounded-2xl shadow p-8 flex flex-col items-center border border-gray-200 hover:shadow-lg transition text-[#7a2222] ${f.bg}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.7 }}
          >
            <span className="text-4xl mb-4">{f.icon}</span>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-700 text-center">{f.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ABOUT & CONTACT */}
      <motion.section
        className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center px-4 py-16 mt-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-2xl font-bold mb-2 text-blue-800">About Us</h3>
          <p className="text-gray-700 mb-4">
            We are dedicated to making event planning seamless for everyone. Whether you are looking to host a wedding, conference, or party, our platform connects you with the perfect venue and provides all the tools you need to manage your event.
          </p>
        </div>
        <div className="flex-1 flex gap-4 justify-center">
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-blue-100 p-2 flex items-center justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <img src="/about1.jpg" alt="About 1" className="w-48 h-48 object-cover rounded-xl shadow" />
          </motion.div>
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-blue-100 p-2 flex items-center justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <img src="/about2.jpg" alt="About 2" className="w-48 h-48 object-cover rounded-xl shadow" />
          </motion.div>
        </div>
      </motion.section>

      
      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-600 bg-white border-t relative z-10 flex flex-col items-center gap-4">
        <div className="flex gap-6 mb-2">
          <a href="mailto:support@eventbooking.com" className="text-blue-700 hover:underline font-semibold">support@eventbooking.com</a>
          <span>|</span>
          <span className="font-semibold">+1 234 567 8900</span>
        </div>
        <div className="flex gap-4 justify-center mb-2">
          <a href="#" className="hover:text-blue-700">
            <svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
          </a>
          <a href="#" className="hover:text-blue-700">
            <svg width="24" height="24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="4" /></svg>
          </a>
          <a href="#" className="hover:text-blue-700">
            <svg width="24" height="24" fill="currentColor"><polygon points="12,2 22,22 2,22" /></svg>
          </a>
        </div>
        <div className="flex gap-6 justify-center mb-2">
          <a href="#" className="hover:text-blue-700">Privacy Policy</a>
          <a href="#" className="hover:text-blue-700">Terms of Service</a>
        </div>
        <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Event Booking Platform. All rights reserved.</div>
      </footer>
    </div>
  );
}
