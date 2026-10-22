// GET /api/me
// requireAuth middleware user-কে req.user-এ রেখে দেয়
async function getMe(req, res) {
    res.json({
        status: 'ok',
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
            createdAt: req.user.createdAt,
        },
    });
}

module.exports = { getMe };