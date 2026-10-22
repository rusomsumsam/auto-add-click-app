const User = require('../models/User');
const { hashPassword, verifyPassword, signToken } = require('../utils/auth');

// POST /api/auth/register
async function register(req, res, next) {
    try {
        const { email, password, name } = req.body;

        // ১. চেক করা ইউজার আগে থেকেই আছে কিনা
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'Email already registered',
            });
        }

        // ২. পাসওয়ার্ড হ্যাশ করা
        const passwordHash = await hashPassword(password);

        // ৩. নতুন ইউজার তৈরি
        const user = await User.create({
            email,
            passwordHash,
            name,
        });

        // ৪. টোকেন তৈরি (payload-তে user-এর ID রাখা হয় 'sub' ফিল্ডে)
        const token = signToken({ sub: user._id.toString() });

        // ৫. রেসপন্স পাঠানো (পাসওয়ার্ড হ্যাশ কখনো রেসপন্সে যাবে না)
        res.status(201).json({
            status: 'ok',
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        next(err);
    }
}

// POST /api/auth/login
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // ১. ইউজার খুঁজুন (passwordHash সহ, কারণ select:false)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

        // ২. ইউজার নেই বা পাসওয়ার্ড ভুল — একই message (security: user enumeration এড়াতে)
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        // ৩. টোকেন তৈরি
        const token = signToken({ sub: user._id.toString() });

        // ৪. Response
        res.json({
            status: 'ok',
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { register, login };