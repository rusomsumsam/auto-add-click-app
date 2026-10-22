const rateLimit = require('express-rate-limit');

// Login/register-এ কঠোর limit — brute force প্রতিরোধ
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 মিনিট
    max: 10, // প্রতি IP-তে ১৫ মিনিটে সর্বোচ্চ ১০টি request
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
});

// General API — হালকা limit
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 মিনিট
    max: 300, // প্রতি IP-তে ১৫ মিনিটে সর্বোচ্চ ৩০০টি request
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many requests. Please slow down.',
    },
});

module.exports = { authLimiter, generalLimiter };