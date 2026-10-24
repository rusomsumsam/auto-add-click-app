const TestRun = require('../models/TestRun');
const Project = require('../models/Project');
const DeviceProfile = require('../models/DeviceProfile');
const { testQueue } = require('../services/testQueue');

// POST /api/test-runs
async function createTestRun(req, res, next) {
    try {
        const { projectId, deviceIds } = req.body;

        // ১. প্রজেক্ট যাচাই (এবং ownership)
        const project = await Project.findOne({ _id: projectId, user: req.user._id });
        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found or you do not have permission',
            });
        }

        // ২. ডিভাইসগুলো যাচাই
        const devices = await DeviceProfile.find({ _id: { $in: deviceIds }, isActive: true });
        if (devices.length !== deviceIds.length) {
            return res.status(400).json({
                status: 'error',
                message: 'One or more devices are invalid or inactive',
            });
        }

        // ৩. TestRun তৈরি
        const testRun = await TestRun.create({
            user: req.user._id,
            project: project._id,
            totalDevices: devices.length,
            status: 'queued',
        });

        // ৪. প্রতিটি ডিভাইসের জন্য Job Queue-তে যোগ
        for (const device of devices) {
            await testQueue.add(
                'test-website',
                {
                    testRunId: testRun._id.toString(),
                    deviceId: device._id.toString(),
                    url: project.url,
                },
                {
                    attempts: 2, // সর্বোচ্চ ২ বার চেষ্টা
                    backoff: { type: 'exponential', delay: 5000 }, // ব্যর্থ হলে ৫ সেকেন্ড পর আবার
                    removeOnComplete: 100,
                    removeOnFail: 100,
                }
            );
        }

        // ৫. Status আপডেট → running
        testRun.status = 'running';
        testRun.startedAt = new Date();
        await testRun.save();

        res.status(201).json({
            status: 'ok',
            message: `Test run started for ${devices.length} device(s)`,
            testRun: {
                id: testRun._id,
                totalDevices: testRun.totalDevices,
                status: testRun.status,
            },
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/test-runs/:id
async function getTestRun(req, res, next) {
    try {
        const testRun = await TestRun.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate('project', 'name url');

        if (!testRun) {
            return res.status(404).json({
                status: 'error',
                message: 'Test run not found',
            });
        }

        res.json({ status: 'ok', testRun });
    } catch (err) {
        next(err);
    }
}

// GET /api/test-runs
async function getTestRuns(req, res, next) {
    try {
        const testRuns = await TestRun.find({ user: req.user._id })
            .populate('project', 'name url')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ status: 'ok', count: testRuns.length, testRuns });
    } catch (err) {
        next(err);
    }
}

// GET /api/test-runs/:id/results
async function getTestResults(req, res, next) {
    try {
        const testRun = await TestRun.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!testRun) {
            return res.status(404).json({ status: 'error', message: 'Test run not found' });
        }

        const TestResult = require('../models/TestResult');
        const results = await TestResult.find({ testRun: testRun._id })
            .populate('deviceProfile', 'name platform viewport');

        res.json({ status: 'ok', count: results.length, results });
    } catch (err) {
        next(err);
    }
}

module.exports = { createTestRun, getTestRun, getTestRuns, getTestResults };