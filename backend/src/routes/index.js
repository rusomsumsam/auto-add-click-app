const express = require('express');
const authRoute = require('./auth.route');

const router = express.Router();

const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

// Auth routes
router.use('/auth', authRoute);

// User routes
router.get('/me', requireAuth, userController.getMe);


module.exports = router;