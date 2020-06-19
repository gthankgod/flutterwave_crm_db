const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Login route
router.post('/login', authController.login);

// Signup route
router.post('/signup', authController.register);




module.exports = router;