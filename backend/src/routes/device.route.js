const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { getDevices } = require('../controllers/deviceController');

const router = express.Router();

router.use(requireAuth);

// GET /api/devices
router.get('/', getDevices);

module.exports = router;