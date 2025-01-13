import express from 'express';
import Prometheus from 'prom-client';
import ResponseTime from 'response-time';

// Prometheus & Kubernetes Probes

const port = 9091;
const app = express();
let isReady = false;

export function promMiddleware(requestDurationBuckets = [0.1, 0.5, 1, 1.5]) {
    const labels = ['route', 'method', 'status'];

    const requestCount = new Prometheus.Counter({
        name: 'http_requests_total',
        help: 'Counter for total requests received',
        labels,
    });
    const requestDuration = new Prometheus.Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labels,
        requestDurationBuckets,
    });

    const middleware = ResponseTime((req, res, time) => {
        const {
            originalUrl,
            method,
        } = req;
        const status = `${Math.floor(res.statusCode / 100)}XX`;
        const labels = {
            route: originalUrl,
            method,
            status,
        };

        requestCount.inc(labels);
        requestDuration.observe(labels, time / 1000);
    });

    Prometheus.collectDefaultMetrics({
        prefix: options.prefix,
    });

    return middleware;
}

export function serverIsReady() {
    isReady = true;
}

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    return res.end(await Prometheus.register.metrics());
});

app.get('/healthz', (req, res) => {
    res.status(200)
        .send('I am healthy');
});

app.get('/liveness', (req, res) => {
    res.status(200)
        .send('I am alive');
});

app.get('/readiness', (req, res) => {
    if (isReady) {
        res.status(200).send('I am ready.');
    } else {
        res.status(503).send('I am not ready.');
    }
});

export function startPLServer() {
    app.listen(port, () => {
        console.log('Prometheus Metrics and Probes ready');
    });
}

// Auth
export function useGatewayAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        next();
        return;
    }

    req.user = JSON.parse(req.headers.authorization);
    next();
}

export const requiresAuth = (req, res, next) => {
    if (!req.user) {
        res.sendStatus(401);
    } else {
        next();
    }
};

export const requiresNonGuest = (req, res, next) => {
    if (!req.user || req.user.isGuest) {
        res.sendStatus(401);
    } else {
        next();
    }
}

const startTime = Math.floor(Date.now() / 1000);

export const devAuthMiddleware = (req, res, next) => {
    req.user = {
        isGuest: false,
        _id: '678561df8f497bc6dbe757f2',
        email: 'demo@demo.com',
        username: 'demo',
        limits: {ttl: false, upload4k: true},
        iat: startTime
    }
}
