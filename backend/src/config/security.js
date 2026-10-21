// Security headers config (Helmet)
// API JSON-only serve করে, তাই কিছু default কমানো/বদলানো দরকার।

const helmet = require('helmet');

function buildHelmetMiddleware() {
    return helmet({
        // CSP — API JSON return করে, কোনো HTML render করে না
        // তাই বেশিরভাগ directive শিথিল করা যায়
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'none'"],
                frameAncestors: ["'none'"],
            },
        },
        // Cross-Origin-Resource-Policy:
        // mobile app বা third-party থেকে response নিতে পারবে
        // (dev-এ same-origin দিলে Android emulator / Expo Go থেকেও block হতে পারে)
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        // HSTS শুধু production-এ — localhost-এ http চলতে দিতে হবে
        hsts: process.env.NODE_ENV === 'production'
            ? { maxAge: 31536000, includeSubDomains: true, preload: true }
            : false,
        referrerPolicy: { policy: 'no-referrer' },
    });
}

module.exports = { buildHelmetMiddleware };