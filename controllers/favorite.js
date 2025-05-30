const User = require('../models/user');
const Property = require('../models/property');
const redisClient = require('../config/redis'); // Make sure your Redis client is correctly set up

// Add to Favorites
exports.addToFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.render('auth/onboard');

    const property = await Property.findById(req.params.propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const exists = user.favorite.items.some(item => item.propertyId.toString() === property._id.toString());

    if (!exists) {
      user.favorite.items.push({ propertyId: property._id });
      await user.save();
      await redisClient.del(`user:${req.userId}:favorites`); // Invalidate cache
    }

    res.redirect('/admin/fav');
  } catch (err) {
    res.status(500).json({ message: 'Failed to add favorite', error: err.message });
  }
};

// Remove from Favorites
exports.removeFromFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.render('auth/onboard');

    const propertyId = req.params.propertyId;
    user.favorite.items = user.favorite.items.filter(item => item.propertyId.toString() !== propertyId);
    await user.save();
    await redisClient.del(`user:${req.userId}:favorites`); // Invalidate cache

    res.redirect('/admin/fav');
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite', error: err.message });
  }
};

// Get Favorites with Redis Caching
exports.getFavorites = async (req, res) => {
  try {
    const cacheKey = `user:${req.userId}:favorites`;

    // Try fetching from Redis
    const cachedFavorites = await redisClient.get(cacheKey);
    if (cachedFavorites) {
      let favoriteProperties = JSON.parse(cachedFavorites);

      // Convert availableFrom back to Date object
      favoriteProperties = favoriteProperties.map(p => ({
        ...p,
        availableFrom: new Date(p.availableFrom)
      }));

      return res.render('favourite/favourite', {
        favoriteProperties,
        isAuthenticated: req.isAuthenticated || false
      });
    }

    // If not found in Redis, fetch from DB
    const user = await User.findById(req.userId).populate('favorite.items.propertyId');
    if (!user) return res.render('auth/onboard');

    const favoriteProperties = user.favorite.items.map(item => item.propertyId);

    // Cache the result in Redis (as plain objects)
    await redisClient.set(
      cacheKey,
      JSON.stringify(favoriteProperties),
      { EX: 3600 } // 1 hour TTL
    );

    res.render('favourite/favourite', {
      favoriteProperties,
      isAuthenticated: req.isAuthenticated || false
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: err.message });
  }
};
