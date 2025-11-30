// models/product.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- NEW (We need a separate schema for reviews) ---
// This schema will be EMBEDDED inside the product
const reviewSchema = new Schema(
    {
        name: { type: String, required: true }, // User's name
        rating: { type: Number, required: true }, // 1-5 stars
        comment: { type: String, required: true }, // Written review
        user: { // Which user wrote this
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true // When was the review written
    }
);
// --- NEW SCHEMA END ---


// This is the main Product blueprint
const productSchema = new Schema(
    {
        // ... (name, description, price, imageUrl, stock, seller fields are already here) ...
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        imageUrl: {
            type: String,
            required: false 
        },
        stock: {
            type: Number,
            required: true,
            default: 1,
            min: 0
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // --- THESE ARE THE NEW FIELDS ---
        reviews: [reviewSchema], // An array of review objects
        
        rating: { // The average rating
            type: Number,
            required: true,
            default: 0
        },
        
        numReviews: { // How many reviews
            type: Number,
            required: true,
            default: 0
        }
        // --- NEW FIELDS END ---
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;