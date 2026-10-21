const mongoose = require('mongoose');

const testRunSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
            index: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Project reference is required'],
            index: true,
        },
        // মোট কতটি ডিভাইস টেস্ট হবে
        totalDevices: {
            type: Number,
            required: true,
            min: 1,
        },
        // কতটি ডিভাইস টেস্ট শেষ হয়েছে
        completedDevices: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['queued', 'running', 'completed', 'failed', 'cancelled'],
            default: 'queued',
            index: true,
        },
        startedAt: {
            type: Date,
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        // টেস্টের সারসংক্ষেপ
        summary: {
            passed: { type: Number, default: 0 },
            failed: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

// History এবং filter-এর জন্য
testRunSchema.index({ user: 1, createdAt: -1 });
testRunSchema.index({ project: 1, status: 1 });

// JSON cleanup
testRunSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

const TestRun = mongoose.model('TestRun', testRunSchema);

module.exports = TestRun;