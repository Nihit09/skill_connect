const express = require('express');
const { getMessages } = require('../controllers/message.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(auth);

router.get('/:exchangeId', getMessages);

module.exports = router;
