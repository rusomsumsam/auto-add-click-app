const mongoose = require('mongoose');

const monitoringScheduleSchema = new mongoose.Schema(
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
        // কোন কোন ডিভাইসে টেস্ট হবে তার লিস্ট (যদি নির্দিষ্ট থাকে)
        deviceProfiles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'DeviceProfile',
            },
        ],
        // কতক্ষণ পর পর টেস্ট হবে (মিনিটে)
        intervalMinutes: {
            type: Number,
            required: [true, 'Interval is required'],
            min: [15, 'Minimum interval is 15 minutes'],
        },
        status: {
            type: String,
            enum: ['active', 'paused'],
            default: 'active',
        },
        nextRunAt: {
            type: Date,
            required: true,
            index: true,
        },
        lastRunAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// দ্রুত খুঁজে বের করার জন্য (কোন সিডিউলগুলো এখন রান করতে হবে)
monitoringScheduleSchema.index({ status: 1, nextRunAt: 1 });

monitoringScheduleSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

const MonitoringSchedule = mongoose.model('MonitoringSchedule', monitoringScheduleSchema);

module.exports = MonitoringSchedule;