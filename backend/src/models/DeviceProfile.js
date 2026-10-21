const mongoose = require('mongoose');

const deviceProfileSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: [true, 'Device ID is required'],
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Device name is required'],
            trim: true,
        },
        platform: {
            type: String,
            required: [true, 'Platform is required'],
            enum: ['android', 'ios'],
        },
        viewport: {
            width: { type: Number, required: true },
            height: { type: Number, required: true },
        },
        deviceScaleFactor: {
            type: Number,
            required: true,
            default: 1,
        },
        userAgent: {
            type: String,
            required: [true, 'User agent is required'],
        },
        osVersion: {
            type: String,
            required: [true, 'OS version is required'],
        },
        browserEngine: {
            type: String,
            enum: ['chromium', 'webkit', 'firefox'],
            default: 'chromium',
        },
        isMobile: {
            type: Boolean,
            default: true,
        },
        hasTouch: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// ফাস্ট কুয়েরির জন্য
deviceProfileSchema.index({ platform: 1, isActive: 1 });

// JSON cleanup
deviceProfileSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

const DeviceProfile = mongoose.model('DeviceProfile', deviceProfileSchema);

module.exports = DeviceProfile;