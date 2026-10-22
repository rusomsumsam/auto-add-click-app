const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            minlength: [2, 'Project name must be at least 2 characters'],
            maxlength: [100, 'Project name is too long'],
        },
        url: {
            type: String,
            required: [true, 'Website URL is required'],
            trim: true,
            validate: {
                validator: function (v) {
                    try {
                        const parsed = new URL(v);
                        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
                    } catch {
                        return false;
                    }
                },
                message: 'URL must be a valid http:// or https:// address',
            },
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description is too long'],
            default: '',
        },
        status: {
            type: String,
            enum: ['active', 'paused', 'archived'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

// Ensure unique project name per user
projectSchema.index({ user: 1, name: 1 }, { unique: true });

// JSON output cleanup
projectSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;