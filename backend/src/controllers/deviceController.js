const DeviceProfile = require('../models/DeviceProfile');

// GET /api/devices
async function getDevices(req, res, next) {
    try {
        // ফিল্টার (প্ল্যাটফর্ম অনুযায়ী)
        const { platform } = req.query;
        const filter = { isActive: true };

        if (platform && ['android', 'ios'].includes(platform)) {
            filter.platform = platform;
        }

        const devices = await DeviceProfile.find(filter).sort({ platform: 1, name: 1 });

        res.json({
            status: 'ok',
            count: devices.length,
            devices,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getDevices };