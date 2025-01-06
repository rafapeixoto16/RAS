/* eslint no-console: 0 */

import socketIo from 'socket.io';
import Redis from 'ioredis';
import amqp from 'amqplib';
import { createAdapter } from '@socket.io/redis-streams-adapter';

const port = 3000;

const redis = new Redis({
    host: process.env.WS_ADAPTER_REDIS_HOST,
    password: process.env.WS_ADAPTER_REDIS_PASSWORD,
});

await redis.connect();

const io = socketIo({
    adapter: createAdapter(redis),
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

amqp.connect(process.env.RABBITMQ_URL, (connErr, conn) => {
    if (connErr) throw connErr;

    conn.createChannel((chanErr, channel) => {
        if (chanErr) throw chanErr;

        channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: true });
        console.log(
            `Listening to RabbitMQ queue: ${process.env.RABBITMQ_QUEUE}`
        );

        channel.consume(process.env.RABBITMQ_QUEUE, (event) => {
            const messageContent = event.content.toString();
            console.log(`Received from RabbitMQ: ${messageContent}`);

            io.emit('rabbitmq_message', messageContent);

            channel.ack(event);
        });
    });
});

io.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
