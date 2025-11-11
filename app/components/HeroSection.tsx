/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Hero/HeroSection.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiShield, 
  FiArrowRight, 
  FiCheck, 
  FiTruck, 
  FiPackage 
} from 'react-icons/fi';
import { FaShippingFast } from 'react-icons/fa';
import { getTrackingDetails } from '@/lib/tracking';

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

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

interface TrackingData {
  status: string;
  trackingNumber: string;
  service: string;
  estimatedDelivery: string;
  recipient: string;
  destination: string;
  sender: string;
  senderAddress: string;
  weight: string;
  dimensions: string;
  timeline: TrackingEvent[];
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

// Tracking Results Component
const TrackingResults: React.FC<{ 
  trackingData: TrackingData; 
  onClose: () => void;
  onTrackAnother: () => void;
}> = ({ trackingData, onClose, onTrackAnother }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'out_for_delivery': return 'text-orange-600 bg-orange-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'picked_up': return 'text-purple-600 bg-purple-100';
      case 'exception': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return FiCheck;
      case 'out_for_delivery': return FiTruck;
      case 'in_transit': return FiTruck;
      case 'picked_up': return FiPackage;
      case 'exception': return FiShield;
      default: return FiClock;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return 'Date not available';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="bg-linear-to-r from-fedex-purple to-fedex-blue p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Tracking Results</h3>
              <p className="text-white/80 font-mono text-sm">{trackingData.trackingNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trackingData.status)}`}>
              {trackingData.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">Package Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold">{trackingData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient</span>
                <span className="font-semibold text-right">{trackingData.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination</span>
                <span className="font-semibold text-right max-w-xs">{trackingData.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-semibold">{formatDate(trackingData.estimatedDelivery)}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">Recent Activity</h4>
            <div className="space-y-3">
              {trackingData.timeline.slice(0, 2).map((event, index) => {
                const StatusIcon = getStatusIcon(event.status);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{event.description}</p>
                      <p className="text-xs text-gray-600">{event.location} • {formatDate(event.timestamp)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
          <motion.button
            onClick={onTrackAnother}
            className="flex-1 px-6 py-3 bg-fedex-purple text-white rounded-xl font-semibold hover:bg-purple-800 transition-colors flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSearch className="w-4 h-4" />
            <span>Track Another Package</span>
          </motion.button>
          <motion.button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Hero Section Component
export default function HeroSection(): React.ReactNode {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string>('');
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

  // Transform database data to component format
  const transformTrackingData = (trackingDetails: any): TrackingData => {
    const { package: pkg, events } = trackingDetails;
    
    return {
      status: pkg.status,
      trackingNumber: pkg.tracking_number,
      service: pkg.service_type,
      estimatedDelivery: pkg.estimated_delivery,
      recipient: pkg.recipient_name,
      destination: pkg.recipient_address,
      sender: pkg.sender_name,
      senderAddress: pkg.sender_address,
      weight: pkg.weight,
      dimensions: pkg.dimensions,
      timeline: events.map((event: any) => ({
        id: event.id,
        status: event.status,
        description: event.description,
        location: event.location,
        timestamp: event.event_timestamp,
        completed: new Date(event.event_timestamp) < new Date()
      })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    };
  };

  // Handle tracking form submission
  const handleTrack = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsTracking(true);
    setError('');
    setTrackingData(null);

    try {
      const result = await getTrackingDetails(trackingNumber);
      
      if (result.error) {
        setError(result.error);
      } else if (result.trackingDetails) {
        const transformedData = transformTrackingData(result.trackingDetails);
        setTrackingData(transformedData);
      }
    } catch (err) {
      setError('Failed to fetch tracking information');
      console.error('Tracking error:', err);
    } finally {
      setIsTracking(false);
    }
  };

  // Direct navigation to tracking page
  const navigateToTracking = (): void => {
    router.push('/tracking');
  };

  const handleCloseResults = (): void => {
    setTrackingData(null);
    setTrackingNumber('');
  };

  const handleTrackAnother = (): void => {
    setTrackingData(null);
    setTrackingNumber('');
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          {trackingData ? (
            <TrackingResults 
              trackingData={trackingData} 
              onClose={handleCloseResults}
              onTrackAnother={handleTrackAnother}
            />
          ) : (
            <motion.div
              key="hero-content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
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
                        placeholder="Enter tracking number (e.g., FDX123456789)"
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

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3"
                      >
                        <FiShield className="w-5 h-5 text-red-500 shrink-0" />
                        <span className="text-red-700 font-medium">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

              {/* Right Content - Professional Image Section */}
              <motion.div
                className="relative order-first lg:order-last"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative max-w-lg mx-auto lg:max-w-none">
                  {/* Main Image Container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-linear-to-br from-fedex-purple to-fedex-blue aspect-4/5 lg:aspect-square">
                    <Image
                      src="/fedex.jpeg"
                      alt="FedEx Global Delivery - Professional shipping services worldwide"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                       
                    />
                    
                    {/* linear Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-fedex-purple/70 to-fedex-blue/70 flex items-center justify-center">
                      <div className="text-center text-white p-8 z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2, type: "spring" }}
                          className="w-24 h-24 lg:w-32 lg:h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 backdrop-blur-sm"
                        >
                          <FaShippingFast className="w-12 h-12 lg:w-16 lg:h-16 text-white" aria-hidden="true" />
                        </motion.div>
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 }}
                          className="text-xl lg:text-2xl font-bold mb-2"
                        >
                          Global Delivery
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.5 }}
                          className="text-white/90 text-sm lg:text-base"
                        >
                          Your trusted shipping partner worldwide
                        </motion.p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Feature Cards */}
                  <motion.div
                    className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 bg-white p-3 lg:p-4 rounded-2xl shadow-2xl border border-gray-200 z-10 max-w-40"
                    initial={{ opacity: 0, y: 20, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center  shrink-0">
                        <FiClock className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">Express</p>
                        <p className="text-xs text-gray-600 truncate">Next Day</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-white p-3 lg:p-4 rounded-2xl shadow-2xl border border-gray-200 z-10 max-w-40"
                    initial={{ opacity: 0, y: 20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 1 }}
                    whileHover={{ y: 5, scale: 1.05 }}
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center  shrink-0">
                        <FiMapPin className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">Global</p>
                        <p className="text-xs text-gray-600 truncate">220+ Countries</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Additional Floating Element */}
                  <motion.div
                    className="absolute top-1/2 -left-8 bg-white p-3 rounded-2xl shadow-2xl border border-gray-200 z-10 hidden lg:block"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <FiShield className="w-5 h-5 text-orange-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Secure</p>
                        <p className="text-xs text-gray-600">24/7 Tracking</p>
                      </div>
                    </div>
                  </motion.div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator - Only show when not viewing tracking results */}
      <AnimatePresence>
        {!trackingData && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
        )}
      </AnimatePresence>
    </section>
  );
}