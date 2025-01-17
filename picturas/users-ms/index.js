/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';
import {promMiddleware, useGatewayAuth} from "@picturas/ms-helper";
import {setupBucket} from "./config/minioClient.js";
import {serverIsReady, startPLServer} from "@picturas/ms-helper";

const app = express();
const port = 3000;

let connections = 0;
const maxConnections = 3; // mongo s3 express

function incConnections() {
    connections++;
    if (connections === maxConnections) serverIsReady();
}

const mongoBD = `mongodb://${process.env.USERS_DB_USERNAME}:${process.env.USERS_DB_PASSWORD}@${process.env.USERS_DB_HOST}:${process.env.USERS_DB_PORT}/users?authSource=admin`;
mongoose.connect(mongoBD);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

db.once('open', () => {
    incConnections();
    console.log('MongoDB connection established');
});

setupBucket().then(() => {
    incConnections();
    console.log('S3 connection established');
});

// Default configs
app.use(promMiddleware());
app.use(morgan('dev'));
app.use(express.json());

// Auth from Gateway
app.use(useGatewayAuth);

// Routers
app.use('/', usersRouter);

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
