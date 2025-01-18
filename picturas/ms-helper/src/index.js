import express from 'express';
import Prometheus from 'prom-client';
import ResponseTime from 'response-time';

// Prometheus & Kubernetes Probes

const port = 9121;
const app = express();
let isReady = false;
const requestDurationBuckets = [0.1, 0.5, 1, 1.5];

export function promMiddleware() {
    const labels = ['route', 'method', 'status'];

    const requestCount = new Prometheus.Counter({
        name: 'picturas_http_requests_total',
        help: 'Counter for total requests received',
        labelNames: labels,
    });
    const requestDuration = new Prometheus.Histogram({
        name: 'picturas_http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: labels,
        buckets: requestDurationBuckets
    });

    const middleware = ResponseTime((req, res, time) => {
        const {
            originalUrl,
            method,
        } = req;
        const status = `${Math.floor(res.statusCode / 100)}XX`;
        const labelsDef = {
            route: originalUrl,
            method,
            status,
        };

        requestCount.inc(labelsDef);
        requestDuration.observe(labelsDef, time / 1000);
    });

    Prometheus.collectDefaultMetrics();

    return middleware;
}

export function recordRabbitMQMetrics() {
    const labels = [];

    const requestCount = new Prometheus.Counter({
        name: 'picturas_filter_requests_total',
        help: 'Counter for total requests received',
        labelNames: labels,
    });
    const successCount = new Prometheus.Counter({
        name: 'picturas_filter_success_total',
        help: 'Counter for successful Filter processing',
        labelNames: labels,
    });
    const failCount = new Prometheus.Counter({
        name: 'picturas_filter_fail_total',
        help: 'Counter for failed Filter processing',
        labelNames: labels,
    });
    const filterDuration = new Prometheus.Histogram({
        name: 'picturas_filter_duration_seconds',
        help: 'Duration of Filter processing in seconds',
        labelNames: labels,
        buckets: requestDurationBuckets,
    });

    Prometheus.collectDefaultMetrics();

    return function processMetrics({ success, duration }) {
        requestCount.inc();

        if (success) {
            successCount.inc();
        } else {
            failCount.inc();
        }

        if (typeof duration === 'number') {
            filterDuration.observe(duration);
        }
    };
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

    req.user = JSON.parse(token);
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

import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';  // secret key

export const authSubsProj = (req, res, next) => {
    
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        
        const decoded = jwt.verify(token, jwtSecret);  

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

