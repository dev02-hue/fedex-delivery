// components/Footer/Footer.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiGlobe,
  FiDownload,
  FiArrowUp
} from 'react-icons/fi';

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position for back-to-top button
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowScrollTop(window.scrollY > 500);
    });
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const footerSections = [
    {
      title: 'Shipping',
      links: [
        { name: 'Create a Shipment', url: '/ship' },
        { name: 'Schedule a Pickup', url: '/pickup' },
        { name: 'Shipping Rates', url: '/rates' },
        { name: 'Drop Off Locations', url: '/locations' },
        { name: 'International Shipping', url: '/international' },
        { name: 'Freight Services', url: '/freight' }
      ]
    },
    {
      title: 'Tracking',
      links: [
        { name: 'Track a Package', url: '/tracking' },
        { name: 'Tracking Support', url: '/tracking-support' },
        { name: 'Manage Delivery', url: '/manage-delivery' },
        { name: 'Signature Options', url: '/signature' },
        { name: 'Tracking API', url: '/tracking-api' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Customer Support', url: '/support' },
        { name: 'Help & Contact', url: '/contact' },
        { name: 'Shipping Solutions', url: '/solutions' },
        { name: 'File a Claim', url: '/claims' },
        { name: 'Service Alerts', url: '/alerts' },
        { name: 'Accessibility', url: '/accessibility' }
      ]
    },
    {
      title: 'Business',
      links: [
        { name: 'Business Solutions', url: '/business' },
        { name: 'Open an Account', url: '/open-account' },
        { name: 'Shipping for Business', url: '/business-shipping' },
        { name: 'Industry Solutions', url: '/industries' },
        { name: 'Partner Program', url: '/partners' },
        { name: 'Developer Portal', url: '/developers' }
      ]
    },
    {
      title: 'About FedEx',
      links: [
        { name: 'Our Company', url: '/about' },
        { name: 'Careers', url: '/careers' },
        { name: 'Investors', url: '/investors' },
        { name: 'Newsroom', url: '/news' },
        { name: 'Corporate Responsibility', url: '/responsibility' },
        { name: 'Diversity & Inclusion', url: '/diversity' }
      ]
    }
  ];

  const toolsResources = [
    {
      title: 'Shipping Tools',
      items: [
        { name: 'Rate Calculator', icon: FiDownload, url: '/tools/rates' },
        { name: 'Time-in-Transit', icon: FiDownload, url: '/tools/transit' },
        { name: 'Location Finder', icon: FiDownload, url: '/tools/locations' },
        { name: 'Address Validation', icon: FiDownload, url: '/tools/address' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { name: 'Shipping Guides', icon: FiDownload, url: '/resources/guides' },
        { name: 'Forms & Documents', icon: FiDownload, url: '/resources/forms' },
        { name: 'Mobile Apps', icon: FiDownload, url: '/mobile' },
        { name: 'FedEx API', icon: FiDownload, url: '/api' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FiFacebook, url: 'https://facebook.com/fedex' },
    { name: 'Twitter', icon: FiTwitter, url: 'https://twitter.com/fedex' },
    { name: 'Instagram', icon: FiInstagram, url: 'https://instagram.com/fedex' },
    { name: 'LinkedIn', icon: FiLinkedin, url: 'https://linkedin.com/company/fedex' },
    { name: 'YouTube', icon: FiYoutube, url: 'https://youtube.com/fedex' }
  ];

  const contactInfo = [
    { icon: FiPhone, text: '1.800.GoFedEx', subtext: '(1.800.463.3339)' },
    { icon: FiMail, text: 'Customer Support', subtext: '24/7 Online Help' },
    { icon: FiMapPin, text: 'Find Locations', subtext: 'Drop-off Points' }
  ];

  const legalLinks = [
    { name: 'Terms of Use', url: '/terms' },
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Security', url: '/security' },
    { name: 'Sitemap', url: '/sitemap' },
    { name: 'Cookie Preferences', url: '/cookies' }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-fedex-purple to-fedex-blue"></div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-fedex-purple rounded-full shadow-2xl flex items-center justify-center hover:bg-purple-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiArrowUp className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          {/* Top Section - Links & Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-fedex-purple rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">FX</span>
                </div>
                <div>
                  <span className="text-2xl font-bold">FedEx</span>
                  <div className="text-fedex-orange text-sm font-semibold">Express</div>
                </div>
              </div>

              <p className="text-gray-400 mb-6 leading-relaxed">
                Delivering possibilities worldwide with reliable shipping, logistics, 
                and business solutions for over 50 years.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={contact.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <contact.icon className="w-5 h-5 text-fedex-orange  shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">{contact.text}</div>
                      <div className="text-gray-400 text-xs">{contact.subtext}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-fedex-purple transition-colors"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
              {footerSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="hidden lg:block"
                >
                  <h3 className="font-bold text-lg mb-4 text-white">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map(link => (
                      <li key={link.name}>
                        <a
                          href={link.url}
                          className="text-gray-400 hover:text-fedex-orange transition-colors text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Tools & Resources */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-bold text-lg mb-6 text-white">Tools & Resources</h3>
              
              <div className="space-y-6">
                {toolsResources.map(section => (
                  <div key={section.title}>
                    <h4 className="font-semibold text-gray-300 mb-3 text-sm">{section.title}</h4>
                    <div className="space-y-2">
                      {section.items.map(item => (
                        <a
                          key={item.name}
                          href={item.url}
                          className="flex items-center space-x-2 text-gray-400 hover:text-fedex-orange transition-colors text-sm group"
                        >
                          <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>{item.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Language Selector */}
              <div className="mt-8 p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-2 text-gray-300 mb-2">
                  <FiGlobe className="w-4 h-4" />
                  <span className="text-sm font-semibold">Global Sites</span>
                </div>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-fedex-purple">
                  <option>United States (English)</option>
                  <option>Canada (English)</option>
                  <option>Canada (Français)</option>
                  <option>Mexico (Español)</option>
                  <option>United Kingdom (English)</option>
                </select>
              </div>
            </motion.div>
          </div>

          {/* Mobile Accordion */}
          <div className="lg:hidden space-y-4 mb-8">
            {footerSections.map(section => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="border-b border-gray-700"
              >
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between py-4 text-left font-semibold text-white"
                >
                  {section.title}
                  {openSections[section.title] ? (
                    <FiChevronUp className="w-5 h-5 text-fedex-orange" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-fedex-orange" />
                  )}
                </button>
                
                <AnimatePresence>
                  {openSections[section.title] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pb-4"
                    >
                      <ul className="space-y-2">
                        {section.links.map(link => (
                          <li key={link.name}>
                            <a
                              href={link.url}
                              className="text-gray-400 hover:text-fedex-orange transition-colors text-sm block py-1"
                            >
                              {link.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            className="bg-linear-to-r from-fedex-purple to-fedex-blue rounded-2xl p-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
                <p className="text-white/80">
                  Get the latest shipping insights, offers, and industry news delivered to your inbox.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                />
                <motion.button
                  className="px-6 py-3 bg-white text-fedex-purple rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-gray-400 text-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span>© 2024 FedEx. All Rights Reserved.</span>
                  <div className="flex flex-wrap gap-4">
                    {legalLinks.map(link => (
                      <a
                        key={link.name}
                        href={link.url}
                        className="hover:text-fedex-orange transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Trust Seals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center space-x-6"
              >
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>SSL Secured</span>
                </div>
                
                <div className="flex space-x-4 opacity-80">
                  {/* Trust badge placeholders */}
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold">ISO</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold">A+</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Regulatory Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 pt-6 border-t border-gray-800"
            >
              <p className="text-gray-500 text-xs leading-relaxed">
                FedEx Express Corporation: 3610 Hacks Cross Road, Memphis, TN 38125 | 
                MC# 100571 | USDOT# 110365
                <br />
                FedEx Ground Package System, Inc.: 1000 FedEx Drive, Moon Township, PA 15108 | 
                MC# 135396 | USDOT# 874289
                <br />
                *Rates and services subject to change without notice. Other restrictions may apply. 
                See our Terms of Use for details.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}