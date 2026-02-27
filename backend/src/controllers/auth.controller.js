const User = require('../models/User');
const redisClient = require('../config/redis');
const validator = require('validator');

// Helper to set cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateAuthToken();

    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Must be 'none' for cross-domain
        secure: process.env.NODE_ENV === 'production' // Must be true for 'none'
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user
        });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Custom validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, error: 'Invalid Email' });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                error: 'Password not strong enough (min 8 chars, 1 lowercase, 1 uppercase, 1 symbol)'
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("Register Error:", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Login Error:", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Logout user / Clear cookie & Blacklist token
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(200).json({ success: true, data: {} });
        }

        // Add to Redis blacklist (7 days TTL matches token expiry)
        await redisClient.set(`blacklist_${token}`, 'true', {
            EX: 7 * 24 * 60 * 60
        });

        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
};
