import { createFilterHandler } from '@picturas/filter-helper';
import { schemaValidation } from '@picturas/schema-validation';
import { createWorker, createScheduler } from 'tesseract.js';

const ocrSchema = schemaValidation.object({
    language: schemaValidation.string().default('eng'),
});

// The docs say that the worker should be created once and reused
// but "using the same worker/scheduler for a week straight within Node.js server code will cause problems"
let scheduler = null;

const createAndAddWorker = async (language) => {
    try {
        const worker = await createWorker(language, 3);
        scheduler.addWorker(worker);
    } catch (error) {
        throw new Error(
            `Language '${language}' is not supported or failed to load.`
        );
    }
};

const initializeScheduler = async (maxWorkers, language) => {
    if (!scheduler) {
        scheduler = createScheduler();
        const workerPromises = [];
        for (let i = 0; i < maxWorkers; i += 1) {
            workerPromises.push(createAndAddWorker(language));
        }
        await Promise.all(workerPromises);
    }
};

const terminateScheduler = async () => {
    if (scheduler) {
        await scheduler.terminate();
        scheduler = null;
    }
};

const resetScheduler = async () => {
    await terminateScheduler();
};

async function ocrHandler(imageBuffer, params) {
    const { language } = params;
    const maxWorkers = 4;

    try {
        await initializeScheduler(maxWorkers, language);

        const jobDetails = await scheduler.addJob('recognize', imageBuffer);

        const output = {
            text: jobDetails.data.text,
            details: jobDetails.data.words.map((word) => ({
                text: word.text,
                confidence: word.confidence,
            })),
        };

        const jsonOutput = JSON.stringify(output, null, 2);

        return [jsonOutput, 'json'];
    } catch (error) {
        throw new Error(`OCR processing failed: ${error.message}`);
    }
}

setInterval(() => {
    resetScheduler().then(() => {});
}, 500 * 1000); // every 500 seconds, maybe too frequent

createFilterHandler('ocr', true, ocrSchema, ocrHandler);
