const express = require('express');
const { auth: protect } = require('../middleware/auth.middleware');
const { getWorkspace, uploadArtifact } = require('../controllers/workspace.controller');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Unique filename: timestamp-original
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.get('/:exchangeId', protect, getWorkspace);
router.post('/:workspaceId/upload', protect, upload.single('file'), uploadArtifact);

module.exports = router;
