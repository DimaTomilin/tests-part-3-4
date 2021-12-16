const express = require('express');
const router = express.Router();

const { createNewUser, getAllUsers, logIn } = require('../controller/user');

router.get('/', getAllUsers);
router.post('/', createNewUser);
router.post('/login', logIn);

module.exports = router;
