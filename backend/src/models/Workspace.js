const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    exchange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exchange',
        required: true,
        unique: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace;
