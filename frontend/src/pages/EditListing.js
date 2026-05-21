import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FormSkeleton } from '../components/SkeletonLoader';
import { 
  FiHome, 
  FiFileText, 
  FiDollarSign, 
  FiMapPin, 
  FiGlobe, 
  FiImage,
  FiSave 
} from 'react-icons/fi';

const EditListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    latitude: '',
    longitude: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await axios.get(`/api/listings/${id}`);
      const { title, description, price, location, country, image, geoLocation } = data.listing;
      setFormData({ 
        title, 
        description, 
        price, 
        location, 
        country,
        latitude: geoLocation?.coordinates?.[1] || '',
        longitude: geoLocation?.coordinates?.[0] || '',
      });
      if (image?.url) setImagePreview(image.url);
    } catch (error) {
      toast.error('Failed to fetch listing');
      navigate('/');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
          setGettingLocation(false);
          toast.success('Location detected! 📍');
        },
        (error) => {
          setGettingLocation(false);
          toast.error('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('country', formData.country);
    if (formData.latitude) data.append('latitude', formData.latitude);
    if (formData.longitude) data.append('longitude', formData.longitude);
    if (image) data.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/listings/${id}`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      toast.success('Listing updated successfully! ✨');
      navigate(`/listings/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <FormSkeleton />;

  return (
    <div className="min-h-screen pt-16 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-2xl mb-4">
            <FiSave className="text-3xl text-slate-900" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Edit Listing
          </h1>
          <p className="text-slate-400">
            Update your property details
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <FiHome className="text-emerald-400" />
                  <span>Property Title *</span>
                </div>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <FiFileText className="text-emerald-400" />
                  <span>Description *</span>
                </div>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="textarea"
              />
            </div>

            {/* Price and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="text-emerald-400" />
                    <span>Price per night *</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="text-cyan-400" />
                    <span>Location *</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <FiGlobe className="text-cyan-400" />
                  <span>Country *</span>
                </div>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Geo-Location Section (Optional) */}
            <div className="col-span-full">
              <div className="border-t border-slate-800 pt-6 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <FiMapPin className="text-emerald-400" />
                      <span>Geo-Location (Optional)</span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Add coordinates to enable nearby search for this listing
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    {gettingLocation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                        <span>Getting...</span>
                      </>
                    ) : (
                      <>
                        <FiMapPin />
                        <span>Use My Location</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="input"
                      placeholder="40.7128 (e.g., New York)"
                    />
                    <p className="text-xs text-slate-600 mt-1">Range: -90 to 90</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="input"
                      placeholder="-74.0060 (e.g., New York)"
                    />
                    <p className="text-xs text-slate-600 mt-1">Range: -180 to 180</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <FiImage className="text-emerald-400" />
                  <span>Update Image (optional)</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors bg-slate-800/50"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <FiImage className="mx-auto text-4xl text-slate-600 mb-2" />
                      <p className="text-sm text-slate-400">
                        Click to upload new image
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FiSave />
                  <span>Update Listing</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditListing;
