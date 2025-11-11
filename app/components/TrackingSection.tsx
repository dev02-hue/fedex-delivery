/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Tracking/TrackingSection.tsx
'use client';
import { useState } from 'react';
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
  FiEdit,
  FiPackage,
  FiNavigation
} from 'react-icons/fi';
import { 
  getTrackingDetails, 
  
  updatePackageStatus,
  
  addTrackingEvent,
  type TrackingPackage,
  type TrackingEvent 
} from '@/lib/tracking';

// Fix CSS class
const fixedGradient = 'bg-gradient-to-br';

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [packageJourney, setPackageJourney] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Sample tracking numbers for quick testing
  const sampleNumbers = ['FDX123456789', 'FDX987654321'];

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await getTrackingDetails(trackingNumber);
      
      if (result.error) {
        setError(result.error);
      } else if (result.trackingDetails) {
        // Transform the data to match our component structure
        const transformedData = transformTrackingData(result.trackingDetails);
        setTrackingData(transformedData);
        
        // Also fetch package journey
        // const journeyResult = await getPackageJourney(trackingNumber);
        // if (journeyResult.locations) {
        //   setPackageJourney(journeyResult.locations);
        // }
      }
    } catch (err) {
      setError('Failed to fetch tracking information');
      console.error('Tracking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform database data to component format
  const transformTrackingData = (trackingDetails: any) => {
    const { package: pkg, events } = trackingDetails;
    
    return {
      id: pkg.id,
      status: pkg.status,
      trackingNumber: pkg.tracking_number,
      service: pkg.service_type,
      estimatedDelivery: pkg.estimated_delivery,
      recipient: pkg.recipient_name,
      destination: pkg.destination || pkg.recipient_address,
      sender: pkg.sender_name,
      senderAddress: pkg.sender_address,
      currentLocation: pkg.current_location,
      lastLocation: pkg.last_location,
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

  const handleSampleTrack = (sampleNumber: string) => {
    setTrackingNumber(sampleNumber);
    // Auto-track after setting the number
    setTimeout(() => {
      const button = document.getElementById('track-button');
      button?.click();
    }, 100);
  };

  const copyTrackingNumber = () => {
    if (trackingData) {
      navigator.clipboard.writeText(trackingData.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusUpdate = async (newStatus: TrackingPackage['status']) => {
    if (!trackingData) return;
    
    setIsUpdatingStatus(true);
    try {
      const result = await updatePackageStatus(trackingData.trackingNumber, newStatus);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Refresh tracking data
        const refreshResult = await getTrackingDetails(trackingData.trackingNumber);
        if (refreshResult.trackingDetails) {
          const transformedData = transformTrackingData(refreshResult.trackingDetails);
          setTrackingData(transformedData);
        }
      }
    } catch (err) {
      setError('Failed to update package status');
      console.error('Status update error:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // const handleLocationUpdate = async (newLocation: string) => {
  //   if (!trackingData) return;
    
  //   try {
  //     const result = await updatePackageLocation(trackingData.trackingNumber, newLocation);
      
  //     if (result.error) {
  //       setError(result.error);
  //     } else {
  //       // Refresh tracking data
  //       const refreshResult = await getTrackingDetails(trackingData.trackingNumber);
  //       if (refreshResult.trackingDetails) {
  //         const transformedData = transformTrackingData(refreshResult.trackingDetails);
  //         setTrackingData(transformedData);
  //       }
  //     }
  //   } catch (err) {
  //     setError('Failed to update package location');
  //     console.error('Location update error:', err);
  //   }
  // };

  const handleAddEvent = async (eventData: Omit<TrackingEvent, 'id' | 'package_id' | 'created_at'>) => {
    if (!trackingData) return;
    
    try {
      const result = await addTrackingEvent(trackingData.trackingNumber, eventData);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Refresh tracking data
        const refreshResult = await getTrackingDetails(trackingData.trackingNumber);
        if (refreshResult.trackingDetails) {
          const transformedData = transformTrackingData(refreshResult.trackingDetails);
          setTrackingData(transformedData);
        }
      }
    } catch (err) {
      setError('Failed to add tracking event');
      console.error('Add event error:', err);
    }
  };

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
      case 'picked_up': return FiMapPin;
      case 'exception': return FiAlertCircle;
      default: return FiClock;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return 'Date not available';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Time not available';
    }
  };

  // Quick status update buttons (for demo/admin purposes)
  const statusButtons = [
    { status: 'picked_up' as const, label: 'Mark as Picked Up', color: 'bg-purple-500 hover:bg-purple-600' },
    { status: 'in_transit' as const, label: 'Mark in Transit', color: 'bg-blue-500 hover:bg-blue-600' },
    { status: 'out_for_delivery' as const, label: 'Out for Delivery', color: 'bg-orange-500 hover:bg-orange-600' },
    { status: 'delivered' as const, label: 'Mark Delivered', color: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <section id="tracking" className={`py-20 ${fixedGradient} from-gray-50 to-blue-50 relative overflow-hidden`}>
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
                  placeholder="Enter tracking number (e.g., FDX123456789)"
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
                <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
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
              <div className={`${fixedGradient} from-fedex-purple to-fedex-blue p-6 text-white`}>
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
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trackingData.status)}`}>
                      {trackingData.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
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
                  {['details', 'timeline', 'journey'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 font-semibold text-sm border-b-2 transition-colors capitalize ${
                        activeTab === tab
                          ? 'border-fedex-purple text-fedex-purple'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'details' ? 'Shipment Details' : 
                       tab === 'timeline' ? 'Tracking Timeline' : 'Location Journey'}
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
                            {trackingData.estimatedDelivery ? formatDate(trackingData.estimatedDelivery) : 'Not available'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Recipient</span>
                          <p className="font-semibold text-gray-900">{trackingData.recipient}</p>
                        </div>
                      </div>

                      {/* Location Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Current Location</span>
                          <div className="flex items-center space-x-2">
                            <FiMapPin className="w-4 h-4 text-fedex-purple" />
                            <p className="font-semibold text-gray-900">{trackingData.currentLocation || 'In transit'}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Last Location</span>
                          <p className="font-semibold text-gray-900">{trackingData.lastLocation || 'Not available'}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">Destination</span>
                        <div className="flex items-center space-x-2">
                          <FiNavigation className="w-4 h-4 text-fedex-orange" />
                          <p className="font-semibold text-gray-900">{trackingData.destination}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">Sender</span>
                        <p className="font-semibold text-gray-900">{trackingData.sender}</p>
                        <p className="text-sm text-gray-600 mt-1">{trackingData.senderAddress}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Weight</span>
                          <p className="font-semibold text-gray-900">{trackingData.weight || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Dimensions</span>
                          <p className="font-semibold text-gray-900">{trackingData.dimensions || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Progress & Actions */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-gray-900">Delivery Progress</h4>
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
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
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

                      {/* Quick Actions (for demo/admin) */}
                      <div className="pt-6 border-t border-gray-200">
                        <h5 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h5>
                        <div className="flex flex-wrap gap-2">
                          {statusButtons.map((button) => (
                            <motion.button
                              key={button.status}
                              onClick={() => handleStatusUpdate(button.status)}
                              disabled={isUpdatingStatus || trackingData.status === button.status}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all ${
                                trackingData.status === button.status 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : button.color
                              }`}
                              whileHover={trackingData.status !== button.status ? { scale: 1.05 } : {}}
                              whileTap={trackingData.status !== button.status ? { scale: 0.95 } : {}}
                            >
                              {button.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'timeline' ? (
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
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                event.completed ? 'bg-fedex-purple text-white' : 'bg-gray-200 text-gray-500'
                              }`}>
                                <StatusIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 pb-6">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-semibold text-gray-900">{event.description}</p>
                                    <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                                  </div>
                                  <span className="text-sm text-gray-400 whitespace-nowrap">
                                    {formatTime(event.timestamp)}
                                  </span>
                                </div>
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
                ) : (
                  /* Journey Tab */
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Location Journey</h4>
                    {packageJourney.length > 0 ? (
                      <div className="space-y-4">
                        {packageJourney.map((location, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              index === 0 
                                ? 'bg-fedex-orange text-white' 
                                : index === packageJourney.length - 1
                                ? 'bg-green-500 text-white'
                                : 'bg-fedex-purple text-white'
                            }`}>
                              {index === 0 ? (
                                <FiPackage className="w-4 h-4" />
                              ) : index === packageJourney.length - 1 ? (
                                <FiCheck className="w-4 h-4" />
                              ) : (
                                <FiMapPin className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{location}</p>
                              <p className="text-sm text-gray-500">
                                {index === 0 
                                  ? 'Origin' 
                                  : index === packageJourney.length - 1
                                  ? 'Destination'
                                  : `Stop ${index}`}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FiMapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No location journey data available</p>
                      </div>
                    )}
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
              title: 'Precise Location Tracking',
              description: 'Track current and previous locations with detailed journey history'
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