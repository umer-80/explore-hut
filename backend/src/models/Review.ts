import mongoose, { Schema, Model } from 'mongoose';
import { IReview } from '../types';

const reviewSchema = new Schema<IReview>(
  {
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: 10,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
reviewSchema.index({ listing: 1, createdAt: -1 });
reviewSchema.index({ author: 1, listing: 1 }, { unique: true }); // One review per user per listing

// Calculate average rating for listing
reviewSchema.statics.calculateAverageRating = async function (listingId: string) {
  const stats = await this.aggregate([
    { $match: { listing: new mongoose.Types.ObjectId(listingId) } },
    {
      $group: {
        _id: '$listing',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return stats.length > 0 ? stats[0] : { averageRating: 0, totalReviews: 0 };
};

const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
