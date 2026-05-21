const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });
const { protect } = require("../middleware/auth");
const { validateListing } = require("../middleware/validation");
const Listing = require("../models/Listing");

// @route   GET /api/listings
// @desc    Get all listings
// @access  Public
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("owner", "username")
      .sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner", "username email")
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username" },
      });

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private
router.post("/", protect, upload.single("image"), validateListing, async (req, res) => {
  try {
    const { title, description, price, location, country } = req.body;

    const listingData = {
      title,
      description,
      price,
      location,
      country,
      owner: req.user._id,
    };

    if (req.file) {
      listingData.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    const listing = await Listing.create(listingData);
    await listing.populate("owner", "username");

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private (Owner only)
router.put("/:id", protect, upload.single("image"), validateListing, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check ownership
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { title, description, price, location, country } = req.body;
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();
    await listing.populate("owner", "username");

    res.json({
      success: true,
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private (Owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check ownership
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await listing.deleteOne();

    res.json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
