// components/Hero/HeroSection.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiClock, FiShield, FiArrowRight } from 'react-icons/fi';
import { FaShippingFast } from 'react-icons/fa';

// Types
interface DotPosition {
  left: number;
  top: number;
  duration: number;
  delay: number;
  key: number;
}

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}

// Moving dots component with optimized performance
const MovingDots: React.FC = () => {
  const dots: DotPosition[] = Array.from({ length: 50 }, (_, i) => {
    const left = (i * 7) % 100;
    const top = (i * 11) % 100;
    const duration = 3 + (i % 3);
    const delay = (i % 5) * 0.5;
    
    return { left, top, duration, delay, key: i };
  });

  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      {dots.map((dot) => (
        <motion.div
          key={dot.key}
          className="absolute w-2 h-2 bg-fedex-purple rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Main Hero Section Component
export default function HeroSection(): React.ReactNode {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const router = useRouter();

  const features: string[] = [
    "International Shipping",
    "Overnight Delivery", 
    "Freight Services",
    "E-commerce Solutions"
  ];

  const stats: StatItem[] = [
    { icon: FiMapPin, value: '220+', label: 'Countries Served' },
    { icon: FiClock, value: '99%', label: 'On-Time Delivery' },
    { icon: FiShield, value: '24/7', label: 'Customer Support' }
  ];

  // Typing effect with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Handle tracking form submission
  const handleTrack = (e: React.FormEvent): void => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setIsTracking(true);
      // Simulate API call delay
      setTimeout(() => {
        setIsTracking(false);
        router.push(`/tracking?trackingNumber=${encodeURIComponent(trackingNumber)}`);
      }, 1000);
    } else {
      router.push('/tracking');
    }
  };

  // Direct navigation to tracking page
  const navigateToTracking = (): void => {
    router.push('/tracking');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <MovingDots />

        {/* linear Orbs */}
        <motion.div
          className="absolute top-1/4 -left-10 w-72 h-72 bg-linear-to-r from-fedex-purple/20 to-fedex-blue/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-10 w-96 h-96 bg-linear-to-r from-fedex-orange/10 to-fedex-purple/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Trust Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-fedex-purple/10 border border-fedex-purple/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 bg-fedex-orange rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-semibold text-fedex-purple">
              World&apos;s Most Reliable Shipping
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Delivering Your
            <br />
            <span className="text-fedex-purple">Worldwide</span>{' '}
            <div className="h-16 md:h-20 lg:h-24 mt-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeFeature}
                  className="text-fedex-orange bg-linear-to-r from-fedex-orange to-fedex-purple bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {features[activeFeature]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Trusted by millions worldwide, FedEx delivers your packages with speed, 
            security, and reliability. From documents to freight, we&apos;ve got you covered.
          </motion.p>

          {/* Tracking Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-1 mb-8 border border-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., 1234 5678 9012)"
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple/20 bg-gray-50 placeholder-gray-400"
                  aria-label="Tracking number"
                />
              </div>
              <motion.button
                type="submit"
                disabled={isTracking}
                className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 min-w-[140px] transition-all ${
                  isTracking 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-fedex-purple hover:bg-purple-800'
                } text-white`}
                whileHover={!isTracking ? { scale: 1.02, boxShadow: "0 10px 30px -5px rgba(77, 20, 140, 0.4)" } : {}}
                whileTap={!isTracking ? { scale: 0.98 } : {}}
                aria-label={isTracking ? "Tracking in progress" : "Track package"}
              >
                {isTracking ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <span>Track Now</span>
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Alternative Tracking Option */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-gray-600">Or</span>
            <motion.button
              onClick={navigateToTracking}
              className="px-6 py-3 border-2 border-fedex-purple text-fedex-purple rounded-xl font-semibold hover:bg-fedex-purple hover:text-white transition-all flex items-center space-x-2"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 25px -5px rgba(77, 20, 140, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              aria-label="Go to tracking page"
            >
              <FiSearch className="w-5 h-5" />
              <span>Go to Tracking Page</span>
            </motion.button>
          </motion.div>

          {/* Statistics */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <stat.icon className="w-5 h-5 text-fedex-orange" aria-hidden="true" />
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <span className="text-gray-600 text-sm">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content - Professional Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Image Container */}
          <div className="relative">
            {/* Floating Feature Cards */}
            <motion.div
              className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 z-10"
              initial={{ opacity: 0, y: 20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Express</p>
                  <p className="text-sm text-gray-600">Next Day</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 z-10"
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ y: 5 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiMapPin className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Global</p>
                  <p className="text-sm text-gray-600">220+ Countries</p>
                </div>
              </div>
            </motion.div>

            {/* Professional Hero Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-linear-to-br from-fedex-purple to-fedex-blue">
              <div className="aspect-square relative w-full">
                <Image
                  src="/fedex.jpeg" // Replace with your actual image path
                  alt="FedEx Global Delivery - Professional shipping services worldwide"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
                />
                {/* Overlay with content */}
                <div className="absolute inset-0 bg-linear-to-br from-fedex-purple/80 to-fedex-blue/80 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring" }}
                      className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <FaShippingFast className="w-16 h-16 text-white" aria-hidden="true" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Global Delivery</h3>
                    <p className="text-white/80">Your trusted shipping partner worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Decorative Element */}
          <motion.div
            className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-fedex-purple/5 rounded-3xl"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-fedex-purple rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <motion.div
            className="w-1 h-3 bg-fedex-purple rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}