const { chromium } = require('playwright');

/**
 * একটি ওয়েবসাইট টেস্ট করে
 * @param {string} url - টেস্ট করার URL
 * @param {Object} deviceProfile - মঙ্গুজ ডিভাইস প্রোফাইল (viewport, userAgent ইত্যাদি)
 * @returns {Object} - টেস্টের ফলাফল
 */
async function testWebsite(url, deviceProfile) {
    let browser = null;
    const result = {
        status: 'failed',
        checks: [],
        consoleErrors: [],
        durationMs: 0,
        startedAt: new Date(),
        completedAt: null,
    };

    const startTime = Date.now();

    try {
        // ব্রাউজার লঞ্চ
        browser = await chromium.launch({ headless: true });

        // ডিভাইস প্রোফাইল অনুযায়ী কনটেক্সট তৈরি (emulation)
        const context = await browser.newContext({
            viewport: deviceProfile.viewport,
            userAgent: deviceProfile.userAgent,
            deviceScaleFactor: deviceProfile.deviceScaleFactor || 1,
            isMobile: deviceProfile.isMobile,
            hasTouch: deviceProfile.hasTouch,
        });

        const page = await context.newPage();

        // কনসোল এরর কালেক্ট
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                result.consoleErrors.push({
                    type: 'error',
                    text: msg.text(),
                    url: page.url(),
                });
            }
        });

        // পেজ লোড
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            result.checks.push({ name: 'Page Load', status: 'passed', details: 'Page loaded in time' });
        } catch (err) {
            result.checks.push({ name: 'Page Load', status: 'failed', details: err.message });
            throw err;
        }

        // টাইটেল চেক
        const title = await page.title();
        if (title && title.trim().length > 0) {
            result.checks.push({ name: 'Page Title', status: 'passed', details: `Title: "${title}"` });
        } else {
            result.checks.push({ name: 'Page Title', status: 'failed', details: 'Title is empty' });
        }

        // স্ক্রিনশট নেওয়া (ভবিষ্যতে রিপোর্টে দেখানো হবে)
        // এখানে base64 হিসেবে রাখছি, পরে ফাইল হিসেবে সেভ করা যাবে
        const screenshot = await page.screenshot({ fullPage: false, encoding: 'base64' });
        result.screenshot = `data:image/png;base64,${screenshot}`;

        // সামগ্রিক স্ট্যাটাস
        const allPassed = result.checks.every((c) => c.status === 'passed');
        result.status = allPassed ? 'passed' : 'failed';

        await browser.close();
        browser = null;
    } catch (err) {
        // যদি কোথাও এরর হয়, তবুও ফলাফল হিসেবে সেভ করি
        if (browser) {
            try { await browser.close(); } catch {  }
        }
        result.status = 'failed';
        result.error = err.message;
    } finally {
        result.completedAt = new Date();
        result.durationMs = Date.now() - startTime;
    }

    return result;
}

module.exports = { testWebsite };