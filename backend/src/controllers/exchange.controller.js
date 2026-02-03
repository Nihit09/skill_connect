const Exchange = require('../models/Exchange');
const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Request a skill exchange
// @route   POST /api/exchanges
// @access  Private
exports.requestExchange = async (req, res) => {
    try {
        const { skillId, note } = req.body; // note could be added to schema if needed

        const skill = await Skill.findById(skillId).populate('owner');
        if (!skill) {
            return res.status(404).json({ success: false, error: 'Skill not found' });
        }

        if (skill.owner._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, error: 'Cannot request your own skill' });
        }

        const exchange = await Exchange.create({
            requester: req.user._id,
            provider: skill.owner._id,
            skill: skill._id,
            exchangeType: skill.isPaid ? 'paid' : 'barter',
            cost: skill.isPaid ? skill.price : 0,
            status: 'requested'
        });

        // Add to users' exchange history
        await User.findByIdAndUpdate(req.user._id, { $push: { exchanges: exchange._id } });
        await User.findByIdAndUpdate(skill.owner._id, { $push: { exchanges: exchange._id } });

        res.status(201).json({ success: true, data: exchange });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get my exchanges (as requester or provider)
// @route   GET /api/exchanges
// @access  Private
exports.getMyExchanges = async (req, res) => {
    try {
        const exchanges = await Exchange.find({
            $or: [{ requester: req.user._id }, { provider: req.user._id }]
        })
            .populate('skill', 'title category')
            .populate('requester', 'firstName lastName')
            .populate('provider', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: exchanges.length, data: exchanges });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update exchange status (Accept, Reject, Cancel, Complete)
// @route   PATCH /api/exchanges/:id/status
// @access  Private
exports.updateExchangeStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({ success: false, error: 'Exchange not found' });
        }

        const userId = req.user._id.toString();
        const isProvider = exchange.provider.toString() === userId;
        const isRequester = exchange.requester.toString() === userId;

        if (!isProvider && !isRequester) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        // Logic for state transitions
        if (status === 'accepted' || status === 'rejected') {
            if (!isProvider) return res.status(403).json({ error: 'Only provider can accept/reject' });
            if (exchange.status !== 'requested') return res.status(400).json({ error: 'Can only accept/reject pending requests' });
        }

        if (status === 'cancelled') {
            // Either can cancel if not yet completed
            if (exchange.status === 'completed') return res.status(400).json({ error: 'Cannot cancel completed exchange' });
        }

        if (status === 'completed') {
            if (!isRequester) return res.status(403).json({ error: 'Only requester can confirm completion' });
            if (exchange.status !== 'accepted') return res.status(400).json({ error: 'Exchange must be accepted first' });

            // Increment reputation for provider
            await User.findByIdAndUpdate(exchange.provider, { $inc: { reputation: 10 } });
        }

        exchange.status = status;
        await exchange.save();

        res.status(200).json({ success: true, data: exchange });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete an exchange request
// @route   DELETE /api/exchanges/:id
// @access  Private
// @desc    Delete an exchange request
// @route   DELETE /api/exchanges/:id
// @access  Private
exports.deleteExchange = async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({ success: false, error: 'Exchange not found' });
        }

        const userId = req.user._id.toString();
        const isRequester = exchange.requester.toString() === userId;
        const isProvider = exchange.provider.toString() === userId;

        if (!isRequester && !isProvider) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        // Allow deletion if:
        // 1. Status is 'requested' (Pending) - Requester can cancel, Provider can reject/delete
        // 2. Status is 'rejected' or 'cancelled' - Any party can clean up their history
        // 3. Status is 'completed' - Maybe allow cleanup (archiving)? For now restrictive.

        if (exchange.status === 'accepted') {
            return res.status(400).json({ success: false, error: 'Cannot delete active (accepted) exchanges. Mark as completed first.' });
        }

        // If it's completed, we might want to keep it for history, but if user really wants to delete:
        // For now, let's allow deleting completed if they want to clear history. 
        // But original requirement was "dlt request".

        // Clean up from user history
        await User.findByIdAndUpdate(exchange.requester, { $pull: { exchanges: exchange._id } });
        await User.findByIdAndUpdate(exchange.provider, { $pull: { exchanges: exchange._id } });

        await exchange.deleteOne();

        res.status(200).json({ success: true, message: 'Exchange request deleted' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
