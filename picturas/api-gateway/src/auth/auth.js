import jwt from 'jsonwebtoken';

export const checkAuthToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.AUTH_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(401);
        } else {
            req.user = decoded;
            return next();
        }
    });
};
