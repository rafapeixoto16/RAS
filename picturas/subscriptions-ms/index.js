/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import subscriptionsRouter from './routes/subscriptions.js';
import {useGatewayAuth} from "@picturas/ms-helper";

const app = express();
const port = 3000; //TODO

const mongoBD = `mongodb://${process.env.SUBS_DB_USERNAME}:${process.env.SUBS_DB_PASSWORD}@${process.env.SUBS_DB_HOST}:${process.env.SUBS_DB_PORT}/subscriptions?authSource=admin`;
mongoose.connect(mongoBD);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

db.once('open', () => {
    console.log('MongoDB connection established');
});

// Default configs
app.use(morgan('dev'));
app.use(express.json());

// Auth from Gateway
app.use(useGatewayAuth);

// Routers
app.use('/', subscriptionsRouter);

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
