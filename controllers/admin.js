const Property = require('../models/property');

exports.getMyProperties = async (req, res) => {
  try {
    const myProperties = await Property.find({ userId: req.userId });
    res.render('admin/properties', { myProperties, isAuthenticated: req.isAuthenticated || false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCreateProperty = (req, res) => {
  res.render('admin/create', { isAuthenticated: req.isAuthenticated || false });
};

exports.createProperty = async (req, res) => {
  try {
    const randomId = Math.floor(100000 + Math.random() * 900000); // Generates 6-digit random number
    const propertyId = `PROP${randomId}`;

    const property = new Property({
      ...req.body,
      id: propertyId, // use 'id' field as in your schema
      userId: req.userId,
    });

    const saved = await property.save();
    res.redirect('/admin/myProperties'); // Redirect to the properties list after creation
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getEditProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, userId: req.userId });
    if (!property) return res.status(404).json({ message: 'Property not found or unauthorized' });
    res.render('admin/update', { property, isAuthenticated: req.isAuthenticated || false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const updated = await Property.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, 
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    res.redirect('/admin/myProperties'); // Redirect to the properties list after update
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Property not found' });
    res.redirect('/admin/myProperties'); // Redirect to the properties list after delete
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
