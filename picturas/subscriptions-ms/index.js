/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import subscriptionsRouter from './routes/subscriptions.js';
import privateRouter from './routes/private.js';
import {promMiddleware, useGatewayAuth} from "@picturas/ms-helper";
import {initStripe} from "./config/stripe.js";
import {serverIsReady, startPLServer} from "@picturas/ms-helper";

const app = express();
const port = 3000;

let connections = 0;
const maxConnections = 3; // express mongo stripe

function incConnections() {
    connections++;
    if (connections === maxConnections) serverIsReady();
}

// Inits
const mongoBD = `mongodb://${process.env.SUBS_DB_USERNAME}:${process.env.SUBS_DB_PASSWORD}@${process.env.SUBS_DB_HOST}:${process.env.SUBS_DB_PORT}/subscriptions?authSource=admin`;
mongoose.connect(mongoBD);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

db.once('open', () => {
    incConnections();
    console.log('MongoDB connection established');
});

initStripe().then(() => {
    incConnections();
    console.log('Stripe connection!');
});

// Default configs
app.use(promMiddleware());
app.use(morgan('dev'));
app.use(express.json({
    verify: (req, res, buf, _) => {
        if (req.originalUrl.startsWith('/public/webhook')) {
            req.rawBody = buf; // Save raw body for Stripe webhook verification
        }
    }
}));

// Private Router
app.use('/private', privateRouter);

// Auth from Gateway
app.use(useGatewayAuth);

// Routers
app.use('/public', subscriptionsRouter);

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
