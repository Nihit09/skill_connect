const User = require('../models/User');
const Skill = require('../models/Skill');
const Exchange = require('../models/Exchange');

// @desc    Get User Dashboard Stats
// @route   GET /api/dashboard/user
// @access  Private
exports.getUserDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        const [
            skillsCount,
            exchangesAsRequester,
            exchangesAsProvider,
            activeExchanges
        ] = await Promise.all([
            Skill.countDocuments({ owner: userId }),
            Exchange.countDocuments({ requester: userId }),
            Exchange.countDocuments({ provider: userId }),
            Exchange.find({
                $or: [{ requester: userId }, { provider: userId }],
                status: { $in: ['requested', 'accepted'] }
            }).populate('skill').populate('requester').populate('provider').limit(5)
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    skillsCount,
                    totalExchanges: exchangesAsRequester + exchangesAsProvider,
                    reputation: req.user.reputation,
                    level: req.user.level
                },
                activeExchanges
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
exports.getAdminDashboard = async (req, res) => {
    try {
        const [
            totalUsers,
            totalSkills,
            totalExchanges,
            recentUsers,
            recentExchanges
        ] = await Promise.all([
            User.countDocuments(),
            Skill.countDocuments(),
            Exchange.countDocuments(),
            User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
            Exchange.find().sort({ createdAt: -1 }).limit(5).populate('skill')
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalSkills,
                    totalExchanges
                },
                recentUsers,
                recentExchanges
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
