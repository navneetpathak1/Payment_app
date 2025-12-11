const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authorization header is missing or malformed'
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({
                message: 'Invalid token'
            });
        }
    } catch (err) {
        return res.status(403).json({
            message: 'Failed to authenticate token'
        });
    }
};

module.exports = {
    authMiddleware
};
