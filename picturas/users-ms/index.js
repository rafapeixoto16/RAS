/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';
import {useGatewayAuth} from "@picturas/ms-helper";
import {setupBucket} from "./config/minioClient.js";

const app = express();
const port = 3000;

const mongoBD = `mongodb://${process.env.USERS_DB_USERNAME}:${process.env.USERS_DB_PASSWORD}@${process.env.USERS_DB_HOST}:${process.env.USERS_DB_PORT}/users?authSource=admin`;
mongoose.connect(mongoBD);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

db.once('open', () => {
    console.log('MongoDB connection established');
});

setupBucket().then(() => {});

// Default configs
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
    console.log(`Server started on port ${port}`);
});
