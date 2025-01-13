import axios from 'axios';

export const isPremiumMiddleware = async (req, res, next) => {
    if (req.user.isGuest) {
        req.user.isPremium = false;
        next();
    } else {
        // TODO endpoint though environments
        axios.get('http://subscriptions-ms:3000/', {
            headers: {
                'Authorization': req.headers.authorization
            }
        })
            .then(response => {
                req.user.isPremium = response.isPremium
                next();
            })
            .catch(_ => {
                res.sendStatus(500);
            });
    }
}

export const getLimitsMiddleware = (req, res, next) => {
    const limits = {
        hasTtl: false,
        has4kUpload: false
    }

    if (req.user.isGuest) {
        limits.hasTtl = true;
        limits.ttlTime = new Date(req.user.iat * 1000)
        limits.ttlTime.setDate(limits.ttlTime.getDate() + 1);
    }

    if (req.user.isPremium) limits.has4kUpload = true;

    req.user.limits = limits;
    next();
}
