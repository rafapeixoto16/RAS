/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import v1Router from './v1/index.js';
import rateLimiterMiddleware from './utils/limiter.js';
import {serverIsReady, startPLServer, promMiddleware} from "@picturas/ms-helper";

const app = express();
const port = 3000;

// Default configs
app.use(promMiddleware());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}));
app.use(rateLimiterMiddleware);

// Routers
app.use('/v1', v1Router);

// 404
app.use((req, res) => {
    res.sendStatus(404);
});

// Error Handler
app.use((err, req, res) => {
    res.status(err.status || 500).send();
});

// Listen
app.listen(port, () => {
    serverIsReady();
    console.log(`Server started on port ${port}`);
});

startPLServer();
