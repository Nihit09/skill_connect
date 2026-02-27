const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Validates file type (Basic validation)
 */
exports.validateFileType = (file) => {
    // Extendable list of allowed mime types
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf',
        'text/plain',
        'application/zip',
        'application/x-zip-compressed'
    ];
    return allowedTypes.includes(file.mimetype);
};

// Return the local path where multer would have saved it (or where we want to organize it)
exports.getStoragePath = (filename) => {
    return `/uploads/${filename}`;
};
