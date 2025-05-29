const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  favorite: {
    items: [
      {
        propertyId: {
          type: Schema.Types.ObjectId,
          ref: 'Property',
          required: true
        }
      }
    ]
  }
});

module.exports = mongoose.model('User', userSchema);
