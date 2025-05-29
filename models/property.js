const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Apartment', 'Bungalow', 'Villa', 'Studio', 'Penthouse'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    areaSqFt: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    amenities: [{
        type: String
    }],
    furnished: {
        type: String,
        enum: ['Furnished', 'Unfurnished', 'Semi'],
        required: true
    },
    availableFrom: {
        type: Date,
        required: true
    },
    listedBy: {
        type: String,
        enum: ['Owner', 'Builder', 'Agent'],
        required: true
    },
    tags: [{
        type: String
    }],
    colorTheme: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    listingType: {
        type: String,
        enum: ['rent', 'sale'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
