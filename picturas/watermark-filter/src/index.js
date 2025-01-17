// Thanks to transparent-background for the bulk of the js code

import {execa} from 'execa';
import { venvPythonPath } from './utils.js';
import amqp from 'amqplib';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import {serverIsReady, startPLServer} from "@picturas/ms-helper";

const toolName = 'watermark';

if (process.env.EXPORT_SCHEMA === 'true') {
    process.exit(0);
}

(async () => {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);
    const channel = await connection.createChannel();
    await channel.assertQueue(toolName, { durable: true });
    await channel.close();
    await connection.close();

    serverIsReady();

    await execa(venvPythonPath, ['-m', 'picturas_watermark_tool_ms.main'], {
        stdout: 'inherit',
        stderr: 'inherit',
        path: 'picturas-watermark-tool-ms',
        reject: false,
        env: {
            RABBITMQ_HOST: process.env.RABBITMQ_HOST,
            RABBITMQ_PORT: process.env.RABBITMQ_PORT,
            RABBITMQ_USER: process.env.RABBITMQ_USERNAME,
            RABBITMQ_PASS: process.env.RABBITMQ_PASSWORD,
            RABBITMQ_REQUESTS_QUEUE_NAME: toolName,
            RABBITMQ_RESULTS_EXCHANGE: process.env.FILTER_OUTPUT_EXCHANGE,
            RABBITMQ_RESULTS_ROUTING_KEY: process.env.FILTER_OUTPUT_ROUTING_KEY,
            PICTURAS_MS_NAME: toolName,
            PICTURAS_WATERMARK_IMAGE_PATH: resolve(dirname(fileURLToPath(import.meta.url)), '../picturas-watermark-tool-ms/watermark.png')
        },
    });
})();

startPLServer();
