const express = require('express');
const authRoute = require('./auth.route');
const projectRoute = require('./project.route'); // নতুন
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const { authLimiter, generalLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// সব /api রুটে general limit
router.use(generalLimiter);

// Auth routes (কঠোর limit)
router.use('/auth', authLimiter, authRoute);

// Project routes
router.use('/projects', projectRoute); // নতুন

// User routes
router.get('/me', requireAuth, userController.getMe);

module.exports = router;