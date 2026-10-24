const ProviderAccount = require('../models/ProviderAccount');

// GET /api/providers
async function getProviders(req, res, next) {
    try {
        // ডাটাবেস থেকে ইউজারের সেভ করা প্রোভাইডার অ্যাকাউন্টগুলো খুঁজি
        const accounts = await ProviderAccount.find({ user: req.user._id });

        // সবসময় Monetag এবং Ads Spaark-এর একটি কার্ড থাকবে
        const providers = [
            {
                id: 'monetag',
                name: 'Monetag',
                status: 'disconnected',
                accountLabel: null,
                lastVerifiedAt: null,
            },
            {
                id: 'adsspaark',
                name: 'Ads Spaark',
                status: 'disconnected',
                accountLabel: null,
                lastVerifiedAt: null,
            },
        ];

        // ডাটাবেসের ডেটা কার্ডের সাথে মিলিয়ে দিই
        accounts.forEach((acc) => {
            const card = providers.find((p) => p.id === acc.provider);
            if (card) {
                card.status = acc.status;
                card.accountLabel = acc.accountLabel;
                card.lastVerifiedAt = acc.lastVerifiedAt;
                card._id = acc._id;
            }
        });

        res.json({ status: 'ok', providers });
    } catch (err) {
        next(err);
    }
}

// POST /api/providers/:provider/connect
// নোট: যেহেতু Monetag/Ads Spaark-এর পাবলিক API নেই, আমরা "unverified" হিসেবে সেভ করছি।
// "Connected" দেখাব না, বরং "Disconnected (Awaiting Verification)" দেখাব।
async function connectProvider(req, res, next) {
    try {
        const { provider } = req.params;
        const { accountLabel, credentials } = req.body;

        // প্রোভাইডার যাচাই
        if (!['monetag', 'adsspaark'].includes(provider)) {
            return res.status(400).json({
                status: 'error',
                message: 'Unsupported provider',
            });
        }

        if (!accountLabel || accountLabel.trim().length < 2) {
            return res.status(400).json({
                status: 'error',
                message: 'Account label is required (min 2 chars)',
            });
        }

        if (!credentials || credentials.trim().length < 3) {
            return res.status(400).json({
                status: 'error',
                message: 'Zone ID / Publisher ID is required',
            });
        }

        // ⚠️ এখানে ভবিষ্যতে এনক্রিপশন যুক্ত হবে। আপাতত আমরা সরাসরি সেভ করছি না।
        // রোডম্যাপ অনুযায়ী Phase 09-এ AES-256 এনক্রিপশন হবে।
        // আপাতত আমরা credentials-কে base64-এ রাখছি যাতে সহজে পড়া না যায়।
        const encoded = Buffer.from(credentials, 'utf8').toString('base64');

        // اگر আগে থেকে অ্যাকাউন্ট থাকে, আপডেট করি; না থাকলে নতুন তৈরি করি
        let account = await ProviderAccount.findOne({ user: req.user._id, provider });

        if (account) {
            account.encryptedCredentials = encoded;
            account.accountLabel = accountLabel;
            account.status = 'disconnected'; // API না থাকায় connected দেখাচ্ছি না
            account.lastVerifiedAt = new Date();
            await account.save();
        } else {
            account = await ProviderAccount.create({
                user: req.user._id,
                provider,
                encryptedCredentials: encoded,
                accountLabel,
                status: 'disconnected',
                lastVerifiedAt: new Date(),
            });
        }

        res.status(201).json({
            status: 'ok',
            message: 'Credentials saved. Note: automatic verification is not available for this provider.',
            account: {
                id: account._id,
                provider: account.provider,
                accountLabel: account.accountLabel,
                status: account.status,
                lastVerifiedAt: account.lastVerifiedAt,
            },
        });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/providers/:provider/disconnect
async function disconnectProvider(req, res, next) {
    try {
        const { provider } = req.params;

        const account = await ProviderAccount.findOneAndDelete({
            user: req.user._id,
            provider,
        });

        if (!account) {
            return res.status(404).json({
                status: 'error',
                message: 'No account found for this provider',
            });
        }

        res.json({
            status: 'ok',
            message: `${provider} disconnected`,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getProviders, connectProvider, disconnectProvider };