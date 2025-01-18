import axios from 'axios';

export const isPremiumMiddleware = async (req, res, next) => {
    if (req.user.isGuest) {
        req.user.isPremium = false;
        next();
    } else {
        axios.get(`http://${process.env.SUBSCRIPTIONS_MS}:${process.env.SUBSCRIPTIONS_MS_PORT}/public`, {
            headers: {
                Authorization: req.headers.authorization
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
        has4kUpload: false,
        noWatermark: false,
        concurrentPipelines: 1,
        dailyPipelines: 1,
        projectsLimit: 1,
        imagesLimit: 2
    }

    limits.ttlStartTime = new Date(req.user.iat * 1000);

    if (req.user.isGuest) {
        limits.hasTtl = true;
    }

    if (req.user.isPremium) {
        limits.has4kUpload = true;
        limits.noWatermark = true;
        limits.concurrentPipelines = 5;
        limits.dailyPipelines = Infinity;
        limits.projectsLimit = 50;
        limits.imagesLimit = 10;
    } else {
        limits.dailyPipelines = 5;
        limits.projectsLimit = 10;
        limits.imagesLimit = 5;
    }

    req.user.limits = limits;
    next();
}
