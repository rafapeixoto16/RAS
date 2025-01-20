/* eslint no-console: 0 */

import { connectToRabbitMQ } from './utils/filterCall.js';
import { serverIsReady, startPLServer } from '@picturas/ms-helper';
import redisClient from './config/redisConfig.js';

let connections = 0;
const maxConnections = 2; // rabbit redis

function incConnections() {
    connections++;
    if (connections === maxConnections) serverIsReady();
}

connectToRabbitMQ().then(() => {
    incConnections();
    console.log("RabbitMQ connected");
});

redisClient.on('connect', () => {
    incConnections();
    console.log('Connected to Redis');
});

startPLServer();
