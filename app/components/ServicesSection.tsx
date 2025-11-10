// components/Services/ServicesSection.tsx
'use client';
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  FiTruck, 
  FiClock, 
  FiGlobe, 
  FiPackage, 
  FiDollarSign, 
  FiShield,
  FiArrowRight,
  FiCheck,
  FiStar
} from 'react-icons/fi';

interface Service {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  features: string[];
  price: string;
  deliveryTime: string;
  popular: boolean;
  color: string;
  rating?: number;
}

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const services: Service[] = [
    {
      id: 1,
      icon: FiClock,
      title: 'FedEx Express',
      description: 'Overnight and time-definite delivery for urgent packages with real-time tracking and guaranteed delivery.',
      features: ['Next Day Delivery', 'Time-Definite', 'Global Coverage', 'Real-Time Tracking', 'Signature Required'],
      price: 'From $1100',
      deliveryTime: '1-2 Days',
      popular: true,
      color: 'from-blue-500 to-purple-600',
      rating: 4.8
    },
    {
      id: 2,
      icon: FiTruck,
      title: 'FedEx Ground',
      description: 'Cost-effective ground delivery for less time-sensitive shipments with reliable nationwide coverage.',
      features: ['Economical', 'Reliable', 'Nationwide', 'Package Tracking', 'Flexible Pickup'],
      price: 'From $1200.99',
      deliveryTime: '2-5 Days',
      popular: false,
      color: 'from-green-500 to-blue-600',
      rating: 4.6
    },
    {
      id: 3,
      icon: FiGlobe,
      title: 'International',
      description: 'Global shipping solutions for international trade with customs clearance and documentation support.',
      features: ['Global Reach', 'Customs Clearance', 'Documentation', 'Multi-Carrier', 'Duty Calculator'],
      price: 'From $4500.99',
      deliveryTime: '3-7 Days',
      popular: false,
      color: 'from-orange-500 to-red-600',
      rating: 4.7
    },
    {
      id: 4,
      icon: FiPackage,
      title: 'Freight Services',
      description: 'Heavyweight and palletized freight solutions for business shipments with specialized handling.',
      features: ['Heavy Items', 'Palletized', 'LTL/FTL', 'Specialized Handling', 'Liftgate Service'],
      price: 'Custom Quote',
      deliveryTime: '3-10 Days',
      popular: false,
      color: 'from-purple-500 to-pink-600',
      rating: 4.5
    },
    {
      id: 5,
      icon: FiDollarSign,
      title: 'Economy Services',
      description: 'Most affordable rates for non-urgent package delivery with full tracking and reliability.',
      features: ['Lowest Rates', 'Reliable', 'Tracking Included', 'Flexible', 'Insurance Options'],
      price: 'From $1800.99',
      deliveryTime: '5-7 Days',
      popular: false,
      color: 'from-gray-500 to-gray-700',
      rating: 4.3
    },
    {
      id: 6,
      icon: FiShield,
      title: 'Specialized Services',
      description: 'Special handling for sensitive, valuable, or regulated items with white-glove service.',
      features: ['Temperature Control', 'High Value', 'Hazardous Materials', 'White Glove', 'Secure Chain'],
      price: 'Custom Quote',
      deliveryTime: 'Varies',
      popular: false,
      color: 'from-yellow-500 to-orange-600',
      rating: 4.9
    }
  ];

  // Fixed variants with proper TypeScript typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

   

  return (
    <section className="py-20 bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-fedex-purple/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-fedex-orange/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
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
            <span className="text-sm font-semibold text-fedex-purple uppercase tracking-wide">
              Shipping Solutions
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Comprehensive
            <span className="text-fedex-purple"> Shipping </span>
            Solutions
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            From overnight letters to heavyweight freight, FedEx offers a complete range of 
            shipping services tailored to meet your business and personal delivery needs with reliability and speed.
          </motion.p>
        </motion.div>

        {/* Enhanced Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden group ${
                hoveredService && hoveredService !== service.id ? 'opacity-75 scale-95' : 'opacity-100 scale-100'
              } ${selectedService === service.id ? 'ring-2 ring-fedex-purple ring-opacity-50' : ''}`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              onClick={() => setSelectedService(service.id === selectedService ? null : service.id)}
            //   variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="rest"
            >
              {/* Popular Badge */}
              {service.popular && (
                <motion.div
                  className="absolute top-4 right-4 z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="px-3 py-1 bg-linear-to-r from-fedex-orange to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center">
                    <FiStar className="w-3 h-3 mr-1" />
                    MOST POPULAR
                  </span>
                </motion.div>
              )}

              {/* Rating */}
              {service.rating && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-white font-semibold">{service.rating}</span>
                  </div>
                </div>
              )}

              {/* Service Header */}
              <div className={`relative h-32 bg-linear-to-r ${service.color} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 p-6 h-full flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <service.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{service.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-white/80 text-sm">{service.price}</span>
                        <span className="text-white/60 text-sm">•</span>
                        <span className="text-white/80 text-sm">{service.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated background element */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>

              {/* Service Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * featureIndex }}
                    >
                      <div className="w-5 h-5 bg-fedex-purple/10 rounded-full flex items-center justify-center shrink-0">
                        <FiCheck className="w-3 h-3 text-fedex-purple" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    className="flex-1 bg-fedex-purple text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-purple-800 transition-colors flex items-center justify-center space-x-2 group/btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Get Quote</span>
                    <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.button
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Details
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Hover Effect Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent bg-linear-to-r from-fedex-purple to-fedex-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{
                  mask: 'linear-linear(#fff 0 0) content-box, linear-linear(#fff 0 0)',
                  WebkitMask: 'linear-linear(#fff 0 0) content-box, linear-linear(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                  padding: '2px'
                }}
              />
            </motion.div>
          ))}
        </motion.div>

          
      </div>
    </section>
  );
}