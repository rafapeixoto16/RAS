/* eslint no-console: 0 */

import socketIo from 'socket.io';
import amqp from 'amqplib';

const port = 3000;

const io = socketIo();

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
        console.log(`Listening to RabbitMQ queue: ${process.env.RABBITMQ_QUEUE}`);

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
