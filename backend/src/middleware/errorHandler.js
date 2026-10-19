// Central error handler
// Express-এ error handler সবসময় ৪টি argument নেয়: (err, req, res, next)
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal server error';

    // Server log — detail রাখা ভালো, কিন্তু response-এ secret ফাঁস করা যাবে না
    if (status >= 500) {
        console.error('[error]', err.stack || err);
    } else {
        console.warn('[warn]', message);
    }

    const payload = {
        status: 'error',
        message,
    };

    // Development-এ stack দেখাই, production-এ না
    if (process.env.NODE_ENV === 'development' && err.stack) {
        payload.stack = err.stack;
    }

    res.status(status).json(payload);
}

module.exports = errorHandler;