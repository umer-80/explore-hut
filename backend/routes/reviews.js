const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validateReview } = require("../middleware/validation");
const Review = require("../models/Review");
const Listing = require("../models/Listing");

// @route   POST /api/reviews/:listingId
// @desc    Add review to listing
// @access  Private
router.post("/:listingId", protect, validateReview, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const listingId = req.params.listingId;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const review = await Review.create({
      rating,
      comment,
      author: req.user._id,
      listing: listingId,
    });

    listing.reviews.push(review._id);
    await listing.save();

    await review.populate("author", "username");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete review
// @access  Private (Author only)
router.delete("/:reviewId", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Check if user is the author
    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Remove review from listing
    await Listing.findByIdAndUpdate(review.listing, {
      $pull: { reviews: review._id },
    });

    await review.deleteOne();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
