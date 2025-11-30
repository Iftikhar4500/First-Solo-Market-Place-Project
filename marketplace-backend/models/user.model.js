// models/user.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['buyer', 'seller', 'admin'],
            default: 'buyer'
        },
        avatar: {
            type: String,
            required: false,
            default: '/uploads/avatars/default.png'
        },

        // --- THIS IS THE NEW FIELD ---
        isBanned: {
            type: Boolean,
            required: true,
            default: false // By default, no one is banned
        }
        // --- NEW FIELD END ---
    },
    {
        timestamps: true 
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;