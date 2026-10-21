// CORS configuration
// Development-এ .env-এ CORS_ORIGINS-এ কমা দিয়ে origin লিস্ট দিতে হবে।
// Production-এ এটাই একমাত্র অনুমোদিত origin।
//
// Mobile app (React Native): সাধারণত Origin header পাঠায় না।
// তাই origin-less request allow করা হয় — এগুলো browser নয়,
// তাই CSRF ঝুঁকি নেই (cookie পাঠায় না)।

function buildCorsOptions() {
    const raw = (process.env.CORS_ORIGINS || '').trim();

    const allowedOrigins = raw
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

    // production-এ খালি থাকলে সব reject — safer default
    // development-এ খালি থাকলে সব allow — dev সুবিধার জন্য
    const isDev = process.env.NODE_ENV !== 'production';
    const allowAllInDev = isDev && allowedOrigins.length === 0;

    function originCheck(origin, callback) {
        // Mobile app / curl / Postman — Origin header নেই
        if (!origin) {
            return callback(null, true);
        }

        if (allowAllInDev) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Reject with detailed message — errorHandler 500 দিয়ে ধরে নেবে
        return callback(
            new Error(
                `CORS: origin '${origin}' not allowed. Add it to CORS_ORIGINS in .env.`
            )
        );
    }

    return {
        origin: originCheck,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['X-Request-Id'],
        maxAge: 600, // preflight cache 10 min
    };
}

module.exports = { buildCorsOptions };