const DEFAULT_TIMEOUT = 5000;
const DEFAULT_RETRY_DELAY = 50;

async function acquireLock (client, lockName, onLockAcquired) {
    function retry () {
        setTimeout(() => {
            acquireLock(client, lockName, onLockAcquired);
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
        retry();
    }
}

export default function redisLock (client, lockName) {
    return new Promise(resolve => {
        acquireLock(client, lockName, lockTimeoutValue => {
            resolve(async () => {
                if (lockTimeoutValue > Date.now()) {
                    return client.del(lockName);
                }
            });
        });
    });
}
