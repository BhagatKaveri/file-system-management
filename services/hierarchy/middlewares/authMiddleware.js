import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token missing.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId }; // ✅ make sure userId is here
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};
