const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// Redis Connection তৈরি
const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

// Queue তৈরি
const testQueue = new Queue('website-tests', { connection });

module.exports = { testQueue, connection };