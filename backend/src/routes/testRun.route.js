const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const {
    createTestRun,
    getTestRun,
    getTestRuns,
    getTestResults,
} = require('../controllers/testRunController');

const router = express.Router();

router.use(requireAuth);

// POST /api/test-runs
router.post('/', createTestRun);

// GET /api/test-runs
router.get('/', getTestRuns);

// GET /api/test-runs/:id
router.get('/:id', getTestRun);

// GET /api/test-runs/:id/results
router.get('/:id/results', getTestResults);

module.exports = router;