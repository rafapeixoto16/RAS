import jwt from 'jsonwebtoken';

const secret = process.env.AUTH_JWT_SECRET;

export const checkAuthToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        next();
        return;
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(401).send({});
        } else {
            req.user = decoded;
            next();
        }
    });
};

export const requiresAuth = (req, res, next) => {
    if (!req.user) {
        res.status(401).send({});
    } else {
        next();
    }
};
