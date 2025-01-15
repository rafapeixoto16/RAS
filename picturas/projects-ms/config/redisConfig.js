import Redis from 'ioredis';

// TODO redis on connect
const redisClient = new Redis({
    host: process.env.FILTER_REDIS_HOST,
    password: process.env.FILTER_REDIS_PASSWORD,
    options: {
        enableOfflineQueue: false, // We require realtime data
    },
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

export default redisClient;
