// routes/order.routes.js

const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { authGuard, sellerGuard } = require('../middleware/auth.middleware');

// @route   POST /api/orders/
// @desc    Create a new order
// @access  Private
router.post('/', authGuard, async (req, res) => {
    try {
        const {
            orderItems, shippingAddress, paymentMethod,
            itemsPrice, shippingPrice, totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = new Order({
            orderItems, user: req.user._id, shippingAddress, paymentMethod,
            itemsPrice, shippingPrice, totalPrice
        });

        const createdOrder = await order.save();

        // Update product stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.qty;
                await product.save();
            }
        }
        
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/orders/myorders
// @desc    Get logged in user's (Buyer's) orders
// @access  Private
router.get('/myorders', authGuard, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) { 
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// --- THIS IS THE UPDATED (FIXED) ROUTE ---
// @route   GET /api/orders/my-sales
// @desc    Get all orders that include the logged-in seller's products
// @access  Private/Seller
router.get('/my-sales', [authGuard, sellerGuard], async (req, res) => {
    try {
        // 1. Find all products that belong to this seller
        const sellerProducts = await Product.find({ seller: req.user._id });
        
        // 2. Get an array of just the product IDs (as strings for comparison)
        const sellerProductIds = sellerProducts.map(product => product._id.toString());

        // 3. Find all orders that contain any of these product IDs
        const orders = await Order.find({
            'orderItems.product': { $in: sellerProductIds }
        })
        .populate('user', 'username email')
        .sort({ createdAt: -1 });

        if (!orders) {
            return res.status(404).json({ message: 'No sales found' });
        }

        // --- "A1" SECURITY/PRIVACY FIX ---
        // 4. Filter order items to show ONLY the seller's own products
        const filteredOrders = orders.map(order => {
            // Filter the orderItems array
            const sellerItemsOnly = order.orderItems.filter(item => 
                sellerProductIds.includes(item.product.toString())
            );
            
            // Return a new order object with only the relevant items
            const orderObject = order.toObject(); // Convert Mongoose doc to plain object
            orderObject.orderItems = sellerItemsOnly; // Replace items with filtered list
            
            return orderObject;
        });
        // --- FIX END ---

        res.status(200).json(filteredOrders); // Send the new, filtered orders

    } catch (error) {
        console.error('Error fetching seller sales:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// --- ROUTE UPDATED ---


// @route   GET /api/orders/:id
// @desc    Get a single order by its ID (for Buyer or Admin)
// @access  Private
router.get('/:id', authGuard, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Access denied' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching single order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order (by the buyer)
// @access  Private
router.put('/:id/cancel', authGuard, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) { return res.status(404).json({ message: 'Order not found' }); }
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (order.isDelivered) {
            return res.status(400).json({ message: 'Cannot cancel a delivered order' });
        }
        if (order.isCancelled) {
             return res.status(400).json({ message: 'Order is already cancelled' });
        }
        order.isCancelled = true;
        order.cancelledAt = Date.now();
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.qty;
                await product.save();
            }
        }
        const updatedOrder = await order.save();
        res.status(200).json({ message: 'Order has been cancelled', order: updatedOrder });
    } catch (error) {
        console.error('Error cancelling order:', error); 
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   PUT /api/orders/:id/ship
// @desc    Mark an order as shipped (by Seller)
// @access  Private/Seller
router.put('/:id/ship', [authGuard, sellerGuard], async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Security Check: Ensure this seller has products in this order
        const sellerProducts = await Product.find({ seller: req.user._id });
        const sellerProductIds = sellerProducts.map(p => p._id.toString());
        
        const hasSellerProduct = order.orderItems.some(item => 
            sellerProductIds.includes(item.product.toString())
        );

        if (!hasSellerProduct) {
            return res.status(401).json({ message: 'Not authorized to update this order' });
        }
        
        order.isShipped = true;
        order.shippedAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);

    } catch (error) {
        console.error('Error marking as shipped:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;