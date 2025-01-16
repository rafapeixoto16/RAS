/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import projectRouter from './routes/projects.js';
import {setupBucket} from "./config/minioClient.js";
import {requiresAuth, useGatewayAuth} from "@picturas/ms-helper";
import {getLimitsMiddleware, isPremiumMiddleware} from "./utils/premium.js";
import { connectToRabbitMQ } from './utils/filterCall.js'
import {serverIsReady, startPLServer} from "@picturas/ms-helper";

const app = express();
const port = 3000;

let connections = 0;
const maxConnections = 4; // express s3 mongo rabbit

function incConnections() {
    connections++;
    if (connections === maxConnections) serverIsReady();
}

const mongoBD = `mongodb://${process.env.PROJ_DB_USERNAME}:${process.env.PROJ_DB_PASSWORD}@${process.env.PROJ_DB_HOST}:${process.env.PROJ_DB_PORT}/projects?authSource=admin&authMechanism=SCRAM-SHA-256`;
mongoose.connect(mongoBD);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

db.once('open', async () => {
    incConnections();
    console.log('MongoDB connection established');
});

setupBucket().then(() => {
    incConnections();
    console.log('S3 connection established');
});

connectToRabbitMQ().then(() => {
    incConnections();
    console.log("RabbitMQ connected");
});

// Default configs
app.use(morgan('dev'));
app.use(express.json());

// Auth from Gateway
app.use(useGatewayAuth);
app.use(requiresAuth);
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
    incConnections();
    console.log(`Server started on port ${port}`);
});

startPLServer();
