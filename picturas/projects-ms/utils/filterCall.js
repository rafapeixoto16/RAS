// Thanks Chat for the boilerplate
import amqp from 'amqplib';

const {
    RABBITMQ_HOST,
    RABBITMQ_PORT,
    RABBITMQ_USERNAME,
    RABBITMQ_PASSWORD,
    FILTER_OUTPUT_QUEUE,
} = process.env;

const RABBITMQ_URL = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

const connection = await amqp.connect(RABBITMQ_URL);
const channel = await connection.createChannel();

async function checkQueueExistsAndSend(queueName, message) {
    try {
        // Check if the queue exists by asserting it
        const queueInfo = await channel.checkQueue(queueName);
        if (!queueInfo) {
            console.log(`Queue "${queueName}" does not exist.`);
            await channel.close();
            await connection.close();
            return;
        }

        console.log(`Queue "${queueName}" exists. Sending message...`);

        // Send the message to the queue
        const sent = channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true,
        });
        if (!sent) {
            console.error('Failed to send message.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function readFromOutputQueue() {
    try {
        // Assert the output queue
        await channel.assertQueue(FILTER_OUTPUT_QUEUE, { durable: true });

        console.log(`Reading messages from queue: ${FILTER_OUTPUT_QUEUE}`);

        // Consume messages from the output queue
        channel.consume(
            FILTER_OUTPUT_QUEUE,
            (msg) => {
                if (msg !== null) {
                    console.log('Received message:', msg.content.toString());
                    channel.ack(msg); // Acknowledge the message
                }
            },
            { noAck: false }
        );
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
(async () => {
    const queueName = 'your_queue_name';
    const message = 'Test message';
    await checkQueueExistsAndSend(queueName, message);
    await readFromOutputQueue();
})();
