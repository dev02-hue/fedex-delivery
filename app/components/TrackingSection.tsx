/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Tracking/TrackingSection.tsx
'use client';
import { useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiTruck, 
  FiCheck, 
  FiAlertCircle,
  FiCopy,
  FiShare2,
  FiDownload,
   
} from 'react-icons/fi';

// Mock tracking data - in real app, this would come from API
const mockTrackingData = {
  '123456789012': {
    status: 'in_transit',
    trackingNumber: '123456789012',
    service: 'FedEx Express',
    estimatedDelivery: '2024-12-25T10:00:00',
    recipient: 'John Doe',
    destination: 'New York, NY 10001',
    weight: '2.5 lbs',
    dimensions: '12 × 8 × 4 in',
    timeline: [
      {
        id: 1,
        status: 'delivered',
        description: 'Delivered',
        location: 'New York, NY',
        timestamp: '2024-12-25T10:00:00',
        completed: true
      },
      {
        id: 2,
        status: 'out_for_delivery',
        description: 'Out for delivery',
        location: 'New York, NY',
        timestamp: '2024-12-25T08:30:00',
        completed: true
      },
      {
        id: 3,
        status: 'arrived_at_facility',
        description: 'Arrived at delivery facility',
        location: 'New York, NY',
        timestamp: '2024-12-25T06:15:00',
        completed: true
      },
      {
        id: 4,
        status: 'in_transit',
        description: 'In transit',
        location: 'Memphis, TN',
        timestamp: '2024-12-24T22:45:00',
        completed: true
      },
      {
        id: 5,
        status: 'departed_facility',
        description: 'Departed facility',
        location: 'Memphis, TN',
        timestamp: '2024-12-24T20:30:00',
        completed: true
      },
      {
        id: 6,
        status: 'arrived_at_facility',
        description: 'Arrived at sort facility',
        location: 'Memphis, TN',
        timestamp: '2024-12-24T18:15:00',
        completed: true
      },
      {
        id: 7,
        status: 'picked_up',
        description: 'Picked up',
        location: 'Los Angeles, CA',
        timestamp: '2024-12-24T14:00:00',
        completed: true
      }
    ]
  },
  '987654321098': {
    status: 'out_for_delivery',
    trackingNumber: '987654321098',
    service: 'FedEx Ground',
    estimatedDelivery: '2024-12-25T14:00:00',
    recipient: 'Sarah Johnson',
    destination: 'Chicago, IL 60601',
    weight: '5.2 lbs',
    dimensions: '16 × 12 × 6 in',
    timeline: [
      {
        id: 1,
        status: 'out_for_delivery',
        description: 'Out for delivery',
        location: 'Chicago, IL',
        timestamp: '2024-12-25T08:00:00',
        completed: true
      },
      {
        id: 2,
        status: 'arrived_at_facility',
        description: 'Arrived at delivery facility',
        location: 'Chicago, IL',
        timestamp: '2024-12-25T05:30:00',
        completed: true
      },
      {
        id: 3,
        status: 'in_transit',
        description: 'In transit',
        location: 'Indianapolis, IN',
        timestamp: '2024-12-24T23:15:00',
        completed: true
      },
      {
        id: 4,
        status: 'picked_up',
        description: 'Picked up',
        location: 'Detroit, MI',
        timestamp: '2024-12-24T16:45:00',
        completed: true
      }
    ]
  }
};

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Sample tracking numbers for quick testing
  const sampleNumbers = ['123456789012', '987654321098'];

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const data = mockTrackingData[trackingNumber as keyof typeof mockTrackingData];
      if (data) {
        setTrackingData(data);
      } else {
        setError('Tracking number not found. Please check and try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSampleTrack = (sampleNumber: string) => {
    setTrackingNumber(sampleNumber);
    // Auto-track after setting the number
    setTimeout(() => {
      const button = document.getElementById('track-button');
      button?.click();
    }, 100);
  };

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingData.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'out_for_delivery': return 'text-orange-600 bg-orange-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'picked_up': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return FiCheck;
      case 'out_for_delivery': return FiTruck;
      case 'in_transit': return FiTruck;
      case 'picked_up': return FiMapPin;
      default: return FiClock;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <section id="tracking" className="py-20 bg-linear-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-80 h-80 bg-fedex-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-fedex-orange/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-fedex-purple/10 border border-fedex-purple/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 bg-fedex-orange rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-semibold text-fedex-purple">
              Real-Time Tracking
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Track Your
            <span className="text-fedex-purple"> Package </span>
            Live
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get real-time updates on your shipment&apos;s location and estimated delivery time. 
            Stay informed every step of the way with our advanced tracking system.
          </p>
        </motion.div>

        {/* Tracking Input Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleTrack} className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1 w-full">
              <label htmlFor="tracking-number" className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Tracking Number
              </label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="tracking-number"
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., 123456789012)"
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent bg-gray-50"
                />
              </div>
              
              {/* Quick Sample Numbers */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Try sample:</span>
                {sampleNumbers.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => handleSampleTrack(sample)}
                    className="text-sm text-fedex-purple hover:text-fedex-blue font-medium underline"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
            
            <motion.button
              id="track-button"
              type="submit"
              disabled={isLoading}
              className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 min-w-40 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-fedex-purple hover:bg-purple-800'
              } text-white transition-all w-full lg:w-auto`}
              whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 10px 30px -5px rgba(77, 20, 140, 0.4)" } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
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
                  <FiSearch className="w-5 h-5" />
                  <span>Track Package</span>
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
                <FiAlertCircle className="w-5 h-5 text-red-500  shrink-0" />
                <span className="text-red-700 font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tracking Results */}
        <AnimatePresence>
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              {/* Header with Tracking Info */}
              <div className="bg-linear-to-r from-fedex-purple to-fedex-blue p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <FiTruck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Tracking Results</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-mono text-lg">{trackingData.trackingNumber}</span>
                        <motion.button
                          onClick={copyTrackingNumber}
                          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiCopy className="w-4 h-4" />
                        </motion.button>
                        {copied && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-sm bg-white/20 px-2 py-1 rounded"
                          >
                            Copied!
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <motion.button
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiShare2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiDownload className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  {['details', 'timeline'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 font-semibold text-sm border-b-2 transition-colors capitalize ${
                        activeTab === tab
                          ? 'border-fedex-purple text-fedex-purple'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'details' ? 'Shipment Details' : 'Tracking Timeline'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'details' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shipment Info */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-gray-900">Shipment Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Service</span>
                          <p className="font-semibold text-gray-900">{trackingData.service}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Status</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trackingData.status)}`}>
                            {trackingData.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Estimated Delivery</span>
                          <p className="font-semibold text-gray-900">
                            {formatDate(trackingData.estimatedDelivery)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Recipient</span>
                          <p className="font-semibold text-gray-900">{trackingData.recipient}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">Destination</span>
                        <p className="font-semibold text-gray-900">{trackingData.destination}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Weight</span>
                          <p className="font-semibold text-gray-900">{trackingData.weight}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Dimensions</span>
                          <p className="font-semibold text-gray-900">{trackingData.dimensions}</p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Progress */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-6">Delivery Progress</h4>
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {/* Progress Steps */}
                        <div className="space-y-8 relative">
                          {trackingData.timeline.slice(0, 3).map((event: any, index: number) => {
                            const StatusIcon = getStatusIcon(event.status);
                            return (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start space-x-4"
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center  shrink-0 z-10 ${
                                  event.completed ? 'bg-fedex-purple text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                  <StatusIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{event.description}</p>
                                  <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {formatDate(event.timestamp)}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Timeline Tab */
                  <div className="max-w-2xl">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Tracking Timeline</h4>
                    <div className="relative">
                      {/* Vertical Line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {/* Timeline Events */}
                      <div className="space-y-6">
                        {trackingData.timeline.map((event: any, index: number) => {
                          const StatusIcon = getStatusIcon(event.status);
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start space-x-4"
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center  shrink-0 z-10 ${
                                event.completed ? 'bg-fedex-purple text-white' : 'bg-gray-200 text-gray-500'
                              }`}>
                                <StatusIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 pb-6">
                                <p className="font-semibold text-gray-900">{event.description}</p>
                                <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  {formatDate(event.timestamp)}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            {
              icon: FiClock,
              title: 'Real-Time Updates',
              description: 'Get instant notifications as your package moves through our network'
            },
            {
              icon: FiMapPin,
              title: 'Precise Location',
              description: 'Know exactly where your package is with detailed location tracking'
            },
            {
              icon: FiAlertCircle,
              title: 'Proactive Alerts',
              description: 'Receive alerts for delays, exceptions, and delivery attempts'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="w-16 h-16 bg-fedex-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-fedex-purple" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}