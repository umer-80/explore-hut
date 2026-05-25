"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Listing_1 = __importDefault(require("../models/Listing"));
const cache_1 = require("../middleware/cache");
const router = express_1.default.Router();
// @route   GET /api/search/nearby
// @desc    Search listings by geo-location using $geoNear aggregation
// @access  Public
// Query params: lng, lat, maxDistance (in meters, default 50000 = 50km), limit (default 20)
router.get('/nearby', (0, cache_1.cacheMiddleware)(1800), async (req, res) => {
    try {
        const { lng, lat, maxDistance = 50000, // 50km default
        minDistance = 0, limit = 20, } = req.query;
        // Validate coordinates
        if (!lng || !lat) {
            res.status(400).json({
                success: false,
                message: 'Longitude (lng) and Latitude (lat) are required',
            });
            return;
        }
        const longitude = parseFloat(lng);
        const latitude = parseFloat(lat);
        const maxDistanceMeters = parseFloat(maxDistance);
        const minDistanceMeters = parseFloat(minDistance);
        const limitNum = parseInt(limit);
        if (isNaN(longitude) ||
            isNaN(latitude) ||
            longitude < -180 ||
            longitude > 180 ||
            latitude < -90 ||
            latitude > 90) {
            res.status(400).json({
                success: false,
                message: 'Invalid coordinates. Longitude: -180 to 180, Latitude: -90 to 90',
            });
            return;
        }
        // Check if any listings have geoLocation data
        const listingsWithGeo = await Listing_1.default.countDocuments({ geoLocation: { $exists: true } });
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
        const listings = await Listing_1.default.aggregate([
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
    }
    catch (error) {
        console.error('Geo-search error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
// @route   GET /api/search/text
// @desc    Full-text search across title, description, city
// @access  Public
router.get('/text', (0, cache_1.cacheMiddleware)(1800), async (req, res) => {
    try {
        const { q, limit = 20, minPrice, maxPrice } = req.query;
        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: 'Search query (q) is required',
            });
            return;
        }
        const query = {
            $text: { $search: q },
        };
        // Add price filters if provided
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = parseFloat(minPrice);
            if (maxPrice)
                query.price.$lte = parseFloat(maxPrice);
        }
        const listings = await Listing_1.default.find(query, {
            score: { $meta: 'textScore' },
        })
            .sort({ score: { $meta: 'textScore' } })
            .limit(parseInt(limit))
            .populate('owner', 'username')
            .lean();
        res.json({
            success: true,
            count: listings.length,
            query: q,
            listings,
        });
    }
    catch (error) {
        console.error('Text search error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
// @route   GET /api/search/advanced
// @desc    Advanced search with multiple filters
// @access  Public
router.get('/advanced', (0, cache_1.cacheMiddleware)(1800), async (req, res) => {
    try {
        const { city, country, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc', limit = 20, page = 1, } = req.query;
        const query = {};
        // Case-insensitive regex search for location and country
        if (city)
            query.location = new RegExp(city, 'i');
        if (country)
            query.country = new RegExp(country, 'i');
        // Price range filter with proper type casting
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = parseFloat(minPrice);
            if (maxPrice)
                query.price.$lte = parseFloat(maxPrice);
        }
        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const skip = (pageNum - 1) * limitNum;
        const [listings, total] = await Promise.all([
            Listing_1.default.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .populate('owner', 'username')
                .lean(),
            Listing_1.default.countDocuments(query),
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
                minPrice: minPrice ? parseFloat(minPrice) : null,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            },
            listings,
        });
    }
    catch (error) {
        console.error('Advanced search error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=search.js.map