const express = require('express');
const {
    requestExchange,
    getMyExchanges,
    updateExchangeStatus,
    deleteExchange
} = require('../controllers/exchange.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(auth); // All routes private

router.post('/', requestExchange);
router.get('/', getMyExchanges);
router.patch('/:id/status', updateExchangeStatus);
router.delete('/:id', deleteExchange);

module.exports = router;
