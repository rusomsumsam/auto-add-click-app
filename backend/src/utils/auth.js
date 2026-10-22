const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// Password hash ও verify
async function hashPassword(plain) {
    return bcrypt.hash(plain, SALT_ROUNDS);
}

async function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}

// JWT sign ও verify
function signToken(payload) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set in .env');
    }
    return jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
}

function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set in .env');
    }
    return jwt.verify(token, secret);
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken };