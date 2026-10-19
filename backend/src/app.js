const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Security headers
app.use(helmet());

// CORS — শুধু অনুমোদিত origin থেকে
const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

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

// 404 handler
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Central error handler
app.use((err, req, res, next) => {
    console.error('[error]', err.message);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
    });
});

module.exports = app;