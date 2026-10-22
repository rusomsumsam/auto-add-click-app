const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post(
    '/register',
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    validate,
    register
);

// POST /api/auth/login
router.post(
    '/login',
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
    login
);

module.exports = router;