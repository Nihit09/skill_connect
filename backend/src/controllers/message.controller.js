const Message = require('../models/Message');
const Exchange = require('../models/Exchange');

// @desc    Get messages for an exchange
// @route   GET /api/messages/:exchangeId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const { exchangeId } = req.params;

        // Verify user is part of the exchange
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ success: false, error: 'Exchange not found' });
        }

        if (exchange.requester.toString() !== req.user._id.toString() &&
            exchange.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized to view these messages' });
        }

        const messages = await Message.find({ exchange: exchangeId })
            .populate('sender', 'firstName lastName')
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
