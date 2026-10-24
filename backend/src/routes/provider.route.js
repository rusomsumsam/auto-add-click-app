const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const {
    getProviders,
    connectProvider,
    disconnectProvider,
} = require('../controllers/providerController');

const router = express.Router();

router.use(requireAuth);

// GET /api/providers
router.get('/', getProviders);

// POST /api/providers/:provider/connect
router.post('/:provider/connect', connectProvider);

// DELETE /api/providers/:provider/disconnect
router.delete('/:provider/disconnect', disconnectProvider);

module.exports = router;