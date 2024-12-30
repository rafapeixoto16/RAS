import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function exportSchema(filterName, paramsSchema) {
    const args = process.argv.slice(2);

    if (args.length === 0) process.exit(1);

    const schemaPath = args[0];

    const fileContent = readFileSync(schemaPath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    jsonData[filterName] = zodToJsonSchema(paramsSchema, filterName);

    writeFileSync(schemaPath, JSON.stringify(jsonData, null, 2), 'utf-8');

    process.exit(0);
}

async function downloadImage(imagePath) {
    return readFileSync(imagePath);
}

async function uploadImage(buffer, outputPath) {
    const outputFilePath = path.resolve(outputPath);
    writeFileSync(outputFilePath, buffer);
}

export function createFilterHandler(filterName, paramsSchema, imageHandler) {
    if (process.env.EXPORT_SCHEMA === 'true') {
        exportSchema(filterName, paramsSchema);
    }

    const params = {};
    const imagePath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../sample.jpg'
    );
    const outputPath = 'sample-proc';

    // TODO use env test for running with sample image

    (async () => {
        const validatedParams = paramsSchema.safeParse(params);

        if (!validatedParams.success) {
            // validatedParams.error
            process.exit(1);
        }

        const inputFormat = imagePath.split('.').pop();
        const imageBuffer = await downloadImage(imagePath);
        const result = await imageHandler(
            imageBuffer,
            inputFormat,
            validatedParams.data
        );

        let output;
        let outputFormat;

        if (Array.isArray(result)) {
            [output, outputFormat] = result;
        } else {
            output = result;
            outputFormat = inputFormat;
        }

        // TODO content hash for name?

        await uploadImage(output, `${outputPath}.${outputFormat}`);
    })();

    setTimeout(() => {}, 1000);
}

export { z as schemaValidation };
