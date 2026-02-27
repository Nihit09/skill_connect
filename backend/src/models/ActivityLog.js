const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE_WORKSPACE', 'UPLOAD_FILE', 'INVITE_MEMBER', 'Exchange Status Update', 'MESSAGE']
    },
    details: {
        type: mongoose.Schema.Types.Mixed // Flexible object for storing metadata like filenames, status changes etc.
    }
}, {
    timestamps: true
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
