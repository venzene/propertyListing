const Property = require('../models/property');

exports.getfilter = (req, res, next) => {
  res.render('home/filter', {
    path: '/filter',
    pageTitle: 'Filter Properties',
    errorMessage: null,
    validationErrors: [],
    isAuthenticated: req.isAuthenticated || false,
  });
};

exports.filterProperties = async (req, res) => {
  try {
    const query = {};

    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.state) {
      query.state = req.query.state;
    }

    if (req.query.city) {
      query.city = req.query.city;
    }

    if (req.query.furnished) {
      query.furnished = req.query.furnished;
    }

    if (req.query.listedBy) {
      query.listedBy = req.query.listedBy;
    }

    if (req.query.listingType) {
      query.listingType = req.query.listingType;
    }

    if (req.query.colorTheme) {
      query.colorTheme = req.query.colorTheme;
    }

    // Range-based filters
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.minArea || req.query.maxArea) {
      query.areaSqFt = {};
      if (req.query.minArea) query.areaSqFt.$gte = Number(req.query.minArea);
      if (req.query.maxArea) query.areaSqFt.$lte = Number(req.query.maxArea);
    }

    if (req.query.minBedrooms || req.query.maxBedrooms) {
      query.bedrooms = {};
      if (req.query.minBedrooms) query.bedrooms.$gte = Number(req.query.minBedrooms);
      if (req.query.maxBedrooms) query.bedrooms.$lte = Number(req.query.maxBedrooms);
    }

    if (req.query.minBathrooms || req.query.maxBathrooms) {
      query.bathrooms = {};
      if (req.query.minBathrooms) query.bathrooms.$gte = Number(req.query.minBathrooms);
      if (req.query.maxBathrooms) query.bathrooms.$lte = Number(req.query.maxBathrooms);
    }

    if (req.query.availableFrom) {
      query.availableFrom = { $gte: new Date(req.query.availableFrom) };
    }

    if (req.query.minRating || req.query.maxRating) {
      query.rating = {};
      if (req.query.minRating) query.rating.$gte = Number(req.query.minRating);
      if (req.query.maxRating) query.rating.$lte = Number(req.query.maxRating);
    }

    if (req.query.isVerified) {
      query.isVerified = req.query.isVerified === 'true';
    }

    if (req.query.amenities) {
      const amenitiesArray = req.query.amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    if (req.query.tags) {
      const tagsArray = req.query.tags.split(',');
      query.tags = { $all: tagsArray };
    }

    const properties = await Property.find(query).populate('userId', 'email');
    res.render('home/home', { properties, isAuthenticated: req.isAuthenticated || false });
  } catch (err) {
    res.status(500).json({ message: 'Error filtering properties', error: err.message });
  }
};
