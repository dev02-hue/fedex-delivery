// components/Global/GlobalCoverageSection.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGlobe, 
  FiMapPin, 
  FiUsers, 
  FiTruck,
  FiAward,
  FiClock,
  FiSearch,
  FiChevronDown,
  FiPlay,
  FiPause
} from 'react-icons/fi';

interface Region {
  id: string;
  name: string;
  countries: number;
  facilities: number;
  color: string;
  icon: string;
}

interface Country {
  name: string;
  cities: number;
  hubs: number;
  delivery: string;
  flag: string;
}

interface GlobalStat {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  value: string;
  label: string;
}

export default function GlobalCoverageSection() {
  const [activeRegion, setActiveRegion] = useState('americas');
  const [selectedCountry, setSelectedCountry] = useState<string | null>('United States');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const regions: Region[] = [
    {
      id: 'americas',
      name: 'Americas',
      countries: 25,
      facilities: 1250,
      color: 'from-blue-500 to-purple-600',
      icon: '🌎'
    },
    {
      id: 'europe',
      name: 'Europe',
      countries: 44,
      facilities: 890,
      color: 'from-green-500 to-teal-600',
      icon: '🏛️'
    },
    {
      id: 'asia',
      name: 'Asia Pacific',
      countries: 38,
      facilities: 1100,
      color: 'from-orange-500 to-red-600',
      icon: '🗼'
    },
    {
      id: 'middleeast',
      name: 'Middle East & Africa',
      countries: 65,
      facilities: 720,
      color: 'from-yellow-500 to-orange-600',
      icon: '🏜️'
    }
  ];

  const countries: Record<string, Country[]> = {
    americas: [
      { name: 'United States', cities: 350, hubs: 12, delivery: '1-2 days', flag: '🇺🇸' },
      { name: 'Canada', cities: 85, hubs: 8, delivery: '2-3 days', flag: '🇨🇦' },
      { name: 'Brazil', cities: 45, hubs: 6, delivery: '3-5 days', flag: '🇧🇷' },
      { name: 'Mexico', cities: 38, hubs: 5, delivery: '2-4 days', flag: '🇲🇽' },
      { name: 'Argentina', cities: 22, hubs: 3, delivery: '4-6 days', flag: '🇦🇷' },
      { name: 'Chile', cities: 18, hubs: 2, delivery: '3-5 days', flag: '🇨🇱' }
    ],
    europe: [
      { name: 'United Kingdom', cities: 78, hubs: 9, delivery: '1-2 days', flag: '🇬🇧' },
      { name: 'Germany', cities: 92, hubs: 11, delivery: '1-2 days', flag: '🇩🇪' },
      { name: 'France', cities: 67, hubs: 8, delivery: '1-2 days', flag: '🇫🇷' },
      { name: 'Italy', cities: 45, hubs: 6, delivery: '2-3 days', flag: '🇮🇹' },
      { name: 'Spain', cities: 38, hubs: 5, delivery: '2-3 days', flag: '🇪🇸' },
      { name: 'Netherlands', cities: 25, hubs: 4, delivery: '1-2 days', flag: '🇳🇱' }
    ],
    asia: [
      { name: 'China', cities: 185, hubs: 15, delivery: '2-4 days', flag: '🇨🇳' },
      { name: 'Japan', cities: 78, hubs: 9, delivery: '1-2 days', flag: '🇯🇵' },
      { name: 'India', cities: 95, hubs: 11, delivery: '3-5 days', flag: '🇮🇳' },
      { name: 'Australia', cities: 42, hubs: 7, delivery: '2-3 days', flag: '🇦🇺' },
      { name: 'Singapore', cities: 15, hubs: 3, delivery: '1-2 days', flag: '🇸🇬' },
      { name: 'South Korea', cities: 28, hubs: 4, delivery: '1-2 days', flag: '🇰🇷' }
    ],
    middleeast: [
      { name: 'United Arab Emirates', cities: 12, hubs: 3, delivery: '2-3 days', flag: '🇦🇪' },
      { name: 'Saudi Arabia', cities: 18, hubs: 4, delivery: '3-4 days', flag: '🇸🇦' },
      { name: 'South Africa', cities: 25, hubs: 5, delivery: '3-5 days', flag: '🇿🇦' },
      { name: 'Egypt', cities: 15, hubs: 3, delivery: '4-6 days', flag: '🇪🇬' },
      { name: 'Turkey', cities: 32, hubs: 6, delivery: '2-4 days', flag: '🇹🇷' },
      { name: 'Israel', cities: 8, hubs: 2, delivery: '2-3 days', flag: '🇮🇱' }
    ]
  };

  const globalStats: GlobalStat[] = [
    { icon: FiGlobe, value: '220+', label: 'Countries & Territories' },
    { icon: FiMapPin, value: '4,500+', label: 'FedEx Locations' },
    { icon: FiTruck, value: '680+', label: 'Aircraft Fleet' },
    { icon: FiUsers, value: '500K+', label: 'Team Members Worldwide' }
  ];

  const currentRegion = regions.find(r => r.id === activeRegion);
  const currentCountries = countries[activeRegion] || [];
  const filteredCountries = currentCountries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-rotate regions
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setActiveRegion(current => {
          const regionsList = ['americas', 'europe', 'asia', 'middleeast'];
          const currentIndex = regionsList.indexOf(current);
          const nextIndex = (currentIndex + 1) % regionsList.length;
          return regionsList[nextIndex];
        });
      }, 3000);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying]);

  const getCountryStats = (countryName: string): Country | undefined => {
    const allCountries = Object.values(countries).flat();
    return allCountries.find(c => c.name === countryName);
  };

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const countryCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section className="py-20 bg-linear-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-fedex-purple/10 rounded-full blur-3xl"
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
          className="absolute bottom-10 right-10 w-80 h-80 bg-fedex-orange/10 rounded-full blur-3xl"
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
        {/* World Map Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234D148C' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
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
              Worldwide Network
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Global Reach,
            <span className="text-fedex-purple"> Local Expertise </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            With one of the world&apos;s most extensive logistics networks, we deliver to over 220 countries 
            and territories with the speed and reliability your business demands.
          </motion.p>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {globalStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 } 
              }}
            >
              <div className="w-16 h-16 bg-linear-to-r from-fedex-purple to-fedex-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Regions Navigation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Global Regions</h3>
                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <FiPause className="w-5 h-5 text-gray-700" />
                  ) : (
                    <FiPlay className="w-5 h-5 text-gray-700" />
                  )}
                </motion.button>
              </div>

              <div className="space-y-3">
                {regions.map((region) => (
                  <motion.button
                    key={region.id}
                    onClick={() => setActiveRegion(region.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl text-left transition-all border-2 ${
                      activeRegion === region.id
                        ? `bg-linear-to-r ${region.color} text-white shadow-lg border-transparent`
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl">{region.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{region.name}</div>
                      <div className={`text-xs mt-1 ${
                        activeRegion === region.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {region.countries} countries • {region.facilities} facilities
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: activeRegion === region.id ? 1 : 0 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Search */}
              <div className="mt-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple focus:border-transparent text-sm bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Map & Countries */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Map Header */}
              <div className={`bg-linear-to-r ${currentRegion?.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <FiGlobe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{currentRegion?.name}</h3>
                      <p className="text-white/80 text-sm mt-1">
                        {currentRegion?.countries} countries • {currentRegion?.facilities} facilities
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{currentRegion?.icon}</div>
                  </div>
                </div>
              </div>

              {/* Interactive Map Visualization */}
              <div className="p-6 border-b border-gray-200">
                <div className="bg-linear-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 relative overflow-hidden">
                  {/* Simplified World Map */}
                  <div className="relative h-48">
                    {/* Americas */}
                    <motion.div
                      className={`absolute left-10 top-1/4 w-16 h-16 rounded-full border-2 ${
                        activeRegion === 'americas' 
                          ? 'bg-blue-500/20 border-blue-500 shadow-lg' 
                          : 'bg-gray-300/30 border-gray-400'
                      }`}
                      animate={{
                        scale: activeRegion === 'americas' ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 2, repeat: activeRegion === 'americas' ? Infinity : 0 }}
                    />
                    
                    {/* Europe */}
                    <motion.div
                      className={`absolute left-1/3 top-1/3 w-12 h-12 rounded-full border-2 ${
                        activeRegion === 'europe' 
                          ? 'bg-green-500/20 border-green-500 shadow-lg' 
                          : 'bg-gray-300/30 border-gray-400'
                      }`}
                      animate={{
                        scale: activeRegion === 'europe' ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 2, repeat: activeRegion === 'europe' ? Infinity : 0 }}
                    />
                    
                    {/* Asia */}
                    <motion.div
                      className={`absolute right-1/3 top-2/5 w-20 h-20 rounded-full border-2 ${
                        activeRegion === 'asia' 
                          ? 'bg-orange-500/20 border-orange-500 shadow-lg' 
                          : 'bg-gray-300/30 border-gray-400'
                      }`}
                      animate={{
                        scale: activeRegion === 'asia' ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 2, repeat: activeRegion === 'asia' ? Infinity : 0 }}
                    />
                    
                    {/* Middle East & Africa */}
                    <motion.div
                      className={`absolute right-20 top-1/2 w-14 h-14 rounded-full border-2 ${
                        activeRegion === 'middleeast' 
                          ? 'bg-yellow-500/20 border-yellow-500 shadow-lg' 
                          : 'bg-gray-300/30 border-gray-400'
                      }`}
                      animate={{
                        scale: activeRegion === 'middleeast' ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 2, repeat: activeRegion === 'middleeast' ? Infinity : 0 }}
                    />

                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line 
                        x1="20%" y1="30%" 
                        x2="35%" y2="35%" 
                        stroke={activeRegion === 'americas' ? '#4D148C' : '#9CA3AF'} 
                        strokeWidth="2"
                        strokeDasharray="4"
                      />
                      <line 
                        x1="40%" y1="38%" 
                        x2="55%" y2="45%" 
                        stroke={activeRegion === 'europe' ? '#10B981' : '#9CA3AF'} 
                        strokeWidth="2"
                        strokeDasharray="4"
                      />
                      <line 
                        x1="60%" y1="50%" 
                        x2="70%" y2="52%" 
                        stroke={activeRegion === 'asia' ? '#F59E0B' : '#9CA3AF'} 
                        strokeWidth="2"
                        strokeDasharray="4"
                      />
                    </svg>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                      Active region: <span className="font-semibold text-fedex-purple">{currentRegion?.name}</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Click on regions to explore coverage details
                    </p>
                  </div>
                </div>
              </div>

              {/* Countries List */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Countries in {currentRegion?.name}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                  <AnimatePresence mode="popLayout">
                    {filteredCountries.map((country, index) => (
                      <motion.div
                        key={country.name}
                        // variants={countryCardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedCountry === country.name
                            ? 'border-fedex-purple bg-purple-50 shadow-md'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedCountry(country.name)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{country.flag}</span>
                            <h5 className="font-semibold text-gray-900">{country.name}</h5>
                          </div>
                          {selectedCountry === country.name && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-fedex-purple rounded-full"
                            />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-gray-600">
                            <div className="font-semibold">{country.cities}</div>
                            <div>Cities</div>
                          </div>
                          <div className="text-gray-600">
                            <div className="font-semibold">{country.hubs}</div>
                            <div>Hubs</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
                          <FiClock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600 font-medium">{country.delivery} delivery</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filteredCountries.length === 0 && (
                  <motion.div 
                    className="text-center py-8 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No countries found matching your search</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Selected Country Details */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{getCountryStats(selectedCountry)?.flag}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCountry}</h3>
                    <p className="text-gray-600">Detailed coverage information</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Standard Delivery</div>
                  <div className="text-lg font-bold text-fedex-purple">
                    {getCountryStats(selectedCountry)?.delivery}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-fedex-purple mb-2">
                    {getCountryStats(selectedCountry)?.cities}
                  </div>
                  <div className="text-gray-600 font-medium">Cities Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fedex-purple mb-2">
                    {getCountryStats(selectedCountry)?.hubs}
                  </div>
                  <div className="text-gray-600 font-medium">Distribution Hubs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fedex-purple mb-2">24/7</div>
                  <div className="text-gray-600 font-medium">Customer Support</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Services Available</h4>
                <div className="flex flex-wrap gap-2">
                  {['Express Delivery', 'Ground Shipping', 'Freight Services', 'Customs Clearance', 'Temperature Control', 'Same Day Delivery'].map((service) => (
                    <motion.span
                      key={service}
                      className="px-3 py-1 bg-linear-to-r from-fedex-purple/10 to-fedex-blue/10 text-fedex-purple rounded-full text-sm font-medium border border-fedex-purple/20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {service}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        
         
      </div>
    </section>
  );
}