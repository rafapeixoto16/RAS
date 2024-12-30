import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import cocoSsd from '@tensorflow-models/coco-ssd';
import tf from '@tensorflow/tfjs-node';

const objIdentificationSchema = schemaValidation.object({
    minScore: schemaValidation.number().min(0).max(1).default(0.3),
});

async function detectObjects(imageBuffer, minScore = 0.3) {
    const model = await cocoSsd.load();
    const image = tf.node.decodeImage(imageBuffer);

    const originalWidth = image.shape[1];
    const originalHeight = image.shape[0];

    // Resizing image for performance reasons
    const targetWidth = 640;
    const targetHeight = 480;
    const resizedImage = tf.image.resizeBilinear(image, [
        targetHeight,
        targetWidth,
    ]);

    const intImage = resizedImage.cast('int32');
    const predictions = await model.detect(intImage, 20, minScore);

    // Adjusting the bounding boxes to the original dimensions
    const scaledPredictions = predictions.map((prediction) => {
        const [x, y, width, height] = prediction.bbox;

        const scaledX = (x / targetWidth) * originalWidth;
        const scaledY = (y / targetHeight) * originalHeight;
        const scaledWidth = (width / targetWidth) * originalWidth;
        const scaledHeight = (height / targetHeight) * originalHeight;

        return {
            ...prediction,
            bbox: [scaledX, scaledY, scaledWidth, scaledHeight],
        };
    });

    image.dispose();
    resizedImage.dispose();
    intImage.dispose();

    return scaledPredictions;
}

async function objectIdentificationHandler(imageBuffer, params) {
    const { minScore } = params;
    const predictions = await detectObjects(imageBuffer, minScore);

    const objectCount = predictions.length;

    const output = {
        objectCount,
        details: predictions.map((obj) => ({
            boundingBox: obj.bbox,
            score: obj.score,
            objectName: obj.class,
        })),
    };

    const jsonOutput = JSON.stringify(output, null, 2);
    return [jsonOutput, 'json'];
}

createFilterHandler(
    'object-identification',
    objIdentificationSchema,
    objectIdentificationHandler
);
