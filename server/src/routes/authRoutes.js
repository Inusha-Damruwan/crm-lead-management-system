const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Private routes
router.get('/me', authMiddleware, authController.getMe);
router.get('/users', authMiddleware, authController.getUsers);

module.exports = router;
