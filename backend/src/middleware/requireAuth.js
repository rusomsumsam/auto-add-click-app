const { verifyToken } = require('../utils/auth');
const User = require('../models/User');

// Authorization: Bearer <token> header থেকে টোকেন পড়ে user খুঁজে বের করে
async function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization || '';
        const [scheme, token] = header.split(' ');

        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({
                status: 'error',
                message: 'Authorization header missing or malformed',
            });
        }

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token',
            });
        }

        const user = await User.findById(decoded.sub);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = requireAuth;