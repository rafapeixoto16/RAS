import Redlock from 'redlock';
import redisClient from '../config/redisConfig.js';

const redlock = new Redlock(
    [redisClient],
    {
        driftFactor: 0.01,
        retryDelay: 200,
        retryJitter: 200,
        automaticExtensionThreshold: 500,
    }
);

export default async function redisLock(lockName, retryCount=-1) {
    const lock = await redlock.acquire([`locks:${lockName}`], 10000, { retryCount });
  
    return async function unlock() {
        await lock.release();
    };
}
