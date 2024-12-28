import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs-node';

const smartCropSchema = schemaValidation.object({});

async function smartCropHandler(imageBuffer, _, _params) {
    const model = await cocoSsd.load();
    const tensor = tf.node.decodeImage(imageBuffer, 3);
    const predictions = await model.detect(tensor);

    tensor.dispose();

    if (!predictions || predictions.length === 0) {
        return imageBuffer;
    }

    // Calculate area for each detected object
    const areas = predictions.map((pred) => {
        const [_x, _y, width, height] = pred.bbox;
        return {
            ...pred,
            area: width * height,
        };
    });

    // Find the largest area
    const largestArea = Math.max(...areas.map((pred) => pred.area));

    // Filter objects with at least 85% of the largest area and limit to 5 objects
    const selectedObjects = areas
        .filter((pred) => pred.area >= 0.85 * largestArea)
        .sort((a, b) => b.area - a.area) // Sort by area descending
        .slice(0, 5);

    if (selectedObjects.length === 0) {
        return imageBuffer;
    }

    // Calculate a tight bounding box around selected objects
    const tightBbox = selectedObjects.reduce(
        (acc, obj) => {
            const [x, y, width, height] = obj.bbox;
            return {
                xMin: Math.min(acc.xMin, x),
                yMin: Math.min(acc.yMin, y),
                xMax: Math.max(acc.xMax, x + width),
                yMax: Math.max(acc.yMax, y + height),
            };
        },
        {
            xMin: Infinity,
            yMin: Infinity,
            xMax: -Infinity,
            yMax: -Infinity,
        }
    );

    // Extract the tight bounding box
    const {
        xMin,
        yMin,
        xMax,
        yMax,
    } = tightBbox;
    const x = Math.max(Math.floor(xMin), 0);
    const y = Math.max(Math.floor(yMin), 0);
    const width = Math.max(Math.floor(xMax - xMin), 1);
    const height = Math.max(Math.floor(yMax - yMin), 1);

    return sharp(imageBuffer)
        .extract({
            left: x,
            top: y,
            width,
            height,
        })
        .toBuffer();
}

createFilterHandler('smart-crop', smartCropSchema, smartCropHandler);
