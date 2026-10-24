// SSRF Protection:
// প্রাইভেট আইপি, লোকালহোস্ট, ক্লাউড মেটাডেটা ব্লক করে
// Playwright যদি এই ধরনের URL লোড করে, তবে সার্ভারের গোপন তথ্য ফাঁস হতে পারে

function isPrivateOrLocalHost(hostname) {
    // localhost variants
    if (['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(hostname)) return true;
    if (hostname.endsWith('.localhost')) return true;

    // IPv4 private ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
        const [, a, b] = match.map(Number);
        // 10.0.0.0/8
        if (a === 10) return true;
        // 172.16.0.0/12
        if (a === 172 && b >= 16 && b <= 31) return true;
        // 192.168.0.0/16
        if (a === 192 && b === 168) return true;
        // 169.254.0.0/16 (link-local + AWS/GCP metadata 169.254.169.254)
        if (a === 169 && b === 254) return true;
        // 127.0.0.0/8 (loopback)
        if (a === 127) return true;
        // 0.0.0.0/8
        if (a === 0) return true;
    }

    // IPv6 private/local — ::1, fc00::/7, fe80::/10
    if (hostname === '::1' || hostname.startsWith('fc') || hostname.startsWith('fd') || hostname.startsWith('fe80')) {
        return true;
    }

    return false;
}

function validateUrlForTesting(rawUrl) {
    let url;
    try {
        url = new URL(rawUrl);
    } catch {
        return { ok: false, reason: 'Invalid URL format' };
    }

    // শুধু http / https অনুমোদিত
    if (!['http:', 'https:'].includes(url.protocol)) {
        return { ok: false, reason: 'Only http:// and https:// are allowed' };
    }

    // Credentials সহ URL (http://user:pass@host) ব্লক
    if (url.username || url.password) {
        return { ok: false, reason: 'URLs with credentials are not allowed' };
    }

    // Private/local host ব্লক
    if (isPrivateOrLocalHost(url.hostname.toLowerCase())) {
        return { ok: false, reason: 'Private, localhost, or internal network URLs are blocked' };
    }

    return { ok: true };
}

// Express middleware হিসেবে ব্যবহারের জন্য
function ssrfProtection(req, res, next) {
    // ১. Project URL (POST/PATCH /api/projects)
    if (req.body?.url) {
        const check = validateUrlForTesting(req.body.url);
        if (!check.ok) {
            return res.status(400).json({
                status: 'error',
                message: `URL rejected: ${check.reason}`,
            });
        }
    }
    next();
}

module.exports = { ssrfProtection, validateUrlForTesting, isPrivateOrLocalHost };