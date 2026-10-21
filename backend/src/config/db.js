const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI is not set in .env');
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('[db] MongoDB connected');
    } catch (err) {
        console.error('[db] MongoDB connection error:', err.message);
        throw err;
    }
}

module.exports = { connectDB };