import express, { Request, Response } from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { cacheMiddleware } from '../middleware/cache';
import { clearCachePattern } from '../config/redis';
import { createListingSchema, updateListingSchema } from '../validators/schemas';
import Listing from '../models/Listing';
import { AuthRequest } from '../types';

const router = express.Router();
const upload = multer({ storage });

// @route   GET /api/listings
// @desc    Get all listings
// @access  Public
router.get('/', cacheMiddleware(3600), async (_req: Request, res: Response) => {
  try {
    const listings = await Listing.find()
      .populate('owner', 'username')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, listings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', cacheMiddleware(1800), async (req: Request, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'username email')
      .populate({
        path: 'reviews',
        populate: { path: 'author', select: 'username' },
      });

    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }

    res.json({ success: true, listing });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private
router.post(
  '/',
  protect,
  upload.single('image'),
  validate(createListingSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, price, location, country, latitude, longitude } = req.body;

      const listingData: any = {
        title,
        description,
        price,
        location,
        country,
        owner: req.user!._id,
      };

      // Add geo-location if coordinates are provided
      if (latitude && longitude) {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          listingData.geoLocation = {
            type: 'Point',
            coordinates: [lng, lat], // [longitude, latitude]
          };
        }
      }

      if (req.file) {
        listingData.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      }

      const listing = await Listing.create(listingData);
      await listing.populate('owner', 'username');

      // Clear cache
      await clearCachePattern('cache:/api/listings*');

      res.status(201).json({
        success: true,
        message: 'Listing created successfully',
        listing,
      });
    } catch (error: any) {
      console.error('Create listing error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private (Owner only)
router.put(
  '/:id',
  protect,
  upload.single('image'),
  validate(updateListingSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      // Check ownership
      if (listing.owner.toString() !== req.user!._id.toString()) {
        res.status(403).json({ success: false, message: 'Not authorized' });
        return;
      }

      const { title, description, price, location, country, latitude, longitude } = req.body;
      listing.title = title;
      listing.description = description;
      listing.price = price;
      listing.location = location;
      listing.country = country;

      // Update geo-location if coordinates are provided
      if (latitude && longitude) {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          listing.geoLocation = {
            type: 'Point',
            coordinates: [lng, lat], // [longitude, latitude]
          };
        }
      } else if (latitude === '' && longitude === '') {
        // Clear geo-location if both fields are empty
        listing.geoLocation = undefined;
      }

      if (req.file) {
        listing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      }

      await listing.save();
      await listing.populate('owner', 'username');

      // Clear cache
      await clearCachePattern('cache:/api/listings*');

      res.json({
        success: true,
        message: 'Listing updated successfully',
        listing,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private (Owner only)
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }

    // Check ownership
    if (listing.owner.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    await listing.deleteOne();

    // Clear cache
    await clearCachePattern('cache:/api/listings*');

    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
