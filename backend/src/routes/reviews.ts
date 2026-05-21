import express, { Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { clearCachePattern } from '../config/redis';
import { createReviewSchema } from '../validators/schemas';
import Review from '../models/Review';
import Listing from '../models/Listing';
import { AuthRequest } from '../types';

const router = express.Router();

// @route   POST /api/reviews/:listingId
// @desc    Add review to listing
// @access  Private
router.post(
  '/:listingId',
  protect,
  validate(createReviewSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { rating, comment } = req.body;
      const listingId = req.params.listingId;

      const listing = await Listing.findById(listingId);
      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      const review = await Review.create({
        rating,
        comment,
        author: req.user!._id,
        listing: listingId,
      });

      listing.reviews.push(review._id.toString());
      await listing.save();

      await review.populate('author', 'username');

      // Clear cache
      await clearCachePattern(`cache:/api/listings/${listingId}*`);

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        review,
      });
    } catch (error: any) {
      console.error('Add review error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete review
// @access  Private (Author only)
router.delete('/:reviewId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    // Check if user is the author
    if (review.author.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    // Remove review from listing
    await Listing.findByIdAndUpdate(review.listing, {
      $pull: { reviews: review._id },
    });

    await review.deleteOne();

    // Clear cache
    await clearCachePattern(`cache:/api/listings/${review.listing}*`);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
