const express = require('express');
const { getUserDashboard, getAdminDashboard } = require('../controllers/dashboard.controller');
const { auth, authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/user', auth, getUserDashboard);
router.get('/admin', auth, authorizeRoles('admin'), getAdminDashboard);

module.exports = router;
