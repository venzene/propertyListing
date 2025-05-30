const Property = require('../models/property');

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 45;
    const skip = (page - 1) * limit;

    const [properties, totalCount] = await Promise.all([
      Property.find().skip(skip).limit(limit).lean(),
      Property.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.render('home/home', {
      properties,
      currentPage: page,
      totalPages,
      isAuthenticated: req.isAuthenticated || false
    });
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

