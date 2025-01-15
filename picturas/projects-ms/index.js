/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import projectRouter from './routes/projects.js';
import {setupBucket} from "./config/minioClient.js";
import {requiresAuth, useGatewayAuth} from "@picturas/ms-helper";
import {getLimitsMiddleware, isPremiumMiddleware} from "./utils/premium.js";

const app = express();
const port = 3000;

const mongoBD = `mongodb://${process.env.PROJ_DB_USERNAME}:${process.env.PROJ_DB_PASSWORD}@${process.env.PROJ_DB_HOST}:${process.env.PROJ_DB_PORT}/projects?authSource=admin&authMechanism=SCRAM-SHA-256`;
mongoose.connect(mongoBD);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

db.once('open', async () => {
    console.log('MongoDB connection established');
});

setupBucket().then(() => {});

// Default configs
app.use(morgan('dev'));
app.use(express.json());

// TODO dev
const startTime = Math.floor(Date.now() / 1000);

const devAuthMiddleware = (req, res, next) => {
    req.user = {
        isGuest: false,
        _id: '678561df8f497bc6dbe757f2',
        email: 'demo@demo.com',
        username: 'demo',
        iat: startTime
    }
    next();
}

// Auth from Gateway
app.use(useGatewayAuth);
//app.use(requiresAuth); TODO
app.use(devAuthMiddleware)
app.use(isPremiumMiddleware);
app.use(getLimitsMiddleware);

// Routers
app.use('/', projectRouter);

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
    console.log(`Server started on port ${port}`);
});
