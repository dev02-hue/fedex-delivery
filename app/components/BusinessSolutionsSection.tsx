// components/Business/BusinessSolutionsSection.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiGlobe, 
  FiShield, 
 
  FiDatabase,
  FiBarChart,
  FiUsers,
  FiShoppingCart,
  FiCloud,
 
  FiCheck,
  FiPlay
} from 'react-icons/fi';

export default function BusinessSolutionsSection() {
  const [activeSolution, setActiveSolution] = useState('ecommerce');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const solutions = [
    {
      id: 'ecommerce',
      icon: FiShoppingCart,
      title: 'E-commerce Solutions',
      description: 'Streamline your online business shipping',
      color: 'from-purple-500 to-pink-600',
      features: [
        'Automated order processing',
        'Real-time inventory sync',
        'Multi-carrier integration',
        'Returns management'
      ]
    },
    {
      id: 'supplychain',
      icon: FiTrendingUp,
      title: 'Supply Chain',
      description: 'End-to-end logistics optimization',
      color: 'from-blue-500 to-cyan-600',
      features: [
        'Warehouse management',
        'Inventory optimization',
        'Demand forecasting',
        'Global distribution'
      ]
    },
    {
      id: 'international',
      icon: FiGlobe,
      title: 'International Trade',
      description: 'Global expansion made simple',
      color: 'from-green-500 to-teal-600',
      features: [
        'Customs clearance',
        'Duty & tax calculation',
        'Trade compliance',
        'Document automation'
      ]
    },
    {
      id: 'enterprise',
      icon: FiUsers,
      title: 'Enterprise Logistics',
      description: 'Scalable solutions for large businesses',
      color: 'from-orange-500 to-red-600',
      features: [
        'Dedicated account management',
        'Custom reporting',
        'API integration',
        'Volume discounts'
      ]
    }
  ];

  const caseStudies = [
    {
      company: 'TechGadgets Inc.',
      industry: 'E-commerce',
      challenge: 'Managing 10,000+ daily shipments across multiple carriers',
      solution: 'Implemented FedEx API integration with automated shipping rules',
      results: [
        { metric: '45%', label: 'Reduction in shipping costs' },
        { metric: '99.8%', label: 'On-time delivery rate' },
        { metric: '3.5x', label: 'Faster order processing' }
      ]
    },
    {
      company: 'Global Pharma Corp.',
      industry: 'Healthcare',
      challenge: 'Temperature-sensitive international shipments with strict compliance',
      solution: 'FedEx Cold Chain Solutions with real-time monitoring',
      results: [
        { metric: '100%', label: 'Compliance rate' },
        { metric: '24/7', label: 'Temperature monitoring' },
        { metric: '50+', label: 'Countries served' }
      ]
    }
  ];

  const features = [
    {
      icon: FiCloud,
      title: 'Cloud Integration',
      description: 'Seamless API integration with your existing systems',
      benefits: ['Real-time sync', 'Automated workflows', 'Scalable infrastructure']
    },
    {
      icon: FiBarChart,
      title: 'Advanced Analytics',
      description: 'Data-driven insights to optimize your shipping strategy',
      benefits: ['Cost analysis', 'Performance metrics', 'Trend forecasting']
    },
    {
      icon: FiShield,
      title: 'Enterprise Security',
      description: 'Bank-level security for your shipping data and transactions',
      benefits: ['Data encryption', 'Access controls', 'Audit trails']
    },
    {
      icon: FiDatabase,
      title: 'Centralized Management',
      description: 'Manage all your shipping operations from one platform',
      benefits: ['Multi-location support', 'User permissions', 'Bulk operations']
    }
  ];

  const currentSolution = solutions.find(s => s.id === activeSolution);

  return (
    <section className="py-20 bg-linear-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-fedex-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-fedex-orange/10 rounded-full blur-3xl"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[linear-linear(rgba(255,255,255,0.1)_1px,transparent_1px),linear-linear(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[64px_64px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-fedex-purple/20 border border-fedex-purple/30 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 bg-fedex-orange rounded-full mr-2"></span>
            <span className="text-sm font-semibold text-white">
              Enterprise Solutions
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Power Your Business
            <span className="text-fedex-orange"> Growth </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Scalable shipping and logistics solutions designed to drive efficiency, 
            reduce costs, and accelerate your business growth in today&apos;s competitive market.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Solutions Navigation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-6">Business Solutions</h3>
              <div className="space-y-3">
                {solutions.map((solution) => (
                  <motion.button
                    key={solution.id}
                    onClick={() => setActiveSolution(solution.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl text-left transition-all border ${
                      activeSolution === solution.id
                        ? 'bg-linear-to-r from-fedex-purple/20 to-fedex-blue/20 border-fedex-purple shadow-lg'
                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeSolution === solution.id 
                        ? 'bg-white text-fedex-purple' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      <solution.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{solution.title}</div>
                      <div className="text-gray-400 text-xs mt-1">{solution.description}</div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: activeSolution === solution.id ? 1 : 0 }}
                      className="w-2 h-2 bg-fedex-orange rounded-full"
                    />
                  </motion.button>
                ))}
              </div>

              {/* CTA Card */}
              <motion.div
                className="mt-6 p-4 bg-linear-to-r from-fedex-purple to-fedex-blue rounded-xl text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="font-bold text-sm mb-2">Ready to Transform Your Shipping?</h4>
                <p className="text-white/80 text-xs mb-3">
                  Speak with our business solutions experts
                </p>
                <motion.button
                  className="w-full bg-white text-fedex-purple py-2 px-4 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Sales
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Solution Details */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              {/* Solution Header */}
              <div className={`bg-linear-to-r ${currentSolution?.color} p-8 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      {currentSolution?.icon && (
                        <currentSolution.icon className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{currentSolution?.title}</h3>
                      <p className="text-white/80 mt-2">{currentSolution?.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSolution}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Features Grid */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-6">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentSolution?.features.map((feature, index) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 p-4 bg-gray-700/50 rounded-xl border border-gray-600"
                          >
                            <div className="w-8 h-8 bg-fedex-orange/20 rounded-lg flex items-center justify-center shrink-0">
                              <FiCheck className="w-4 h-4 text-fedex-orange" />
                            </div>
                            <span className="text-white text-sm font-medium">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Demo Video/Image */}
                    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
                      <div className="aspect-video bg-linear-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
                        {!videoPlaying ? (
                          <>
                            <div className="text-center">
                              <motion.button
                                onClick={() => setVideoPlaying(true)}
                                className="w-20 h-20 bg-fedex-orange rounded-full flex items-center justify-center shadow-2xl hover:bg-orange-600 transition-colors group"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiPlay className="w-8 h-8 text-white ml-1" />
                              </motion.button>
                              <p className="text-gray-400 mt-4 text-sm">
                                Watch {currentSolution?.title} in action
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 border-4 border-fedex-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                              <p className="text-gray-400">Loading demo video...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-6">Business Benefits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            title: 'Cost Reduction',
                            description: 'Optimize shipping spend with intelligent rate shopping',
                            impact: 'Save up to 35% on shipping costs'
                          },
                          {
                            title: 'Efficiency Gain',
                            description: 'Automate manual processes and reduce operational overhead',
                            impact: 'Reduce processing time by 70%'
                          },
                          {
                            title: 'Scalability',
                            description: 'Grow your shipping operations without infrastructure costs',
                            impact: 'Scale to 10,000+ shipments daily'
                          },
                          {
                            title: 'Customer Satisfaction',
                            description: 'Provide better delivery experiences and tracking',
                            impact: 'Improve delivery satisfaction by 45%'
                          }
                        ].map((benefit, index) => (
                          <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-colors"
                            onMouseEnter={() => setHoveredFeature(index)}
                            onMouseLeave={() => setHoveredFeature(null)}
                          >
                            <h5 className="font-bold text-white mb-2">{benefit.title}</h5>
                            <p className="text-gray-400 text-sm mb-3">{benefit.description}</p>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-fedex-orange rounded-full"></div>
                              <span className="text-fedex-orange text-sm font-semibold">
                                {benefit.impact}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Case Studies */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Success Stories</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See how businesses like yours are transforming their operations with FedEx solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-white">{study.company}</h4>
                    <span className="text-fedex-orange text-sm font-semibold">{study.industry}</span>
                  </div>
                  <div className="w-12 h-12 bg-fedex-purple/20 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-fedex-purple" />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h5 className="text-white font-semibold mb-2">Challenge</h5>
                    <p className="text-gray-400 text-sm">{study.challenge}</p>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold mb-2">Solution</h5>
                    <p className="text-gray-400 text-sm">{study.solution}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700">
                  {study.results.map((result, resultIndex) => (
                    <motion.div
                      key={result.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + resultIndex * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl font-bold text-fedex-orange mb-1">
                        {result.metric}
                      </div>
                      <div className="text-gray-400 text-xs">{result.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Technology</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built with the latest technology to ensure reliability, security, and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-fedex-purple/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-linear-to-r from-fedex-purple to-fedex-blue rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit ) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-fedex-orange rounded-full"></div>
                      <span className="text-gray-300 text-xs">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-linear-to-r from-fedex-purple to-fedex-blue rounded-2xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business Shipping?
              </h3>
              <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of businesses that trust FedEx for their logistics needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="px-8 py-4 bg-white text-fedex-purple rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -5px rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Custom Quote
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule Demo
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}