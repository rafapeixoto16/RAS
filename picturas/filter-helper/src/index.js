import amqp from 'amqplib';
import { readFileSync, writeFileSync } from 'node:fs';
import { toJsonSchema } from '@picturas/schema-validation';
import {recordRabbitMQMetrics, serverIsReady, startPLServer} from "@picturas/ms-helper";

export function createFilterHandler(filterName, isPremium, paramsSchema, imageHandler) {
    if (process.env.EXPORT_SCHEMA === 'true') {
        const args = process.argv.slice(2);

        if (args.length === 0) process.exit(1);

        const schemaPath = args[0];

        const fileContent = readFileSync(schemaPath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        jsonData[filterName] = {isPremium, schema: toJsonSchema(filterName, paramsSchema)};

        writeFileSync(schemaPath, JSON.stringify(jsonData, null, 2), 'utf-8');

        process.exit(0);
    }

    const inputQueue = filterName;
    const outputExchange = process.env.FILTER_OUTPUT_EXCHANGE;
    const routingKey = process.env.FILTER_OUTPUT_ROUTING_KEY;
    const metrics = recordRabbitMQMetrics();

    async function processMessage(content) {
        const { messageId, parameters } = content;
        const { inputImageURI, outputImageURI, ...args } = parameters;

        let processingTime = 0;
        let data = {};
        let error = false;

        const validatedParams = paramsSchema.safeParse(args);
        if (!validatedParams.success) {
            error = true;
            data = validatedParams.errors;
        } else {
            try {
                const inputFormat = inputImageURI.split('.').pop();
                const imageBuffer = await readFileSync(inputImageURI);

                const start = Date.now();
                const result = await imageHandler(
                    imageBuffer,
                    inputFormat,
                    validatedParams.data
                );
                const end = Date.now();
                processingTime = (end - start) / 1000;

                let output, outputFormat;

                if (Array.isArray(result)) {
                    [output, outputFormat] = result;
                } else {
                    output = result;
                    outputFormat = inputFormat;
                }

                const kind = outputFormat === 'json' ? 'text' : 'image';
                const outputPath = outputImageURI.split('.')[0];
                const uploadedImageURI = `${outputPath}.${outputFormat}`;

                await writeFileSync(uploadedImageURI, output);

                data = {
                    type: kind,
                    imageURI: uploadedImageURI,
                };
            } catch (err) {
                error = true;
                data = err.message;
            }
        }

        metrics({
            success: error,
            duration: processingTime
        });

        return {
            messageId: `completion-${messageId}`,
            correlationId: messageId,
            timestamp: Date.now().toString(),
            status: error ? 'error' : 'success',
            [error ? 'error' : 'output']: data,
            metadata: {
                processingTime,
                microservice: filterName,
            },
        };
    }

    (async () => {
        const connection = await amqp.connect(
            `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
        );
        const channel = await connection.createChannel();

        await channel.assertQueue(inputQueue, { durable: true });
        await channel.assertExchange(outputExchange, 'direct', { durable: true });

        channel.consume(inputQueue, async (message) => {
            if (message) {
                const content = JSON.parse(message.content.toString());
                const result = await processMessage(content);

                channel.publish(
                    outputExchange,
                    routingKey,
                    Buffer.from(JSON.stringify(result)),
                    {
                        persistent: true,
                    }
                );

                channel.ack(message);
            }
        });

        serverIsReady();
    })();

    startPLServer();
}
