/* eslint no-console: 0 */

import {Server as SocketIo} from 'socket.io';
import {createServer} from 'node:http';
import amqp from 'amqplib';

const port = 3000;

const server = createServer();
const io = new SocketIo(server);
const userSessions = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    userSessions[socket.id] = {
        expiry: expiry,
        authenticated: false,
    };

    const timeout = setTimeout(() => {
        console.log('Session expired for socket:', socket.id);
        socket.emit('auth_error', 'Disconnected due to limit exceeded');
        socket.disconnect();
        delete userSessions[socket.id];
    }, expiry - Date.now());

    socket.on('migrate', (token) => {
        jwt.verify(token, AUTH_SECRET, (err, decoded) => {
            if (err) {
                console.log('Invalid token for socket:', socket.id);
                socket.emit('auth_error', 'Invalid token');
            } else {
                console.log('Token validated for socket:', socket.id);
                userSessions[socket.id] = {
                    expiry: null,
                    authenticated: true,
                    user: decoded,
                };
                clearTimeout(timeout);
                socket.emit('auth_success', 'Session extended');
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        if (timeout) clearTimeout(timeout);
        delete userSessions[socket.id];
    });
});

amqp.connect(
    `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
    (connErr, conn) => {
        if (connErr) throw connErr;

        conn.createChannel((chanErr, channel) => {
            if (chanErr) throw chanErr;

            channel.assertQueue(process.env.RABBITMQ_QUEUE, {durable: true});
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
    }
);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
