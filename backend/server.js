require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} (env: ${process.env.NODE_ENV || 'unknown'})`);
        });
    } catch (err) {
        console.error('[startup] Failed to start server:', err.message);
        process.exit(1);
    }
})();