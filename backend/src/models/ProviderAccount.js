const mongoose = require('mongoose');

const providerAccountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
            index: true,
        },
        provider: {
            type: String,
            required: [true, 'Provider name is required'],
            enum: {
                values: ['monetag', 'adsspaark'],
                message: '{VALUE} is not a supported provider',
            },
        },
        // Credentials encrypted string হিসেবে থাকবে (Phase 09-এ এনক্রিপশন হবে)
        // এখানে সরাসরি কোনো API key বা token রাখা যাবে না
        encryptedCredentials: {
            type: String,
            required: [true, 'Encrypted credentials are required'],
            select: false, // ডিফল্ট কুয়েরিতে রিটার্ন হবে না
        },
        // অ্যাকাউন্টের লেবেল (যেমন: "Main Account", "Test Account")
        accountLabel: {
            type: String,
            trim: true,
            maxlength: [50, 'Account label is too long'],
            default: 'Default Account',
        },
        status: {
            type: String,
            enum: ['connected', 'disconnected', 'failed', 'unavailable'],
            default: 'disconnected',
        },
        lastVerifiedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// একজন ইউজার একটি প্রোভাইডারের জন্য একটি অ্যাকাউন্টই রাখতে পারবে (আপাতত)
providerAccountSchema.index({ user: 1, provider: 1 }, { unique: true });

// JSON-এ encryptedCredentials কখনো যাবে না
providerAccountSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.encryptedCredentials;
        delete ret.__v;
        return ret;
    },
});

const ProviderAccount = mongoose.model('ProviderAccount', providerAccountSchema);

module.exports = ProviderAccount;