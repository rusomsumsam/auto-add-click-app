const express = require('express');
const cors = require('cors');

const { buildHelmetMiddleware } = require('./config/security');
const { buildCorsOptions } = require('./config/cors');
const requestId = require('./middleware/requestId');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const validate = require('./middleware/validate');

// ১. Routes ইমপোর্ট (নতুন)
const routes = require('./routes');

const app = express();

// Express version লুকানো
app.disable('x-powered-by');

// Request ID
app.use(requestId);

// Security headers
app.use(buildHelmetMiddleware());

// CORS
app.use(cors(buildCorsOptions()));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check
app.get('/api/health', (req, res) => {
    const mem = process.memoryUsage();
    res.json({
        status: 'ok',
        env: process.env.NODE_ENV || 'unknown',
        version: require('../package.json').version,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        memory: {
            rss_mb: Math.round(mem.rss / 1024 / 1024),
            heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
        },
        requestId: req.id,
    });
});

// ২. Routes যুক্ত করা (নতুন)
app.use('/api', routes);

// 404
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;