import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useListingViewers } from '../hooks/useSocket';
import { DetailsSkeleton } from '../components/SkeletonLoader';
import {
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiEdit,
  FiTrash2,
  FiStar,
  FiEye,
  FiMessageSquare,
} from 'react-icons/fi';

const ListingDetails = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const viewerCount = useListingViewers(id);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await axios.get(`/api/listings/${id}`);
      setListing(data.listing);
    } catch (error) {
      toast.error('Failed to fetch listing');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/listings/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success('Listing deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete listing');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`/api/reviews/${id}`, reviewData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setListing({ ...listing, reviews: [...listing.reviews, data.review] });
      setReviewData({ rating: 5, comment: '' });
      toast.success('Review added successfully! ⭐');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/reviews/${reviewId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setListing({
          ...listing,
          reviews: listing.reviews.filter((r) => r._id !== reviewId),
        });
        toast.success('Review deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  if (loading) return <DetailsSkeleton />;
  if (!listing) return null;

  const isOwner = user && listing.owner._id === user.id;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-96 rounded-2xl overflow-hidden mb-8 group"
        >
          {listing.image?.url ? (
            <img
              src={listing.image.url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <FiMapPin className="text-6xl text-slate-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          {/* Live Viewers Badge */}
          {viewerCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 glass rounded-full"
            >
              <FiEye className="text-emerald-400" />
              <span className="text-sm font-medium text-slate-100">
                {viewerCount} {viewerCount === 1 ? 'viewer' : 'viewers'}
              </span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </motion.div>
          )}
        </motion.div>

        {/* Header Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-100 mb-4">
                {listing.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-slate-400">
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-cyan-400" />
                  <span>{listing.location}, {listing.country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUser className="text-emerald-400" />
                  <span>Hosted by {listing.owner.username}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-4">
              <div className="text-right">
                <div className="flex items-center space-x-2 text-3xl font-bold gradient-text">
                  <FiDollarSign />
                  <span>{listing.price}</span>
                </div>
                <p className="text-slate-500">per night</p>
              </div>
              {isOwner && (
                <div className="flex gap-3">
                  <Link to={`/edit-listing/${id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <FiEdit />
                      <span>Edit</span>
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiTrash2 />
                    <span>Delete</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center space-x-2">
            <FiMessageSquare className="text-emerald-400" />
            <span>About this place</span>
          </h2>
          <p className="text-slate-300 leading-relaxed">{listing.description}</p>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-8"
        >
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center space-x-2">
            <FiStar className="text-yellow-400" />
            <span>Reviews ({listing.reviews.length})</span>
          </h2>

          {/* Add Review Form */}
          {user && !isOwner && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleReviewSubmit}
              className="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700"
            >
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                Leave a Review
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rating
                  </label>
                  <select
                    value={reviewData.rating}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, rating: Number(e.target.value) })
                    }
                    className="input"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {'⭐'.repeat(num)} ({num})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, comment: e.target.value })
                    }
                    rows="3"
                    required
                    className="textarea"
                    placeholder="Share your experience..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            <AnimatePresence>
              {listing.reviews.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-500 py-8"
                >
                  No reviews yet. Be the first to review!
                </motion.p>
              ) : (
                listing.reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-slate-800/50 rounded-xl border border-slate-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-slate-200">
                          {review.author.username}
                        </p>
                        <div className="text-yellow-400 text-sm">
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                      {user && review.author._id === user.id && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash2 />
                        </motion.button>
                      )}
                    </div>
                    <p className="text-slate-300">{review.comment}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ListingDetails;
