// routes/user.routes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { authGuard } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// --- Multer Setup (Only For Avatar) ---
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/avatars/');
    },
    filename(req, file, cb) {
        cb(null, `user-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(req, file, cb) {
    if (!file.originalname) { return cb(null, true); } // ignore Text fields
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Error: You can Upload only! (jpg, jpeg, png)'));
    }
}
const upload = multer({ storage: storage, fileFilter: checkFileType });
// --- Multer Setup Finish ---


// ----- ROUTE 1: Only Update Profile Picture -----
// 'A1' separate route
// URL: PUT /api/users/profile/avatar
router.put('/profile/avatar', [authGuard, upload.single('avatar')], async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'file not uploaded' });
        }

        user.avatar = `/${req.file.path.replace(/\\/g, "/")}`;
        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar
        });
    } catch (error) {
        console.error('Issue in Avatar update:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// ----- ROUTE 2: Only Details (Name/Email) Update with (Password) -----
// It's SECURE Now
// URL: PUT /api/users/profile/details
router.put('/profile/details', authGuard, async (req, res) => {
    try {
        const { username, email, currentPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // 1. Password check (very Important)
        if (!currentPassword) {
            return res.status(400).json({ message: 'For any Details Update Current Password Compalsory' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is Wrong!' });
        }

        // 2. Email check (if email changed)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already Registered' });
            }
            user.email = email;
        }

        // 3. Update
        user.username = username || user.username;
        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar
        });

    } catch (error) {
        console.error('Error in Profile details update:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// ----- ROUTE 3: Only Password Update -----
// URL: PUT /api/users/profile/password
router.put('/profile/password', authGuard, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. Password check
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password, both are Require' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password wrong!' });
        }

        // 2. Naya password save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password has been updated!' });

    } catch (error) {
        console.error('Error in Password update:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;