const DEFAULT_TIMEOUT = 5000;
const DEFAULT_RETRY_DELAY = 50;

async function acquireLock (client, lockName, retires, maxRertries, onLockAcquired) {
    function retry () {
        setTimeout(() => {
            acquireLock(client, lockName, retires + 1, maxRertries, onLockAcquired);
        }, DEFAULT_RETRY_DELAY);
    }

    const lockTimeoutValue = Date.now() + DEFAULT_TIMEOUT + 1;
    try {
        const result = await client.set(lockName, lockTimeoutValue, {
            PX: DEFAULT_TIMEOUT,
            NX: true
        });
        if (result === null) {
            throw new Error("Lock failed");
        }
        onLockAcquired(lockTimeoutValue);
    } catch (err) {
        if (retires + 1 < maxRertries) retry();
    }
}

export default function redisLock (client, lockName, maxRetries=Infinity) {
    return new Promise(resolve => {
        acquireLock(client, lockName, 0, maxRetries, lockTimeoutValue => {
            resolve(async () => {
                if (lockTimeoutValue > Date.now()) {
                    return client.del(lockName);
                }
            });
        });
    });
}
