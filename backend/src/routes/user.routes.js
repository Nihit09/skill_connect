const express = require('express');
const { getUserById, getUsers } = require('../controllers/user.controller');
// const { auth } = require('../middleware/auth.middleware'); // Optional if we want public access

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;
