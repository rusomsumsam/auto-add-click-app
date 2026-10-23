require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const DeviceProfile = require('./src/models/DeviceProfile');
const devices = require('./src/config/devices');

async function seed() {
    try {
        await connectDB();
        console.log('Clearing existing devices...');
        await DeviceProfile.deleteMany({});

        console.log('Inserting 23 devices...');
        await DeviceProfile.insertMany(devices);

        console.log(`✅ Successfully inserted ${devices.length} devices!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding devices:', error);
        process.exit(1);
    }
}

seed();