const express = require('express');
const authRoute = require('./auth.route');
const projectRoute = require('./project.route');
const deviceRoute = require('./device.route');
const testRunRoute = require('./testRun.route');
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const { authLimiter, generalLimiter } = require('../middleware/rateLimit');
const providerRoute = require('./provider.route');

const router = express.Router();

router.use(generalLimiter);

router.use('/auth', authLimiter, authRoute);
router.use('/projects', projectRoute);
router.use('/devices', deviceRoute);
router.use('/test-runs', testRunRoute);
router.use('/providers', providerRoute);

router.get('/me', requireAuth, userController.getMe);

module.exports = router;