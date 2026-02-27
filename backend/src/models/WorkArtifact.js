const mongoose = require('mongoose');

const workArtifactSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    type: {
        type: String // MIME type
    },
    storageKey: {
        type: String, // Path in typical storage or filesystem
        required: true
    },
    fileSize: {
        type: Number // in bytes
    },
    version: {
        type: Number,
        default: 1
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
});

const WorkArtifact = mongoose.model('WorkArtifact', workArtifactSchema);

module.exports = WorkArtifact;
