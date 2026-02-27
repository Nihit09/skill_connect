const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('../config/redis');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            throw new Error('Authentication required');
        }

        // Check internal blacklist (Redis)
        const isBlacklisted = await redisClient.get(`blacklist_${token}`);
        if (isBlacklisted) {
            throw new Error('Session expired (Logged out)');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error('User not found');
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        // Only log actual errors, not expected auth failures
        if (e.message !== 'Authentication required' && e.message !== 'Session expired (Logged out)') {
            console.error("Auth Middleware Error:", e);
        }
        res.status(401).send({ error: e.message || 'Please authenticate.' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Role (${req.user.role}) is not allowed to access this resource`
            });
        }
        next();
    };
};

module.exports = { auth, authorizeRoles };
