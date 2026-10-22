const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');

const router = express.Router();

// এই রাউটের সবকিছুর জন্য লগইন বাধ্যতামূলক
router.use(requireAuth);

// POST /api/projects
router.post(
    '/',
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('url').isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Must be a valid http/https URL'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
    validate,
    createProject
);

// GET /api/projects
router.get('/', getProjects);

// PATCH /api/projects/:id
router.patch(
    '/:id',
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('url').optional().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Must be a valid http/https URL'),
    validate,
    updateProject
);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

module.exports = router;