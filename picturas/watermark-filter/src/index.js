// Thanks to transparent-background for the bulk of the js code

import { createFilterHandler } from '@picturas/filter-helper';
import { schemaValidation } from '@picturas/schema-validation';
import execa from 'execa';
import { watermarkPath, venvDir } from './utils';

const toolName = 'watermark';

if (process.env.EXPORT_SCHEMA === 'true') {
    /* createFilterHandler(
        toolName,
        schemaValidation.object({}),
        (_1, _2, _3) => {}
    ); */
    process.exit(0);
}

(async () => {
    await execa(watermarkPath, ['-m', 'picturas_watermark_tool_ms.main'], {
        path: 'picturas-watermark-tool-ms',
        reject: false,
        env: {
            RABBITMQ_HOST: process.env.RABBITMQ_HOST,
            RABBITMQ_PORT: process.env.RABBITMQ_PORT,
            RABBITMQ_USER: process.env.RABBITMQ_USERNAME,
            RABBITMQ_PASS: process.env.RABBITMQ_PASSWORD,
            RABBITMQ_REQUESTS_QUEUE_NAME: toolName,
            RABBITMQ_RESULTS_EXCHANGE: process.env.RABBITMQ_FILTER_OUTPUT_QUEUE,
            VIRTUAL_ENV: venvDir,
        },
    });
})();
