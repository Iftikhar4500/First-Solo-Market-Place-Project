// server.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// --- Routes Imports ---
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
// --- THIS IS THE MISSING LINE ---
const adminRoutes = require('./routes/admin.routes');
// --- IMPORT ADDED ---

// Database Connection
const mongoString = process.env.MONGO_URI;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on('error', (error) => { console.error('Database connection error:', error); });
database.once('open', () => { console.log('Database connected!'); });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Static Folders (Public) ---
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/uploads/avatars', express.static(path.join(__dirname, '/uploads/avatars')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
// --- THIS IS THE MISSING LINE ---
app.use('/api/admin', adminRoutes); // Use the admin routes
// --- ROUTE ADDED ---

// Test route
app.get('/', (req, res) => {
    res.send('Backend Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});