import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

const redisClient = new Redis({
    host: process.env.RATE_LIMITER_REDIS_HOST,
    password: process.env.RATE_LIMITER_REDIS_PASSWORD,
    options: {
        enableOfflineQueue: false, // We require realtime data
    },
});

const opts = {
    storeClient: redisClient,
    points: 10, // Number of points
    duration: 1, // Per second(s)
    inmemoryBlockOnConsumed: 200, // If 200 points consumed
    inmemoryBlockDuration: 60, // block for 60 seconds
    insuranceLimiter: new RateLimiterMemory({
        // In case Redis is down
        points: 20,
        duration: 1,
    }),
};

const rateLimiterRedis = new RateLimiterRedis(opts);

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiterRedis
        .consume(req.connection.remoteAddress)
        .then(() => {
            next();
        })
        .catch((_rejRes) => {
            res.status(429).send('Too Many Requests');
        });
};

export default rateLimiterMiddleware;
