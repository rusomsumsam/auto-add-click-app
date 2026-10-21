const crypto = require('crypto');

// প্রতিটি request-এ unique ID — log, tracing, debugging-এ কাজে লাগবে
function requestId(req, res, next) {
    const id = req.headers['x-request-id'] || crypto.randomUUID();
    req.id = id;
    res.setHeader('X-Request-Id', id);
    next();
}

module.exports = requestId;