import mongoose, { Schema, Model } from 'mongoose';
import { IListing } from '../types';

const locationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coords: number[]) {
          return (
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 &&
            coords[1] >= -90 &&
            coords[1] <= 90
          );
        },
        message: 'Invalid coordinates format [longitude, latitude]',
      },
    },
  },
  { _id: false }
);

const listingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 5,
      maxlength: 100,
      index: 'text',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: 20,
      maxlength: 2000,
      index: 'text',
    },
    image: {
      url: String,
      filename: String,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
      max: 1000000,
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      index: true,
    },
    // Geo-spatial location (optional, for advanced search)
    geoLocation: {
      type: locationSchema,
      required: false,
      index: '2dsphere',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for common queries
listingSchema.index({ price: 1, createdAt: -1 });
listingSchema.index({ country: 1 });
listingSchema.index({ owner: 1, createdAt: -1 });
listingSchema.index({ viewCount: -1 });

// Text search index
listingSchema.index({ title: 'text', description: 'text', location: 'text' });

// Virtual for average rating
listingSchema.virtual('averageRating', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'listing',
  justOne: false,
});

// Delete associated reviews when listing is deleted
listingSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await mongoose.model('Review').deleteMany({ _id: { $in: doc.reviews } });
  }
});

// Increment view count method
listingSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  await this.save();
};

const Listing: Model<IListing> = mongoose.model<IListing>('Listing', listingSchema);

export default Listing;
