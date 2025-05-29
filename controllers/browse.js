const Property = require('../models/property');

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().lean();  // Use lean for better EJS compatibility
    res.render('home/home', { properties, isAuthenticated: req.isAuthenticated || false });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

