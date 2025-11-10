// components/Header/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronDown, FiX, FiMenu, FiHelpCircle } from 'react-icons/fi';
import { FaBox, FaShippingFast, FaGlobeAmericas, FaBusinessTime } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Ship', icon: FaShippingFast, dropdown: true, href: '/ship' },
    { name: 'Track', icon: FaBox, dropdown: false, href: '/tracking' },
    { name: 'Services', icon: FaGlobeAmericas, dropdown: true, href: '/services' },
    { name: 'Business', icon: FaBusinessTime, dropdown: true, href: '/business' },
    { name: 'Support', icon: FiHelpCircle, dropdown: true, href: '/support' },
  ];

  const dropdownContent = {
    Ship: [
      { name: 'Create a Shipment', desc: 'Ship packages domestically', href: '/ship' },
      { name: 'Schedule a Pickup', desc: 'Request package collection', href: '/pickup' },
      { name: 'Shipping Rates', desc: 'Calculate shipping costs', href: '/rates' },
      { name: 'Find Locations', desc: 'Find FedEx offices near you', href: '/locations' }
    ],
    Services: [
      { name: 'Freight Services', desc: 'Heavyweight freight solutions', href: '/services/freight' },
      { name: 'Supply Chain', desc: 'End-to-end logistics', href: '/services/supply-chain' },
      { name: 'Customs Clearance', desc: 'International trade support', href: '/services/customs' },
      { name: 'E-commerce', desc: 'Online business solutions', href: '/services/ecommerce' }
    ],
    Business: [
      { name: 'Business Solutions', desc: 'Tools for your business', href: '/business' },
      { name: 'Open an Account', desc: 'Start shipping with FedEx', href: '/open-account' },
      { name: 'Shipping Solutions', desc: 'Customized shipping plans', href: '/business/solutions' },
      { name: 'Industry Solutions', desc: 'Sector-specific services', href: '/business/industries' }
    ],
    Support: [
      { name: 'Contact Us', desc: 'Get in touch with support', href: '/contact' },
      { name: 'Help Center', desc: 'Find answers to questions', href: '/help' },
      { name: 'Shipping Solutions', desc: 'Troubleshoot issues', href: '/support/solutions' },
      { name: 'File a Claim', desc: 'Submit shipping claims', href: '/claims' }
    ],
  };

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
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-linear-to-r from-fedex-purple to-fedex-blue text-white text-sm py-2 px-4">
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

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative" onMouseLeave={() => setActiveDropdown(null)}>
                  {item.dropdown ? (
                    <>
                      <motion.button
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                          activeDropdown === item.name
                            ? 'text-fedex-purple bg-purple-50 border-b-2 border-fedex-purple'
                            : 'text-gray-700 hover:text-fedex-purple hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onMouseEnter={() => setActiveDropdown(item.name)}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.name}</span>
                        <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </motion.button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-4"
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                            transition={{ duration: 0.2, type: "spring" }}
                          >
                            {(dropdownContent[item.name as keyof typeof dropdownContent] || []).map((subItem, index) => (
                              <motion.button
                                key={subItem.name}
                                onClick={() => navigateTo(subItem.href)}
                                className="flex flex-col px-6 py-3 text-gray-700 hover:bg-fedex-purple hover:text-white transition-all group w-full text-left"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 5 }}
                              >
                                <span className="font-semibold group-hover:text-white">{subItem.name}</span>
                                <span className="text-sm text-gray-500 group-hover:text-white/90 mt-1">{subItem.desc}</span>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <motion.button
                      onClick={() => navigateTo(item.href)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                        activeDropdown === item.name
                          ? 'text-fedex-purple bg-purple-50 border-b-2 border-fedex-purple'
                          : 'text-gray-700 hover:text-fedex-purple hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </motion.button>
                  )}
                </div>
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