const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'requested'
    },
    exchangeType: {
        type: String,
        enum: ['barter', 'paid'], // 'barter' means free exchange or skill swap
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    review: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, maxLength: 500 }
    }
}, {
    timestamps: true
});

// Create index for fast lookups of user's exchanges
exchangeSchema.index({ requester: 1, provider: 1 });

const Exchange = mongoose.model('Exchange', exchangeSchema);

module.exports = Exchange;
