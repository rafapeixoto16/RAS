import {z} from 'zod';
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

async function downloadImage(imagePath) {
    console.log(`Downloading image from: ${imagePath}`);
    return readFileSync(imagePath);
}

async function uploadImage(buffer, outputPath) {
    const outputFilePath = path.resolve(outputPath);
    writeFileSync(outputFilePath, buffer);
    console.log(`Uploaded image to: ${outputFilePath}`);
    return outputFilePath;
}

export function createFilterHandler(filterName, paramsSchema, imageHandler) {
    const params = {};
    const imagePath = path.join(fileURLToPath(import.meta.url), "../../sample.jpg");
    const outputPath = "sample-proc.jpg";

    // TODO use env test for running with sample image
    // TODO auto generate schemas based on environment vars, I think it is schema._def

    (async () => {
        try {
            const validatedParams = paramsSchema.parse(params);

            const imageBuffer = await downloadImage(imagePath);

            const processedImage = await imageHandler(imageBuffer, validatedParams);

            const resultPath = await uploadImage(processedImage, outputPath);

            return resultPath;
        } catch (error) {
            console.error('Error in filter handler:', error);
            throw error;
        }
    })()

    setTimeout(() => {
    }, 1000);
}

export {z as schemaValidation};
