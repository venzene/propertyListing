const User = require('../models/user');
const Property = require('../models/property');

exports.addToFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.render('auth/onboard');
    }
    const property = await Property.findById(req.params.propertyId);

    if (!property) return res.status(404).json({ message: 'Property not found' });

    const exists = user.favorite.items.some(item => item.propertyId.toString() === property._id.toString());

    if (!exists) {
      user.favorite.items.push({ propertyId: property._id });
      await user.save();
    }

    res.redirect('/admin/fav'); // Redirect to the browse page after adding to favorites
  } catch (err) {
    res.status(500).json({ message: 'Failed to add favorite', error: err.message });
  }
};

exports.removeFromFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const propertyId = req.params.propertyId;

    user.favorite.items = user.favorite.items.filter(item => item.propertyId.toString() !== propertyId);
    await user.save();

    res.redirect('/admin/fav'); // Redirect to the browse page after adding to favorites
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite', error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorite.items.propertyId');

    if (!user) {
      return res.render('auth/onboard');
    }

    const favoriteProperties = user.favorite.items.map(item => item.propertyId);

    res.render('favourite/favourite', { favoriteProperties, isAuthenticated: req.isAuthenticated || false });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: err.message });
  }
};