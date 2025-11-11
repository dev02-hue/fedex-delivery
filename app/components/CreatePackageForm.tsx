// components/Admin/CreatePackageForm.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiUser, 
  FiMapPin, 
  FiTruck, 
 
  FiSave,
  FiNavigation,
  FiHome
} from 'react-icons/fi';
import { createPackage } from '@/lib/tracking';

export default function CreatePackageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    tracking_number: '',
    service_type: 'FedEx Express',
    recipient_name: '',
    recipient_address: '',
    sender_name: '',
    sender_address: '',
    destination: '',
    current_location: '',
    last_location: '',
    weight: '',
    dimensions: '',
    estimated_delivery: '',
    initial_status: 'pending' as const
  });

  const serviceTypes = [
    'FedEx Express',
    'FedEx Ground',
    'FedEx International',
    'FedEx Freight',
    'FedEx SameDay'
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'exception', label: 'Exception' }
  ];

  const commonLocations = [
    'New York Distribution Center',
    'Los Angeles Sorting Facility',
    'Chicago Hub',
    'Miami International Gateway',
    'Dallas Fort Worth Hub',
    'Memphis SuperHub',
    'Seattle Processing Center',
    'Atlanta Distribution Facility'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-populate destination if recipient address changes and destination is empty
    if (name === 'recipient_address' && !formData.destination) {
      setFormData(prev => ({
        ...prev,
        destination: value
      }));
    }

    // Auto-populate current location if sender address changes and current location is empty
    if (name === 'sender_address' && !formData.current_location) {
      setFormData(prev => ({
        ...prev,
        current_location: value,
        last_location: value
      }));
    }
  };

  const generateTrackingNumber = () => {
    const prefix = 'FDX';
    const randomNum = Math.floor(100000000 + Math.random() * 900000000);
    setFormData(prev => ({
      ...prev,
      tracking_number: `${prefix}${randomNum}`
    }));
  };

  const handleUseSenderAsCurrentLocation = () => {
    if (formData.sender_address) {
      setFormData(prev => ({
        ...prev,
        current_location: prev.sender_address,
        last_location: prev.sender_address
      }));
    }
  };

  const handleUseRecipientAsDestination = () => {
    if (formData.recipient_address) {
      setFormData(prev => ({
        ...prev,
        destination: prev.recipient_address
      }));
    }
  };

  const handleCommonLocationSelect = (location: string, field: 'current_location' | 'destination') => {
    setFormData(prev => ({
      ...prev,
      [field]: location
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for API - ensure location fields are properly set
      const submitData = {
        ...formData,
        destination: formData.destination || formData.recipient_address,
        current_location: formData.current_location || formData.sender_address,
        last_location: formData.last_location || formData.sender_address
      };

      const result = await createPackage(submitData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Package created successfully with initial tracking event!');
        // Reset form
        setFormData({
          tracking_number: '',
          service_type: 'FedEx Express',
          recipient_name: '',
          recipient_address: '',
          sender_name: '',
          sender_address: '',
          destination: '',
          current_location: '',
          last_location: '',
          weight: '',
          dimensions: '',
          estimated_delivery: '',
          initial_status: 'pending'
        });
      }
    } catch (err) {
      setError('Failed to create package');
      console.error('Create package error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationSuggestions = (field: 'current_location' | 'destination') => {
    const currentValue = formData[field];
    if (!currentValue) return commonLocations;
    
    return commonLocations.filter(location =>
      location.toLowerCase().includes(currentValue.toLowerCase())
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-fedex-purple rounded-xl flex items-center justify-center">
            <FiPackage className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Package</h1>
            <p className="text-gray-600">Add a new tracking package with location tracking</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tracking Number & Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tracking Number *
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  name="tracking_number"
                  value={formData.tracking_number}
                  onChange={handleChange}
                  placeholder="FDX123456789"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={generateTrackingNumber}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Type *
              </label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                required
              >
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sender Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FiUser className="w-5 h-5 text-fedex-purple" />
              <span>Sender Information</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sender Name *
                </label>
                <input
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sender Address *
                </label>
                <input
                  type="text"
                  name="sender_address"
                  value={formData.sender_address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State, ZIP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FiMapPin className="w-5 h-5 text-fedex-orange" />
              <span>Recipient Information</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipient Address *
                </label>
                <input
                  type="text"
                  name="recipient_address"
                  value={formData.recipient_address}
                  onChange={handleChange}
                  placeholder="456 Oak Ave, City, State, ZIP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Tracking */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FiNavigation className="w-5 h-5 text-fedex-blue" />
              <span>Location Tracking</span>
            </h3>
            
            {/* Current Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Location *
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="current_location"
                    value={formData.current_location}
                    onChange={handleChange}
                    placeholder="Enter current package location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleUseSenderAsCurrentLocation}
                    className="text-sm text-fedex-purple hover:text-purple-800 font-medium flex items-center space-x-1"
                  >
                    <FiHome className="w-4 h-4" />
                    <span>Use sender address as current location</span>
                  </button>
                </div>
                
                {/* Common Locations Suggestions */}
                {getLocationSuggestions('current_location').length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Common locations:</p>
                    <div className="flex flex-wrap gap-1">
                      {getLocationSuggestions('current_location').slice(0, 3).map(location => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => handleCommonLocationSelect(location, 'current_location')}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination *
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Enter final destination"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleUseRecipientAsDestination}
                    className="text-sm text-fedex-purple hover:text-purple-800 font-medium flex items-center space-x-1"
                  >
                    <FiMapPin className="w-4 h-4" />
                    <span>Use recipient address as destination</span>
                  </button>
                </div>
                
                {/* Common Locations Suggestions */}
                {getLocationSuggestions('destination').length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Common locations:</p>
                    <div className="flex flex-wrap gap-1">
                      {getLocationSuggestions('destination').slice(0, 3).map(location => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => handleCommonLocationSelect(location, 'destination')}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Last Location (Optional) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Location
                </label>
                <input
                  type="text"
                  name="last_location"
                  value={formData.last_location}
                  onChange={handleChange}
                  placeholder="Previous package location (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use current location as last location
                </p>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FiTruck className="w-5 h-5 text-green-600" />
              <span>Package Details</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="2.5 lbs"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="12 × 8 × 4 in"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Initial Status
                </label>
                <select
                  name="initial_status"
                  value={formData.initial_status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Delivery
                </label>
                <input
                  type="datetime-local"
                  name="estimated_delivery"
                  value={formData.estimated_delivery}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Form Summary */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Package Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Tracking:</span>
                <p className="font-semibold">{formData.tracking_number || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">Service:</span>
                <p className="font-semibold">{formData.service_type}</p>
              </div>
              <div>
                <span className="text-gray-500">Current Location:</span>
                <p className="font-semibold">{formData.current_location || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">Destination:</span>
                <p className="font-semibold">{formData.destination || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-fedex-purple hover:bg-purple-800'
              } text-white transition-all`}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Package...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>Create Package</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}