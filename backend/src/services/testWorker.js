require('dotenv').config();
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { connectDB } = require('../config/db');
const { testWebsite } = require('./websiteTester');
const DeviceProfile = require('../models/DeviceProfile');
const TestRun = require('../models/TestRun');
const TestResult = require('../models/TestResult');

// MongoDB connection
connectDB()
    .then(() => console.log('[Worker] MongoDB connected'))
    .catch((err) => {
        console.error('[Worker] MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Redis connection
const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: { rejectUnauthorized: false }
});

// Worker তৈরি
const worker = new Worker('website-tests', async (job) => {
    const { testRunId, deviceId, url } = job.data;
    console.log(`[Worker] Processing job ${job.id} (device: ${deviceId})`);

    try {
        const device = await DeviceProfile.findById(deviceId);
        if (!device) throw new Error('Device not found');

        console.log(`[Worker] Testing ${url} with ${device.name}...`);
        const result = await testWebsite(url, device);

        await TestResult.create({
            testRun: testRunId,
            deviceProfile: device._id,
            status: result.status,
            checks: result.checks,
            consoleErrors: result.consoleErrors,
            brokenLinks: result.brokenLinks || [],
            durationMs: result.durationMs,
            startedAt: result.startedAt,
            completedAt: result.completedAt,
        });

        const testRun = await TestRun.findById(testRunId);
        if (testRun) {
            testRun.completedDevices += 1;
            if (testRun.completedDevices >= testRun.totalDevices) {
                testRun.status = 'completed';
                testRun.completedAt = new Date();
            }
            if (result.status === 'passed') testRun.summary.passed += 1;
            else testRun.summary.failed += 1;
            await testRun.save();
        }

        console.log(`[Worker] Job ${job.id} done: ${result.status} (${result.durationMs}ms)`);
        return { status: result.status, durationMs: result.durationMs };
    } catch (err) {
        console.error(`[Worker] Job ${job.id} failed:`, err.message);
        throw err;
    }
}, { connection });

worker.on('completed', (job) => {
    console.log(`[Worker] ✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
    console.error(`[Worker] ❌ Job ${job.id} failed:`, err.message);
});

console.log('[Worker] Started. Waiting for jobs...');