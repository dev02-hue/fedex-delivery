// components/Admin/EditPackagesTable.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiRefreshCw, 
  FiPackage, 
  FiMapPin,
  FiNavigation,
  FiPlus,
  FiClock
} from 'react-icons/fi';
import { 
  getAllPackages, 
  deletePackage, 
  updatePackage, 
  updatePackageStatus,
  addTrackingEvent,
  type TrackingPackage,
  type TrackingEvent 
} from '@/lib/tracking';

// Define the UpdatePackageData type locally since it might not be exported
interface UpdatePackageData {
  tracking_number?: string;
  status?: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  service_type?: string;
  recipient_name?: string;
  recipient_address?: string;
  sender_name?: string;
  sender_address?: string;
  destination?: string;
  current_location?: string;
  last_location?: string;
  weight?: string;
  dimensions?: string;
  estimated_delivery?: string;
}

export default function EditPackagesTable() {
  const [packages, setPackages] = useState<TrackingPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPackage, setEditingPackage] = useState<TrackingPackage | null>(null);
  const [statusUpdatePackage, setStatusUpdatePackage] = useState<TrackingPackage | null>(null);
  const [addEventPackage, setAddEventPackage] = useState<TrackingPackage | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await getAllPackages();
      
      if (result.error) {
        setError(result.error);
      } else if (result.packages) {
        setPackages(result.packages);
      }
    } catch (err) {
      setError('Failed to load packages');
      console.error('Load packages error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (trackingNumber: string) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      const result = await deletePackage(trackingNumber);
      
      if (result.error) {
        setError(result.error);
      } else {
        setPackages(prev => prev.filter(pkg => pkg.tracking_number !== trackingNumber));
      }
    } catch (err) {
      setError('Failed to delete package');
      console.error('Delete package error:', err);
    }
  };

  const handleEdit = (pkg: TrackingPackage) => {
    setEditingPackage(pkg);
  };

  const handleStatusUpdate = (pkg: TrackingPackage) => {
    setStatusUpdatePackage(pkg);
  };

  const handleAddEvent = (pkg: TrackingPackage) => {
    setAddEventPackage(pkg);
  };

  const handleSaveEdit = async (updatedPackage: TrackingPackage) => {
    try {
      const { tracking_number , ...updates } = updatedPackage;
      const result = await updatePackage(tracking_number, updates as UpdatePackageData);
      
      if (result.error) {
        setError(result.error);
      } else if (result.package) {
        setPackages(prev => prev.map(pkg => 
          pkg.tracking_number === tracking_number ? result.package! : pkg
        ));
        setEditingPackage(null);
      }
    } catch (err) {
      setError('Failed to update package');
      console.error('Update package error:', err);
    }
  };

  const handleSaveStatusUpdate = async (trackingNumber: string, status: TrackingPackage['status'], description?: string, location?: string) => {
    try {
      const result = await updatePackageStatus(trackingNumber, status, description, location);
      
      if (result.error) {
        setError(result.error);
      } else if (result.package) {
        setPackages(prev => prev.map(pkg => 
          pkg.tracking_number === trackingNumber ? result.package! : pkg
        ));
        setStatusUpdatePackage(null);
      }
    } catch (err) {
      setError('Failed to update package status');
      console.error('Status update error:', err);
    }
  };

  const handleSaveAddEvent = async (trackingNumber: string, eventData: Omit<TrackingEvent, 'id' | 'package_id' | 'created_at'>) => {
    try {
      const result = await addTrackingEvent(trackingNumber, eventData);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Refresh packages to get updated status if it changed
        await loadPackages();
        setAddEventPackage(null);
      }
    } catch (err) {
      setError('Failed to add tracking event');
      console.error('Add event error:', err);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.current_location && pkg.current_location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pkg.destination && pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  if (editingPackage) {
    return (
      <EditPackageForm
        pkg={editingPackage}
        onSave={handleSaveEdit}
        onCancel={() => setEditingPackage(null)}
      />
    );
  }

  if (statusUpdatePackage) {
    return (
      <StatusUpdateForm
        pkg={statusUpdatePackage}
        onSave={handleSaveStatusUpdate}
        onCancel={() => setStatusUpdatePackage(null)}
      />
    );
  }

  if (addEventPackage) {
    return (
      <AddEventForm
        pkg={addEventPackage}
        onSave={handleSaveAddEvent}
        onCancel={() => setAddEventPackage(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-fedex-purple rounded-xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Packages</h1>
              <p className="text-gray-600">View and edit all tracking packages</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={loadPackages}
              className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by tracking number, recipient, sender, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Packages Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-fedex-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading packages...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="p-8 text-center">
              <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No packages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tracking #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Destination</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPackages.map((pkg, index) => (
                    <motion.tr
                      key={pkg.tracking_number}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono font-semibold text-gray-900">
                          {pkg.tracking_number}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {pkg.recipient_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{pkg.service_type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FiMapPin className="w-4 h-4 text-fedex-purple shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {pkg.current_location || 'Unknown'}
                            </div>
                            {pkg.last_location && (
                              <div className="text-xs text-gray-500">
                                Last: {pkg.last_location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FiNavigation className="w-4 h-4 text-fedex-orange shrink-0" />
                          <div className="text-sm text-gray-700">
                            {pkg.destination || pkg.recipient_address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(pkg.status)}`}>
                          {pkg.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {new Date(pkg.updated_at).toLocaleDateString()}
                          <br />
                          <span className="text-xs">
                            {new Date(pkg.updated_at).toLocaleTimeString()}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleEdit(pkg)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit Package"
                          >
                            <FiEdit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleStatusUpdate(pkg)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Update Status"
                          >
                            <FiClock className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleAddEvent(pkg)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Add Event"
                          >
                            <FiPlus className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(pkg.tracking_number)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete Package"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Package Count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredPackages.length} of {packages.length} packages
        </div>
      </motion.div>
    </div>
  );
}

// Edit Package Form Component
interface EditPackageFormProps {
  pkg: TrackingPackage;
  onSave: (updatedPackage: TrackingPackage) => void;
  onCancel: () => void;
}

function EditPackageForm({ pkg, onSave, onCancel }: EditPackageFormProps) {
  const [formData, setFormData] = useState<TrackingPackage>(pkg);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'exception', label: 'Exception' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Package</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                name="tracking_number"
                value={formData.tracking_number}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sender Name
              </label>
              <input
                type="text"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
              />
            </div>

            {/* Location Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Location
              </label>
              <input
                type="text"
                name="current_location"
                value={formData.current_location || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                placeholder="Enter current package location"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Location
              </label>
              <input
                type="text"
                name="last_location"
                value={formData.last_location || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                placeholder="Enter previous package location"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                placeholder="Enter final destination"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
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

            {/* Package Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                placeholder="e.g., 2.5 lbs"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
                placeholder="e.g., 12 × 8 × 4 in"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sender Address
              </label>
              <textarea
                name="sender_address"
                value={formData.sender_address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Address
              </label>
              <textarea
                name="recipient_address"
                value={formData.recipient_address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-semibold ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-fedex-purple hover:bg-purple-800'
              } text-white transition-colors`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// Status Update Form Component
interface StatusUpdateFormProps {
  pkg: TrackingPackage;
  onSave: (trackingNumber: string, status: TrackingPackage['status'], description?: string, location?: string) => void;
  onCancel: () => void;
}

function StatusUpdateForm({ pkg, onSave, onCancel }: StatusUpdateFormProps) {
  const [status, setStatus] = useState<TrackingPackage['status']>(pkg.status);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(pkg.current_location || '');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', description: 'Shipment information received' },
    { value: 'picked_up', label: 'Picked Up', description: 'Package picked up by carrier' },
    { value: 'in_transit', label: 'In Transit', description: 'Package in transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery', description: 'Out for delivery' },
    { value: 'delivered', label: 'Delivered', description: 'Delivered' },
    { value: 'exception', label: 'Exception', description: 'Delivery exception' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const selectedStatus = statusOptions.find(s => s.value === status);
      const eventDescription = description || selectedStatus?.description || '';
      await onSave(pkg.tracking_number, status, eventDescription, location);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Package Status</h2>
        <p className="text-gray-600 mb-6">Tracking: {pkg.tracking_number}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TrackingPackage['status'])}
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
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter current location"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add custom description or leave empty for default"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-semibold ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-fedex-purple hover:bg-purple-800'
              } text-white transition-colors`}
            >
              {isLoading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// Add Event Form Component
interface AddEventFormProps {
  pkg: TrackingPackage;
  onSave: (trackingNumber: string, eventData: Omit<TrackingEvent, 'id' | 'package_id' | 'created_at'>) => void;
  onCancel: () => void;
}

function AddEventForm({ pkg, onSave, onCancel }: AddEventFormProps) {
  const [status, setStatus] = useState<TrackingPackage['status']>(pkg.status);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(pkg.current_location || '');
  const [eventTimestamp, setEventTimestamp] = useState(new Date().toISOString().slice(0, 16));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(pkg.tracking_number, {
        status,
        description,
        location,
        event_timestamp: new Date(eventTimestamp).toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'exception', label: 'Exception' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Tracking Event</h2>
        <p className="text-gray-600 mb-6">Tracking: {pkg.tracking_number}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TrackingPackage['status'])}
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
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Timestamp
            </label>
            <input
              type="datetime-local"
              value={eventTimestamp}
              onChange={(e) => setEventTimestamp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-semibold ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-fedex-purple hover:bg-purple-800'
              } text-white transition-colors`}
            >
              {isLoading ? 'Adding Event...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}