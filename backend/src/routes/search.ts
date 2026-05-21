import express, { Request, Response } from 'express';
import Listing from '../models/Listing';
import { cacheMiddleware } from '../middleware/cache';

const router = express.Router();

// @route   GET /api/search/nearby
// @desc    Search listings by geo-location using $geoNear aggregation
// @access  Public
// Query params: lng, lat, maxDistance (in meters, default 50000 = 50km), limit (default 20)
router.get('/nearby', cacheMiddleware(1800), async (req: Request, res: Response) => {
  try {
    const {
      lng,
      lat,
      maxDistance = 50000, // 50km default
      minDistance = 0,
      limit = 20,
    } = req.query;

    // Validate coordinates
    if (!lng || !lat) {
      res.status(400).json({
        success: false,
        message: 'Longitude (lng) and Latitude (lat) are required',
      });
      return;
    }

    const longitude = parseFloat(lng as string);
    const latitude = parseFloat(lat as string);
    const maxDistanceMeters = parseFloat(maxDistance as string);
    const minDistanceMeters = parseFloat(minDistance as string);
    const limitNum = parseInt(limit as string);

    if (
      isNaN(longitude) ||
      isNaN(latitude) ||
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Longitude: -180 to 180, Latitude: -90 to 90',
      });
      return;
    }

    // Check if any listings have geoLocation data
    const listingsWithGeo = await Listing.countDocuments({ geoLocation: { $exists: true } });

    if (listingsWithGeo === 0) {
      // No geo-spatial data available, return message
      res.json({
        success: true,
        count: 0,
        message: 'No listings with geo-location data available yet. Geo-spatial search requires listings to have coordinates.',
        searchCenter: { longitude, latitude },
        maxDistance: maxDistanceMeters,
        listings: [],
      });
      return;
    }

    // $geoNear aggregation pipeline
    const listings = await Listing.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude], // [lng, lat] - correct order
          },
          distanceField: 'distance',
          maxDistance: maxDistanceMeters,
          minDistance: minDistanceMeters,
          spherical: true,
          key: 'geoLocation', // Use geoLocation field
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: '$owner',
      },
      {
        $project: {
          title: 1,
          description: 1,
          image: 1,
          price: 1,
          location: 1,
          geoLocation: 1,
          country: 1,
          distance: 1,
          viewCount: 1,
          createdAt: 1,
          'owner._id': 1,
          'owner.username': 1,
        },
      },
      {
        $limit: limitNum,
      },
    ]);

    res.json({
      success: true,
      count: listings.length,
      searchCenter: { longitude, latitude },
      maxDistance: maxDistanceMeters,
      listings: listings.map((listing) => ({
        ...listing,
        distanceKm: (listing.distance / 1000).toFixed(2),
        distanceMiles: (listing.distance / 1609.34).toFixed(2),
      })),
    });
  } catch (error: any) {
    console.error('Geo-search error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/search/text
// @desc    Full-text search across title, description, city
// @access  Public
router.get('/text', cacheMiddleware(1800), async (req: Request, res: Response) => {
  try {
    const { q, limit = 20, minPrice, maxPrice } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Search query (q) is required',
      });
      return;
    }

    const query: any = {
      $text: { $search: q },
    };

    // Add price filters if provided
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
    }

    const listings = await Listing.find(query, {
      score: { $meta: 'textScore' },
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit as string))
      .populate('owner', 'username')
      .lean();

    res.json({
      success: true,
      count: listings.length,
      query: q,
      listings,
    });
  } catch (error: any) {
    console.error('Text search error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/search/advanced
// @desc    Advanced search with multiple filters
// @access  Public
router.get('/advanced', cacheMiddleware(1800), async (req: Request, res: Response) => {
  try {
    const {
      city,
      country,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      limit = 20,
      page = 1,
    } = req.query;

    const query: any = {};

    // Case-insensitive regex search for location and country
    if (city) query.location = new RegExp(city as string, 'i');
    if (country) query.country = new RegExp(country as string, 'i');

    // Price range filter with proper type casting
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = order === 'asc' ? 1 : -1;

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'username')
        .lean(),
      Listing.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: listings.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      filters: {
        city: city || null,
        country: country || null,
        minPrice: minPrice ? parseFloat(minPrice as string) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : null,
      },
      listings,
    });
  } catch (error: any) {
    console.error('Advanced search error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
