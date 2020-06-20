const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Login route
router.post('/login', authController.loginAgent);

// Signup route
router.post('/', authController.registerAgent);

// Edit Agent Details
router.put('/', authController.registerAgent);

// Change Agent Role
router.put('/role', authController.registerAgent);

// Delete an Agent
router.delete('/', auth, authController.deleteAgent);




module.exports = router;