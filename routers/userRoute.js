const express = require('express');
const router = express.Router();

const { createNewUser, getAllUsers } = require('../controller/user');

router.get('/', getAllUsers);
router.post('/', createNewUser);

module.exports = router;
