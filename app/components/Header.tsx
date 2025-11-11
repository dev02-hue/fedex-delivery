// components/Header/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiMenu } from 'react-icons/fi';
import { FaBox, FaShippingFast, FaGlobeAmericas, FaBusinessTime } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple navigation items without dropdowns
  const navItems = [
    { name: 'Ship', icon: FaShippingFast, href: '/ship' },
    { name: 'Track', icon: FaBox, href: '/tracking' },
    { name: 'Services', icon: FaGlobeAmericas, href: '/services' },
    { name: 'Business', icon: FaBusinessTime, href: '/business' },
    { name: 'Support', href: '/support' },
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      router.push(`/tracking?trackingNumber=${encodeURIComponent(trackingNumber)}`);
    } else {
      router.push('/tracking');
    }
  };

  const navigateTo = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-fedex-purple to-fedex-blue text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <span className="w-2 h-2 bg-fedex-orange rounded-full animate-pulse"></span>
            <span>Save up to 30% on international shipping</span>
          </motion.div>
          <motion.button
            onClick={() => navigateTo('/international')}
            className="font-medium hover:text-fedex-orange transition-colors underline"
            whileHover={{ scale: 1.05 }}
          >
            Learn more
          </motion.button>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' 
            : 'bg-white border-b border-gray-100'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo */}
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() => navigateTo('/')}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-9 h-9 bg-fedex-purple rounded-lg">
                  <span className="text-white font-bold text-sm">FX</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-fedex-purple leading-5">FedEx</span>
                  <span className="text-xs text-gray-500 font-medium">Express</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation - Simple Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => navigateTo(item.href)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm text-gray-700 hover:text-fedex-purple hover:bg-gray-50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </motion.button>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search Bar */}
              <form onSubmit={handleTrack} className="relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Track a package..."
                  className="w-72 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent text-sm bg-gray-50"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </form>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <motion.button
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => document.getElementById('mobile-search')?.focus()}
              >
                <FiSearch className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-200 shadow-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleTrack} className="relative mb-4">
                  <input
                    id="mobile-search"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Track a package..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fedex-purple bg-gray-50"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </form>

                {/* Mobile Navigation Items */}
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => navigateTo(item.href)}
                      className="flex items-center space-x-3 py-4 px-4 text-gray-700 hover:bg-fedex-purple hover:text-white rounded-lg transition-colors font-semibold border-b border-gray-100 w-full text-left"
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.name}</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}