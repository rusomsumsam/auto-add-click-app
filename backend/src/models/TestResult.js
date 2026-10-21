const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
    {
        testRun: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TestRun',
            required: [true, 'TestRun reference is required'],
            index: true,
        },
        deviceProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeviceProfile',
            required: [true, 'DeviceProfile reference is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'running', 'passed', 'failed', 'skipped'],
            default: 'pending',
        },
        // টেস্টের বিস্তারিত চেকলিস্ট (যেমন: page load, title, console errors)
        checks: [
            {
                name: { type: String, required: true },
                status: { type: String, enum: ['passed', 'failed', 'skipped'], required: true },
                details: { type: String, default: '' },
            },
        ],
        // কনসোল এরর (যদি থাকে)
        consoleErrors: [
            {
                type: { type: String, default: 'error' },
                text: { type: String, required: true },
                url: { type: String, default: '' },
            },
        ],
        // ভাঙা লিংকের তালিকা
        brokenLinks: [
            {
                url: { type: String, required: true },
                statusCode: { type: Number, default: 0 },
            },
        ],
        // স্ক্রিনশট (যদি সেভ করা হয়)
        screenshots: [
            {
                url: { type: String, required: true },
                label: { type: String, default: 'default' },
            },
        ],
        durationMs: {
            type: Number,
            default: 0,
        },
        startedAt: {
            type: Date,
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// একটি TestRun-এ একটি DeviceProfile-এর জন্য একটাই Result থাকবে
testResultSchema.index({ testRun: 1, deviceProfile: 1 }, { unique: true });

// JSON cleanup
testResultSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;