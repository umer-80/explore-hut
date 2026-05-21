import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaDollarSign, FaGlobe } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchType, setSearchType] = useState('text'); // 'text', 'nearby', 'advanced'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // Text search state
  const [textQuery, setTextQuery] = useState('');

  // Geo search state
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [maxDistance, setMaxDistance] = useState('50');

  // Advanced search state
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleTextSearch = async (e) => {
    e.preventDefault();
    if (!textQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:5000/api/search/text?q=${encodeURIComponent(textQuery)}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setResults(data.listings);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeoSearch = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setError('Please enter both latitude and longitude');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert km to meters (multiply by 1000)
      const maxDistanceMeters = parseFloat(maxDistance) * 1000;
      
      const response = await fetch(
        `http://localhost:5000/api/search/nearby?lat=${parseFloat(latitude)}&lng=${parseFloat(
          longitude
        )}&maxDistance=${maxDistanceMeters}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setResults(data.listings);
        if (data.message) {
          setError(data.message); // Show info message if no geo data
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Geo-search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (location) params.append('city', location);
      if (country) params.append('country', country);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('limit', '20');

      const response = await fetch(`http://localhost:5000/api/search/advanced?${params}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.listings);
        if (data.count === 0) {
          setError('No listings found matching your criteria. Try different filters.');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Advanced search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
        },
        (error) => {
          setError('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
            Advanced Search
          </h1>
          <p className="text-slate-400 text-lg">
            Find your perfect stay with powerful search options
          </p>
        </div>

        {/* Search Type Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {['text', 'nearby', 'advanced'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setSearchType(type);
                setResults([]);
                setError('');
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                searchType === type
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {type === 'text' && 'Text Search'}
              {type === 'nearby' && 'Nearby Search'}
              {type === 'advanced' && 'Advanced Filters'}
            </button>
          ))}
        </div>

        {/* Search Forms */}
        <motion.div
          key={searchType}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 mb-8"
        >
          {/* Text Search */}
          {searchType === 'text' && (
            <form onSubmit={handleTextSearch}>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    placeholder="Search by title, description, or location..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          )}

          {/* Nearby Search */}
          {searchType === 'nearby' && (
            <form onSubmit={handleGeoSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Latitude"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Longitude"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                    placeholder="Max Distance (km)"
                    className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-6 py-3 bg-slate-800 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all"
                >
                  Use My Location
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search Nearby'}
                </button>
              </div>
            </form>
          )}

          {/* Advanced Search */}
          {searchType === 'advanced' && (
            <form onSubmit={handleAdvancedSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location/City"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min Price"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max Price"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Apply Filters'}
              </button>
            </form>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Found {results.length} {results.length === 1 ? 'result' : 'results'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/listings/${listing._id}`}
                    className="block bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500 transition-all group"
                  >
                    <div className="aspect-video bg-slate-800 overflow-hidden">
                      {listing.image?.url ? (
                        <img
                          src={listing.image.url}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-2 truncate">
                        {listing.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-bold">
                          ${listing.price}/night
                        </span>
                        {listing.distanceKm && (
                          <span className="text-cyan-400 text-sm">
                            {listing.distanceKm} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && (textQuery || latitude || location) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 mb-6">
              <FiMapPin className="text-5xl text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-3">No Properties Found</h3>
            <p className="text-slate-400 mb-2 max-w-md mx-auto">
              No properties found within this radius.
            </p>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              Try expanding your kilometer range or copying our sample coordinates from the Testing Guide on the home page!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-all"
              >
                <span>View Testing Guide</span>
              </Link>
              <button
                onClick={() => {
                  setResults([]);
                  setError('');
                  setTextQuery('');
                  setLatitude('');
                  setLongitude('');
                  setLocation('');
                  setCountry('');
                  setMinPrice('');
                  setMaxPrice('');
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                <span>Clear & Try Again</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Search;
