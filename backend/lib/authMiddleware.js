const { fromNodeHeaders } = require('better-auth/node');
const { auth } = require('../lib/auth');

const authMiddleware = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session || !session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Attach user to request for controllers
        req.user = {
            name: session.user.name,
            userId: session.user.id,
            email: session.user.email,
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { authMiddleware };