// components/Tools/ShippingToolsSection.tsx
'use client';
import { useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign,
  FiPackage,
  FiGlobe,
  FiClock,
  FiSearch,
  FiDownload,
  FiPrinter,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import React from 'react';
import { AiFillCalculator } from 'react-icons/ai';

export default function ShippingToolsSection() {
  const [activeTool, setActiveTool] = useState('rate');
  const [copiedTool, setCopiedTool] = useState<string | null>(null);

  // Rate Calculator State
  const [rateData, setRateData] = useState({
    from: '',
    to: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    service: 'express'
  });

  // Location Finder State
  const [locationData, setLocationData] = useState({
    zipCode: '',
    city: '',
    type: 'all'
  });

  // Time-in-Transit State
  const [transitData, setTransitData] = useState({
    from: '',
    to: '',
    shipDate: new Date().toISOString().split('T')[0],
    service: 'express'
  });

  const tools = [
    {
      id: 'rate',
      icon: FiDollarSign,
      title: 'Rate Calculator',
      description: 'Get instant shipping rates for your packages',
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 'location',
      icon: FiMapPin,
      title: 'Location Finder',
      description: 'Find FedEx locations near you',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'transit',
      icon: FiClock,
      title: 'Time-in-Transit',
      description: 'Check delivery times between locations',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'tools',
      icon: FiPackage,
      title: 'Shipping Tools',
      description: 'Additional utilities for shippers',
      color: 'from-blue-500 to-purple-600'
    }
  ];

  const services = [
    { id: 'express', name: 'FedEx Express', delivery: '1-2 business days' },
    { id: 'ground', name: 'FedEx Ground', delivery: '2-5 business days' },
    { id: 'international', name: 'FedEx International', delivery: '3-7 business days' },
    { id: 'freight', name: 'FedEx Freight', delivery: '3-10 business days' }
  ];

  const locationTypes = [
    { id: 'all', name: 'All Locations' },
    { id: 'office', name: 'FedEx Office' },
    { id: 'dropbox', name: 'Drop Boxes' },
    { id: 'station', name: 'Staffed Stations' }
  ];

  // Mock rate calculation
  const calculateRate = () => {
    const baseRates = {
      express: 1800.00,
      ground: 1200.99,
      international: 4500.99,
      freight: 1999.99
    };
    
    const weightMultiplier = parseFloat(rateData.weight) || 1;
    const serviceRate = baseRates[rateData.service as keyof typeof baseRates] || 0;
    
    return (serviceRate * weightMultiplier).toFixed(2);
  };

  // Mock transit time calculation
  const calculateTransitTime = () => {
    const transitTimes = {
      express: '1-2 business days',
      ground: '2-5 business days',
      international: '3-7 business days',
      freight: '3-10 business days'
    };
    
    return transitTimes[transitData.service as keyof typeof transitTimes] || 'Varies';
  };

  const copyToolResult = (toolId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTool(toolId);
    setTimeout(() => setCopiedTool(null), 2000);
  };

  const printToolResult = () => {
    window.print();
  };

  const quickActions = [
    {
      icon: FiDownload,
      title: 'Shipping Labels',
      description: 'Create and print shipping labels',
      action: () => window.open('/shipping/labels', '_blank')
    },
    {
      icon: FiCalendar,
      title: 'Schedule Pickup',
      description: 'Schedule a package pickup',
      action: () => window.open('/pickup', '_blank')
    },
    {
      icon: FiPrinter,
      title: 'Print Documents',
      description: 'Print shipping documents',
      action: () => window.open('/documents', '_blank')
    },
    {
      icon: FiGlobe,
      title: 'International Tools',
      description: 'International shipping resources',
      action: () => window.open('/international', '_blank')
    }
  ];

  return (
    <section className="py-20 bg-linear-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-64 h-64 bg-fedex-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-fedex-orange/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="w-2 h-2 bg-fedex-orange rounded-full mr-2"></span>
            <span className="text-sm font-semibold text-fedex-purple">
              Shipping Utilities
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Smart Shipping
            <span className="text-fedex-purple"> Tools </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Streamline your shipping process with our comprehensive suite of tools and calculators. 
            From rate estimates to location finders, we&apos;ve got everything you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tools Navigation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Shipping Tools</h3>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all ${
                      activeTool === tool.id
                        ? 'bg-fedex-purple text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tool.icon className={`w-5 h-5  shrink-0 ${
                      activeTool === tool.id ? 'text-white' : 'text-fedex-purple'
                    }`} />
                    <div>
                      <div className="font-semibold text-sm">{tool.title}</div>
                      <div className={`text-xs mt-1 ${
                        activeTool === tool.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {tool.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.title}
                      onClick={action.action}
                      className="w-full flex items-center space-x-3 p-3 text-gray-600 hover:text-fedex-purple hover:bg-purple-50 rounded-lg transition-colors group"
                      whileHover={{ x: 5 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <action.icon className="w-4 h-4  shrink-0" />
                      <span className="text-sm font-medium">{action.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tools Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Tool Header */}
              <div className={`bg-linear-to-r ${tools.find(t => t.id === activeTool)?.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      {tools.find(t => t.id === activeTool)?.icon && 
                        React.createElement(tools.find(t => t.id === activeTool)!.icon, { 
                          className: "w-6 h-6" 
                        })
                      }
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {tools.find(t => t.id === activeTool)?.title}
                      </h3>
                      <p className="text-white/80 text-sm mt-1">
                        {tools.find(t => t.id === activeTool)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Rate Calculator */}
                  {activeTool === 'rate' && (
                    <motion.div
                      key="rate"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                      <div className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-900">Calculate Shipping Rate</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              From ZIP Code
                            </label>
                            <input
                              type="text"
                              value={rateData.from}
                              onChange={(e) => setRateData({...rateData, from: e.target.value})}
                              placeholder="Enter origin ZIP code"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              To ZIP Code
                            </label>
                            <input
                              type="text"
                              value={rateData.to}
                              onChange={(e) => setRateData({...rateData, to: e.target.value})}
                              placeholder="Enter destination ZIP code"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Weight (lbs)
                            </label>
                            <input
                              type="number"
                              value={rateData.weight}
                              onChange={(e) => setRateData({...rateData, weight: e.target.value})}
                              placeholder="Enter package weight"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Service Type
                            </label>
                            <select
                              value={rateData.service}
                              onChange={(e) => setRateData({...rateData, service: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                            >
                              {services.map(service => (
                                <option key={service.id} value={service.id}>
                                  {service.name} - {service.delivery}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Rate Results */}
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-6">Estimated Rate</h4>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-600">Service</span>
                            <span className="font-semibold text-gray-900">
                              {services.find(s => s.id === rateData.service)?.name}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-600">Delivery</span>
                            <span className="font-semibold text-gray-900">
                              {services.find(s => s.id === rateData.service)?.delivery}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-600">Base Rate</span>
                            <span className="font-semibold text-gray-900">
                              ${calculateRate()}
                            </span>
                          </div>

                          <div className="bg-fedex-purple/10 rounded-xl p-4 mt-6">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-fedex-purple">Total Estimated Cost</span>
                              <span className="text-2xl font-bold text-fedex-purple">
                                ${calculateRate()}
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-3 mt-6">
                            <motion.button
                              onClick={() => copyToolResult('rate', `FedEx Rate: $${calculateRate()} for ${services.find(s => s.id === rateData.service)?.name}`)}
                              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {copiedTool === 'rate' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                              <span>{copiedTool === 'rate' ? 'Copied!' : 'Copy Quote'}</span>
                            </motion.button>
                            
                            <motion.button
                              onClick={printToolResult}
                              className="flex-1 bg-fedex-purple text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-800 transition-colors flex items-center justify-center space-x-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FiPrinter className="w-4 h-4" />
                              <span>Print Quote</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Location Finder */}
                  {activeTool === 'location' && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h4 className="text-lg font-bold text-gray-900">Find FedEx Locations</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ZIP Code or City
                          </label>
                          <input
                            type="text"
                            value={locationData.zipCode}
                            onChange={(e) => setLocationData({...locationData, zipCode: e.target.value})}
                            placeholder="Enter ZIP code or city"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Location Type
                          </label>
                          <select
                            value={locationData.type}
                            onChange={(e) => setLocationData({...locationData, type: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                          >
                            {locationTypes.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <motion.button
                            className="w-full bg-fedex-purple text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-800 transition-colors flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiSearch className="w-4 h-4" />
                            <span>Find Locations</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Mock Locations Results */}
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <h5 className="font-semibold text-gray-900 mb-4">Nearby Locations</h5>
                        <div className="space-y-4">
                          {[
                            { name: 'FedEx Office', address: '123 Main St, New York, NY 10001', distance: '0.5 mi', hours: '8:00 AM - 8:00 PM' },
                            { name: 'FedEx Ship Center', address: '456 Broadway, New York, NY 10002', distance: '1.2 mi', hours: '7:00 AM - 9:00 PM' },
                            { name: 'FedEx Drop Box', address: '789 Park Ave, New York, NY 10003', distance: '0.8 mi', hours: '24/7' }
                          ].map((location, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white rounded-xl p-4 border border-gray-200"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h6 className="font-semibold text-gray-900">{location.name}</h6>
                                  <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                                  <p className="text-xs text-gray-500 mt-1">Hours: {location.hours}</p>
                                </div>
                                <span className="text-sm text-fedex-purple font-semibold">{location.distance}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Time-in-Transit */}
                  {activeTool === 'transit' && (
                    <motion.div
                      key="transit"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h4 className="text-lg font-bold text-gray-900">Check Delivery Time</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            From ZIP Code
                          </label>
                          <input
                            type="text"
                            value={transitData.from}
                            onChange={(e) => setTransitData({...transitData, from: e.target.value})}
                            placeholder="Enter origin ZIP code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            To ZIP Code
                          </label>
                          <input
                            type="text"
                            value={transitData.to}
                            onChange={(e) => setTransitData({...transitData, to: e.target.value})}
                            placeholder="Enter destination ZIP code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ship Date
                          </label>
                          <input
                            type="date"
                            value={transitData.shipDate}
                            onChange={(e) => setTransitData({...transitData, shipDate: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Service Type
                          </label>
                          <select
                            value={transitData.service}
                            onChange={(e) => setTransitData({...transitData, service: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                          >
                            {services.map(service => (
                              <option key={service.id} value={service.id}>
                                {service.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Transit Results */}
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <h5 className="font-semibold text-gray-900 mb-4">Estimated Transit Time</h5>
                        <div className="text-center py-8">
                          <div className="text-3xl font-bold text-fedex-purple mb-2">
                            {calculateTransitTime()}
                          </div>
                          <p className="text-gray-600">
                            Estimated delivery for {services.find(s => s.id === transitData.service)?.name}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Additional Tools */}
                  {activeTool === 'tools' && (
                    <motion.div
                      key="tools"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h4 className="text-lg font-bold text-gray-900">Additional Shipping Tools</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            title: 'Address Validation',
                            description: 'Verify and correct shipping addresses',
                            icon: FiCheck,
                            action: () => window.open('/tools/address-validation', '_blank')
                          },
                          {
                            title: 'Package Tracking',
                            description: 'Track multiple packages at once',
                            icon: FiPackage,
                            action: () => window.open('/tools/bulk-tracking', '_blank')
                          },
                          {
                            title: 'International Docs',
                            description: 'Generate international shipping documents',
                            icon: FiGlobe,
                            action: () => window.open('/tools/international-docs', '_blank')
                          },
                          {
                            title: 'Rate Shopping',
                            description: 'Compare rates across services',
                            icon: AiFillCalculator,
                            action: () => window.open('/tools/rate-comparison', '_blank')
                          }
                        ].map((tool, index) => (
                          <motion.button
                            key={tool.title}
                            onClick={tool.action}
                            className="bg-gray-50 rounded-xl p-6 text-left hover:bg-gray-100 transition-colors group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-fedex-purple/10 rounded-xl flex items-center justify-center group-hover:bg-fedex-purple/20 transition-colors">
                                <tool.icon className="w-6 h-6 text-fedex-purple" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">{tool.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}