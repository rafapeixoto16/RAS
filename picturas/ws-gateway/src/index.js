import socketIo from 'socket.io';
import Redis from 'ioredis';
import amqp from 'amqplib';
import { createAdapter } from '@socket.io/redis-streams-adapter';

const port = process.env.PORT || 3000;

const redis = new Redis({
    port: process.env.WS_ADAPTER_REDIS_PORT,
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

async function listenToRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: true });
        console.log(`Listening to RabbitMQ queue: ${process.env.RABBITMQ_QUEUE}`);

        channel.consume(process.env.RABBITMQ_QUEUE, (msg) => {
            if (msg !== null) {
                const messageContent = msg.content.toString();
                console.log(`Received from RabbitMQ: ${messageContent}`);

                io.emit('rabbitmq_message', messageContent);

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
}

listenToRabbitMQ();

io.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
