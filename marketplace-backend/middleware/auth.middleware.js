// middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Guard 1: Checks if user is logged in
const authGuard = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header
            token = req.headers.authorization.split(' ')[1];
            
            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Check if the token's user ID is a valid format
            if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }

            // 4. Get user from DB and attach to request object
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or route handler

        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Guard 2: Checks if user is a Seller (or Admin)
const sellerGuard = (req, res, next) => {
    // This guard must run AFTER authGuard
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
        next(); // User is a seller or admin, proceed
    } else {
        res.status(403).json({ message: 'Access denied. Seller account required.' });
    }
};

// Guard 3: Checks if user is an Admin
const adminGuard = (req, res, next) => {
    // This guard must run AFTER authGuard
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

// Export all guards
module.exports = { authGuard, sellerGuard, adminGuard };