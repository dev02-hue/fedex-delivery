// components/Testimonials/TestimonialsSection.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiStar, 
  FiChevronLeft, 
  FiChevronRight,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX
} from 'react-icons/fi';
import { BsFillChatQuoteFill } from 'react-icons/bs';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  video: string;
  stats: Array<{ value: string; label: string }>;
}

interface Industry {
  name: string;
  count: number;
}

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [filter, setFilter] = useState('All');
  const carouselRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced testimonials data with video support
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      position: 'CEO, TechGadgets Inc.',
      company: 'E-commerce',
      image: '/lady.jpg',
      rating: 5,
      text: 'FedEx has transformed our shipping operations. Their real-time tracking and reliable delivery have helped us maintain 99.8% customer satisfaction. The integration with our e-commerce platform was seamless.',
      video: '/videos/testimonials/sarah-chen.mp4',
      stats: [
        { value: '45%', label: 'Cost Reduction' },
        { value: '99.8%', label: 'Satisfaction' },
        { value: '3.5x', label: 'Faster Shipping' }
      ]
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      position: 'Logistics Director, Global Pharma',
      company: 'Healthcare',
      image: '/christian-buehner-DItYlc26zVI-unsplash.jpg',
      rating: 5,
      text: 'The Cold Chain Solutions from FedEx have been game-changing for our temperature-sensitive pharmaceutical shipments. Their compliance expertise and real-time monitoring give us complete peace of mind.',
      video: '/videos/testimonials/marcus-rodriguez.mp4',
      stats: [
        { value: '100%', label: 'Compliance' },
        { value: '24/7', label: 'Monitoring' },
        { value: '50+', label: 'Countries' }
      ]
    },
    {
      id: 3,
      name: 'Emily Watson',
      position: 'Operations Manager, FashionForward',
      company: 'Retail',
      image: '/download-1.jpeg',
      rating: 5,
      text: 'As a growing fashion retailer, we needed a shipping partner that could scale with us. FedEx\'s flexible solutions and volume discounts have saved us over 30% on shipping costs while improving delivery times.',
      video: '/videos/testimonials/emily-watson.mp4',
      stats: [
        { value: '30%', label: 'Savings' },
        { value: '2-Day', label: 'Delivery' },
        { value: '10K+', label: 'Monthly Orders' }
      ]
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Founder, ArtisanCrafts',
      company: 'Handmade Goods',
      image: '/download-2.jpeg',
      rating: 5,
      text: 'The care FedEx takes with our fragile, handmade products is exceptional. Their specialized handling and insurance options let us ship with confidence worldwide. Customer feedback on delivery experience has been outstanding.',
      video: '/videos/testimonials/david-kim.mp4',
      stats: [
        { value: '0', label: 'Damaged Items' },
        { value: '48h', label: 'Global Delivery' },
        { value: '95%', label: 'Repeat Customers' }
      ]
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      position: 'Supply Chain VP, AutoParts Pro',
      company: 'Manufacturing',
      image: '/images.webp',
      rating: 5,
      text: 'FedEx Freight has revolutionized our parts distribution. Their reliable LTL services and advanced tracking help us maintain just-in-time inventory across 200+ locations. The cost savings have been substantial.',
      video: '/videos/testimonials/lisa-thompson.mp4',
      stats: [
        { value: '40%', label: 'Cost Save' },
        { value: '200+', label: 'Locations' },
        { value: '99.9%', label: 'On Time' }
      ]
    },
    {
      id: 6,
      name: 'James Wilson',
      position: 'E-commerce Director, BookWorld',
      company: 'Publishing',
      image: '/download-3.jpeg',
      rating: 5,
      text: 'The FedEx API integration has automated our entire shipping process. From label generation to tracking updates, everything is seamless. Our team can now focus on customer service instead of logistics.',
      video: '/videos/testimonials/james-wilson.mp4',
      stats: [
        { value: '70%', label: 'Time Saved' },
        { value: 'Auto', label: 'Tracking' },
        { value: '5-Star', label: 'Reviews' }
      ]
    }
  ];

  const industries: Industry[] = [
    { name: 'All', count: testimonials.length },
    { name: 'E-commerce', count: testimonials.filter(t => t.company === 'E-commerce').length },
    { name: 'Healthcare', count: testimonials.filter(t => t.company === 'Healthcare').length },
    { name: 'Retail', count: testimonials.filter(t => t.company === 'Retail').length },
    { name: 'Manufacturing', count: testimonials.filter(t => t.company === 'Manufacturing').length }
  ];

  const filteredTestimonials = filter === 'All' 
    ? testimonials 
    : testimonials.filter(t => t.company === filter);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setActiveTestimonial(current => (current + 1) % filteredTestimonials.length);
      }, 5000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, filteredTestimonials.length]);

  const nextTestimonial = () => {
    setActiveTestimonial(current => (current + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(current => 
      current === 0 ? filteredTestimonials.length - 1 : current - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setActiveTestimonial(index);
  };

  // Drag functionality for mobile
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragStart('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    const dragEnd = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart - dragEnd;

    if (Math.abs(diff) > 50) { // Minimum drag distance
      if (diff > 0) {
        nextTestimonial();
      } else {
        prevTestimonial();
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        <FiStar
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      </motion.div>
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 right-10 w-80 h-80 bg-fedex-purple/5 rounded-full blur-3xl"
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
          className="absolute bottom-10 left-10 w-96 h-96 bg-fedex-orange/5 rounded-full blur-3xl"
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
        {/* Quote Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20">
            <BsFillChatQuoteFill className="w-32 h-32 text-fedex-purple rotate-12" />
          </div>
          <div className="absolute bottom-20 right-20">
            <BsFillChatQuoteFill className="w-32 h-32 text-fedex-orange -rotate-12" />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
              Client Stories
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Trusted by
            <span className="text-fedex-purple"> Industry Leaders </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Discover how businesses across industries are achieving remarkable results 
            with FedEx&apos;s comprehensive shipping and logistics solutions.
          </motion.p>
        </motion.div>

        {/* Industry Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {industries.map((industry, index) => (
            <motion.button
              key={industry.name}
              onClick={() => {
                setFilter(industry.name);
                setActiveTestimonial(0);
              }}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all border-2 ${
                filter === industry.name
                  ? 'bg-fedex-purple text-white border-fedex-purple shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-fedex-purple hover:text-fedex-purple'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {industry.name} ({industry.count})
            </motion.button>
          ))}
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative">
          {/* Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <FiPause className="w-5 h-5 text-gray-700" />
                ) : (
                  <FiPlay className="w-5 h-5 text-gray-700" />
                )}
              </motion.button>

              <motion.button
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMuted ? (
                  <FiVolumeX className="w-5 h-5 text-gray-700" />
                ) : (
                  <FiVolume2 className="w-5 h-5 text-gray-700" />
                )}
              </motion.button>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiChevronLeft className="w-5 h-5 text-gray-700" />
              </motion.button>

              <motion.button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiChevronRight className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div 
            ref={carouselRef}
            className="relative"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <AnimatePresence mode="wait">
              {filteredTestimonials.length > 0 && (
                <motion.div
                  key={`${filter}-${activeTestimonial}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Testimonial Content */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center space-x-2 mb-6">
                        {renderStars(filteredTestimonials[activeTestimonial]?.rating || 5)}
                      </div>

                      <BsFillChatQuoteFill className="w-8 h-8 text-fedex-purple/30 mb-6" />

                      <blockquote className="text-2xl lg:text-3xl font-light text-gray-800 leading-relaxed mb-8">
                        &ldquo;{filteredTestimonials[activeTestimonial]?.text}&rdquo;
                      </blockquote>

                      <div className="flex items-center space-x-4 mb-8">
                        <div className="relative w-16 h-16 bg-linear-to-br from-fedex-purple to-fedex-blue rounded-2xl flex items-center justify-center overflow-hidden">
                          {/* Fallback to initials if image fails to load */}
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                            {getInitials(filteredTestimonials[activeTestimonial]?.name || '')}
                          </div>
                          <Image
                            src={filteredTestimonials[activeTestimonial]?.image || '/images/placeholder-avatar.jpg'}
                            alt={filteredTestimonials[activeTestimonial]?.name || 'Client'}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Hide the image if it fails to load, showing the initials fallback
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            {filteredTestimonials[activeTestimonial]?.name}
                          </div>
                          <div className="text-gray-600">
                            {filteredTestimonials[activeTestimonial]?.position}
                          </div>
                          <div className="text-fedex-purple font-semibold text-sm mt-1">
                            {filteredTestimonials[activeTestimonial]?.company}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                        {filteredTestimonials[activeTestimonial]?.stats.map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="text-center"
                          >
                            <div className="text-2xl font-bold text-fedex-purple mb-1">
                              {stat.value}
                            </div>
                            <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Video/Image Section */}
                    <div className="bg-linear-to-br from-gray-900 to-gray-800 relative min-h-96 lg:min-h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white p-8">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8 }}
                            className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20"
                          >
                            <FiPlay className="w-16 h-16 text-white" />
                          </motion.div>
                          <h3 className="text-2xl font-bold mb-2">Client Success Story</h3>
                          <p className="text-white/70">
                            Watch {filteredTestimonials[activeTestimonial]?.name}&apos;s full interview
                          </p>
                          <motion.button
                            className="mt-6 px-8 py-3 bg-fedex-orange text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Play Video
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Video Player Placeholder - Uncomment when videos are available */}
                      {/* 
                      <video
                        src={filteredTestimonials[activeTestimonial].video}
                        className="w-full h-full object-cover"
                        controls={!isMuted}
                        muted={isMuted}
                        autoPlay={isPlaying}
                      />
                      */}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {filteredTestimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeTestimonial
                    ? 'bg-fedex-purple w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional Mini Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all group"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>

              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 bg-linear-to-br from-fedex-purple to-fedex-blue rounded-xl flex items-center justify-center overflow-hidden">
                  {/* Fallback to initials */}
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                    {getInitials(testimonial.name)}
                  </div>
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-linear-to-r from-fedex-purple to-fedex-blue rounded-2xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Shipping?
              </h3>
              <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust FedEx for their logistics needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="px-8 py-4 bg-white text-fedex-purple rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px -10px rgba(255, 255, 255, 0.3)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Today
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Case Studies
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}