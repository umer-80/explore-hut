import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ListingSkeleton } from '../components/SkeletonLoader';
import { 
  FiMapPin, 
  FiDollarSign, 
  FiUser, 
  FiTrendingUp, 
  FiZap,
  FiDatabase,
  FiActivity,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiCheckCircle
} from 'react-icons/fi';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [copiedCoord, setCopiedCoord] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data } = await axios.get('/api/listings');
      setListings(data.listings);
    } catch (error) {
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedCoord(label);
    toast.success(`${label} coordinates copied!`);
    setTimeout(() => setCopiedCoord(''), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
            >
              <FiTrendingUp className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                High-Performance Geospatial Engine
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold"
            >
              <span className="gradient-text">Explore Hub</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto font-medium"
            >
              A High-Performance Geospatial Rental Engine Built for Scale
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto"
            >
              This is a developer sandbox demonstrating real-world Redis caching, WebSockets for live updates, 
              and MongoDB 2dsphere geospatial indexing for location-based routing.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <div className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-all">
                <FiZap className="text-emerald-400" />
                <span className="text-sm text-slate-300">Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all">
                <FiMapPin className="text-cyan-400" />
                <span className="text-sm text-slate-300">Geo-spatial Search</span>
              </div>
              <div className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-all">
                <FiDatabase className="text-emerald-400" />
                <span className="text-sm text-slate-300">Redis Caching</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quick Start Testing Guide */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed right-4 top-24 z-50 w-96 max-w-[calc(100vw-2rem)]"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <FiZap className="text-slate-900 text-xl" />
              </div>
              <span className="text-lg font-bold gradient-text">Quick Start Testing Guide</span>
            </div>
            {showGuide ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
          </button>

          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 py-4 space-y-4 border-t border-slate-700"
              >
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-slate-900">1</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Click <span className="text-emerald-400 font-semibold">"Sign Up"</span> to create a temporary mock session
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-slate-900">2</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Open an <span className="text-cyan-400 font-semibold">Incognito window</span> side-by-side to watch the 
                      <span className="text-emerald-400 font-semibold"> "Live Viewers"</span> counter sync instantly via WebSockets
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-slate-900">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-300 mb-2">
                        Go to <span className="text-cyan-400 font-semibold">Nearby Search</span> and use these pre-verified coordinates:
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => copyToClipboard('33.90, 73.39', 'Murree')}
                          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-all group"
                        >
                          <div className="text-left">
                            <div className="text-xs text-emerald-400 font-semibold">Murree Region</div>
                            <div className="text-xs text-slate-400">Lat 33.90, Long 73.39 (30km)</div>
                          </div>
                          {copiedCoord === 'Murree' ? (
                            <FiCheckCircle className="text-emerald-400" />
                          ) : (
                            <FiCopy className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                          )}
                        </button>

                        <button
                          onClick={() => copyToClipboard('33.95, 73.45', 'Bhurban')}
                          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all group"
                        >
                          <div className="text-left">
                            <div className="text-xs text-cyan-400 font-semibold">Bhurban Region</div>
                            <div className="text-xs text-slate-400">Lat 33.95, Long 73.45 (5km)</div>
                          </div>
                          {copiedCoord === 'Bhurban' ? (
                            <FiCheckCircle className="text-cyan-400" />
                          ) : (
                            <FiCopy className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  to="/search"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-semibold rounded-lg text-center hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                >
                  Start Testing Now →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">Featured Listings</h2>
          <p className="text-slate-400 text-lg">
            Explore {listings.length} amazing properties
          </p>
        </motion.div>

        {loading ? (
          <ListingSkeleton count={6} />
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 mb-6">
              <FiMapPin className="text-5xl text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-3">No Listings Yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Be the first to add a property! Click "Add Listing" to get started.
            </p>
            <Link
              to="/create-listing"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              <span>Add Your First Listing</span>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {listings.map((listing) => (
              <motion.div key={listing._id} variants={itemVariants}>
                <Link
                  to={`/listings/${listing._id}`}
                  className="block group"
                >
                  <div className="bg-slate-900/50 backdrop-blur-sm border-2 border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                    <div className="aspect-video bg-slate-800 overflow-hidden relative">
                      {listing.image?.url ? (
                        <img
                          src={listing.image.url}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiMapPin className="text-6xl text-slate-700" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 px-3 py-1 bg-slate-900/90 backdrop-blur-sm rounded-full border border-emerald-500/30">
                        <span className="text-sm font-semibold text-emerald-400">
                          ${listing.price}/night
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {listing.title}
                      </h3>

                      <div className="flex items-center space-x-2 text-slate-400">
                        <FiMapPin className="text-cyan-400 flex-shrink-0" />
                        <span className="text-sm truncate">{listing.location}</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center space-x-2">
                          <FiUser className="text-slate-500" />
                          <span className="text-sm text-slate-400">
                            {listing.owner?.username || 'Unknown'}
                          </span>
                        </div>
                        <div className="text-sm text-emerald-400 font-semibold">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Architect's Telemetry Panel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="border-t border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-3">Architect's Telemetry</h2>
            <p className="text-slate-400">System Performance Dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-6 bg-slate-900/50 backdrop-blur-sm border-2 border-emerald-500/30 rounded-2xl hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <FiDatabase className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-emerald-400">Data Layer</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                MongoDB 2D-Sphere Spatial Indexing for dynamic radius metrics and geospatial queries
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-6 bg-slate-900/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-2xl hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center">
                  <FiZap className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-cyan-400">Latency Optimization</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                In-Memory Redis Caching handling repetitive search pipelines with 20x performance boost
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-6 bg-slate-900/50 backdrop-blur-sm border-2 border-emerald-500/30 rounded-2xl hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <FiActivity className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-emerald-400">State Sync</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Socket.io bidirectional channels pumping live traffic metrics and real-time viewer counts
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
