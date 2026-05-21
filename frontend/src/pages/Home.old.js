import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ListingSkeleton } from '../components/SkeletonLoader';
import { FiMapPin, FiDollarSign, FiUser, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

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
                Enterprise-Grade Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold"
            >
              <span className="gradient-text">Find Your Perfect Stay</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto"
            >
              Discover amazing places around the world with real-time updates and
              location-based search
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <div className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-slate-300">Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <FiMapPin className="text-cyan-400" />
                <span className="text-slate-300">Geo-spatial Search</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      </motion.section>

      {/* Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <ListingSkeleton />
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-slate-300 mb-2">
              No listings available yet
            </h3>
            <p className="text-slate-500 mb-6">
              Be the first to add a listing to our platform!
            </p>
            <Link to="/create-listing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Add First Listing
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-slate-100 mb-2">
                Featured Listings
              </h2>
              <p className="text-slate-400">
                Explore {listings.length} amazing {listings.length === 1 ? 'property' : 'properties'}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listings.map((listing) => (
                <motion.div key={listing._id} variants={itemVariants}>
                  <Link to={`/listings/${listing._id}`}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="card card-hover overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-800">
                        {listing.image?.url ? (
                          <img
                            src={listing.image.url}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <FiMapPin size={48} />
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {listing.title}
                        </h3>

                        <div className="flex items-center space-x-2 text-slate-400">
                          <FiMapPin className="text-cyan-400 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">
                            {listing.location}, {listing.country}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <FiDollarSign className="text-emerald-400" />
                            <span className="text-2xl font-bold gradient-text">
                              {listing.price}
                            </span>
                            <span className="text-sm text-slate-500">/ night</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-slate-500 pt-2 border-t border-slate-800">
                          <FiUser className="text-slate-600" />
                          <span>By {listing.owner?.username}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
