// routes/admin.routes.js

const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const User = require('../models/user.model');
const { authGuard, adminGuard } = require('../middleware/auth.middleware');

// All routes here are protected by authGuard and adminGuard

// --- Order Routes (Existing) ---
// GET /api/admin/orders
router.get('/orders', [authGuard, adminGuard], async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id username email').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/orders/:id/deliver
router.put('/orders/:id/deliver', [authGuard, adminGuard], async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) { return res.status(404).json({ message: 'Order not found' }); }
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error marking as delivered:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/orders/:id/pay
router.put('/orders/:id/pay', [authGuard, adminGuard], async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) { return res.status(404).json({ message: 'Order not found' }); }
        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error marking as paid:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// --- End Order Routes ---


// --- User Routes (Updated with SUPER ADMIN check) ---

// GET /api/admin/users
router.get('/users', [authGuard, adminGuard], async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/users/:id/ban
router.put('/users/:id/ban', [authGuard, adminGuard], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) { return res.status(404).json({ message: 'User not found' }); }

        // --- NEW SUPER ADMIN SECURITY CHECK ---
        // Check if the user being banned is the Super Admin
        if (user.email === process.env.SUPER_ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Cannot ban the main owner (Super Admin)!' });
        }
        // --- END SECURITY CHECK ---

        // Prevent banning other admins
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot ban another administrator. Demote them first.' });
        }
        
        user.isBanned = true;
        await user.save();
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/users/:id/unban
router.put('/users/:id/unban', [authGuard, adminGuard], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) { return res.status(404).json({ message: 'User not found' }); }
        user.isBanned = false;
        await user.save();
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error unbanning user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// --- REPLACED 'PROMOTE' AND 'DEMOTE' WITH A SINGLE 'SET-ROLE' ROUTE ---

// @route   PUT /api/admin/users/:id/set-role
// @desc    Change the role of a user (Buyer, Seller, or Admin)
// @access  Private/Admin
router.put('/users/:id/set-role', [authGuard, adminGuard], async (req, res) => {
    try {
        const { role } = req.body; // Get the new role from the request body
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. Super Admin Security Check
        if (user.email === process.env.SUPER_ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Cannot change the role of the main owner (Super Admin)!' });
        }
        
        // 2. Self-Change Security Check
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Admin cannot change their own role' });
        }
        
        // 3. Validate the new role
        if (!['buyer', 'seller', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // 4. Set the new role
        user.role = role;
        await user.save();
        
        // Return all users so the frontend can update its list
        const users = await User.find({}).select('-password');
        res.status(200).json(users);

    } catch (error) {
        console.error('Error setting user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// --- NEW ROUTE END ---


module.exports = router;