const Workspace = require('../models/Workspace');
const WorkArtifact = require('../models/WorkArtifact');
const ActivityLog = require('../models/ActivityLog');
const Exchange = require('../models/Exchange');
const fs = require('fs');
const path = require('path');

// @desc    Get Workspace details by Exchange ID
// @route   GET /api/workspaces/:exchangeId
// @access  Private (Members only)
exports.getWorkspace = async (req, res) => {
    try {
        const { exchangeId } = req.params;
        const workspace = await Workspace.findOne({ exchange: exchangeId })
            .populate('members', 'firstName lastName email avatar');

        if (!workspace) {
            return res.status(404).json({ success: false, error: 'Workspace not found' });
        }

        // Check membership
        const isMember = workspace.members.some(member => member._id.toString() === req.user._id.toString());
        if (!isMember) {
            return res.status(403).json({ success: false, error: 'Not authorized to access this workspace' });
        }

        // Fetch Artifacts
        const artifacts = await WorkArtifact.find({ workspace: workspace._id })
            .populate('uploader', 'firstName lastName')
            .sort({ createdAt: -1 });

        // Fetch Activity Log
        const activities = await ActivityLog.find({ workspace: workspace._id })
            .populate('actor', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                workspace,
                artifacts,
                activities
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Upload file to workspace
// @route   POST /api/workspaces/:workspaceId/upload
// @access  Private (Members only + Active workspace)
exports.uploadArtifact = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        const { workspaceId } = req.params;
        const { comment } = req.body;
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ success: false, error: 'Workspace not found' });
        }

        if (workspace.status !== 'active') {
            return res.status(400).json({ success: false, error: 'Workspace is archived/read-only' });
        }

        // Check membership
        const isMember = workspace.members.includes(req.user._id);
        if (!isMember) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        // Create Artifact Record
        // In a real S3 impl, we'd upload to S3 here. With Multer diskStorage, it's already in public/uploads.
        // We just store the path relative to server root or public URL.

        // Check for previous versions of same filename to increment version??
        // For simplicity now, we just treat every upload as new or let client handle grouping by name.
        // Let's see if we can find a previous artifact with same name to increment version.
        const previousArtifact = await WorkArtifact.findOne({ workspace: workspace._id, originalName: req.file.originalname })
            .sort({ version: -1 });

        const newVersion = previousArtifact ? previousArtifact.version + 1 : 1;

        const artifact = await WorkArtifact.create({
            workspace: workspace._id,
            uploader: req.user._id,
            name: req.file.originalname, // or req.body.name custom name
            originalName: req.file.originalname,
            type: req.file.mimetype,
            storageKey: `/uploads/${req.file.filename}`, // Assuming simple local serving
            fileSize: req.file.size,
            version: newVersion,
            comment: comment || 'File uploaded'
        });

        // Log Activity
        await ActivityLog.create({
            workspace: workspace._id,
            actor: req.user._id,
            action: 'UPLOAD_FILE',
            details: {
                fileName: artifact.name,
                version: artifact.version
            }
        });

        res.status(201).json({ success: true, data: artifact });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
