import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import cocoSsd from '@tensorflow-models/coco-ssd';
import tf from '@tensorflow/tfjs-node';
import { createCanvas, loadImage } from 'canvas';

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

async function drawBoundingBoxes(imageBuffer, predictions) {
    const image = await loadImage(imageBuffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);
    const colors = [
        'red',
        'blue',
        'green',
        'purple',
        'orange',
        'cyan',
        'magenta',
    ];

    predictions.forEach((prediction, index) => {
        const { bbox, class: objectName } = prediction;
        const [x, y, width, height] = bbox;

        const color = colors[index % colors.length];

        // Draw the bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.strokeRect(x, y, width, height);

        // Adjust background box for the text
        ctx.font = '24px Arial';
        const textWidth = ctx.measureText(objectName).width;

        // Rectangle for the text
        ctx.fillStyle = color;
        ctx.fillRect(x - 2, y - 28, textWidth + 10, 26);
        ctx.fillStyle = 'white';
        ctx.fillText(objectName, x + 4, y - 6);
    });

    return canvas.toBuffer();
}

async function objectIdentificationHandler(imageBuffer, params) {
    const { minScore } = params;
    const predictions = await detectObjects(imageBuffer, minScore);

    if (predictions.length === 0)
        return {
            error: '404',
            message: `Nenhum objeto foi detectado.`,
        };

    return drawBoundingBoxes(imageBuffer, predictions);
}

createFilterHandler(
    'object-identification',
    objIdentificationSchema,
    objectIdentificationHandler
);
