const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { buildCorsOptions } = require('./config/cors');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const validate = require('./middleware/validate');

const app = express();

// Security headers
app.use(helmet());

// CORS — src/config/cors.js
app.use(cors(buildCorsOptions()));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        env: process.env.NODE_ENV || 'unknown',
        timestamp: new Date().toISOString(),
    });
});

// 404 — কোনো route match না হলে (সব route-এর পরে)
app.use(notFound);

// Central error handler — সবার শেষে
app.use(errorHandler);

module.exports = app;