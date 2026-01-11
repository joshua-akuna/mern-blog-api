const express = require('express');
const router = express.Router();
const { login, register, profile } = require('../controller/authController');
const verifyJWT = require('../middleware/verifyJWT');

// routes for login and registration
router.post('/login', login);
router.post('/register', register);
router.get('/profile', verifyJWT, profile);

module.exports = router;
