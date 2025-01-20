import Redis from 'ioredis';

const redisClient = new Redis({
    host: process.env.FILTER_REDIS_HOST,
    password: process.env.FILTER_REDIS_PASSWORD,
    options: {
        enableOfflineQueue: false, // We require realtime data
    },
});

export default redisClient;
