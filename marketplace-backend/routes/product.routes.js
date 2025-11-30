// routes/product.routes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const Order = require('../models/order.model'); // For checking reviews
const { authGuard, sellerGuard } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// --- Multer Setup (File Upload) ---
const storage = multer.diskStorage({
    destination(req, file, cb) { cb(null, 'uploads/'); },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(req, file, cb) { 
    if (!file.originalname) { 
        return cb(null, true); // Pass non-file fields
    }
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) { 
        return cb(null, true); // Correct file type
    } else { 
        cb(new Error('Error: Images Only!')); // Incorrect file type
    }
}
const upload = multer({ storage: storage, fileFilter: checkFileType });
// --- Multer Setup End ---


// @route   POST /api/products/
// @desc    Create a new product
// @access  Private/Seller
router.post('/', [authGuard, sellerGuard, upload.single('image')], async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const imageUrl = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : '';
        if (!req.file) { 
            return res.status(400).json({ message: 'Image file is required' }); 
        }
        const newProduct = new Product({
            name, description, price, stock, imageUrl, 
            seller: req.user._id,
            rating: 0,
            numReviews: 0
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/products/
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => { 
    try {
        const products = await Product.find({}).populate('seller', 'username email');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/products/myproducts
// @desc    Get logged in seller's own products
// @access  Private/Seller
router.get('/myproducts', [authGuard, sellerGuard], async (req, res) => { 
    try {
        const products = await Product.find({ seller: req.user._id });
        if (!products) { return res.status(404).json({ message: 'No products found' }); }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching seller products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/products/:id
// @desc    Get a single product by its ID
// @access  Public
router.get('/:id', async (req, res) => { 
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'username');
        if (!product) { return res.status(404).json({ message: 'Product not found' }); }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching single product:', error); 
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Seller
router.put('/:id', [authGuard, sellerGuard, upload.single('image')], async (req, res) => { 
    try {
        const { name, description, price, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) { return res.status(404).json({ message: 'Product not found' }); }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        let imageUrl = product.imageUrl;
        if (req.file) { imageUrl = `/${req.file.path.replace(/\\/g, "/")}`; }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.imageUrl = imageUrl;
        product.stock = stock;
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Seller
router.delete('/:id', [authGuard, sellerGuard], async (req, res) => { 
    try {
        const product = await Product.findById(req.params.id);
        if (!product) { return res.status(404).json({ message: 'Product not found' }); }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await Product.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   POST /api/products/:id/reviews
// @desc    Create a new review for a product
// @access  Private (Logged-in users only)
router.post('/:id/reviews', authGuard, async (req, res) => {
    const { rating, comment } = req.body;
    
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // --- "A1" SECURITY CHECK FIX ---
        // 1. Check if the user is the SELLER of this product
        if (product.seller.toString() === req.user._id.toString()) {
            return res.status(403).json({ message: 'You cannot review your own product' });
        }
        // --- FIX END ---

        // 2. Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // 3. Check if this user has actually PURCHASED and RECEIVED this product
        const userOrders = await Order.find({ 
            user: req.user._id, 
            isDelivered: true, 
            'orderItems.product': req.params.id
        });

        if (userOrders.length === 0) {
            return res.status(403).json({ message: 'You must purchase and receive this product to review it' });
        }

        // Create the new review object
        const review = {
            name: req.user.username,
            rating: Number(rating),
            comment: comment,
            user: req.user._id
        };

        product.reviews.push(review);

        // Update the average rating and number of reviews
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added successfully' });

    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;